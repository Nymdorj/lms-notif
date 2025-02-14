import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@prisma/prisma.service';
import { NotificationStatus, NotificationType, PushNotification } from '@prisma/client';

import * as admin from 'firebase-admin';
import { Messaging } from 'firebase-admin/lib/messaging/messaging';

import exceptions from '@exceptions/exceptions';

import { PaginationResponseDto } from '@common/dto/pagination-response.dto';
import { GetNotificationDto } from './dto/get-notification.dto';
import { PushNotificationDto } from './dto/push-notification.dto';
import { PushNotificationResponseDto } from './dto/push-notification-response.dto';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
	private readonly logger = new Logger(NotificationService.name);
	private firebaseMessaging: Messaging;

	constructor(
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService,
	) {
		this.logger.log('initializing firebase ....');
		this.logger.debug(this.configService.get('FIREBASE_CLIENT_ID'));

		admin.initializeApp({
			credential: admin.credential.cert({
				projectId: this.configService.get('FIREBASE_PROJECT_ID'),
				clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL'),
				privateKey: this.configService.get('FIREBASE_PRIVATE_KEY'),
			}),
		});
		this.firebaseMessaging = admin.messaging();
	}

	async getNotification(params: GetNotificationDto): Promise<PaginationResponseDto<NotificationDto[]>> {
		const skip = (params.pageNumber - 1) * params.pageSize;
		const take = params.pageSize;

		const filters = {};

		if (params.startDate && params.endDate) {
			filters['createdAt'] = {
				gte: params.startDate,
				lte: params.endDate,
			};
		}

		if (params.seen) {
			filters['pushNotification'] = { seen: true };
		}

		if (params.status) {
			filters['status'] = params.status;
		}

		const [notifications, count] = await this.prisma.$transaction([
			this.prisma.notification.findMany({
				where: {
					type: NotificationType.PUSH,
					application: params.application,
					userId: params.userId,
					...filters,
				},
				include: {
					pushNotification: true,
				},
				skip,
				take,
			}),
			this.prisma.notification.count({
				where: {
					type: NotificationType.PUSH,
					application: params.application,
					userId: params.userId,
					...filters,
				},
			}),
		]);

		return {
			data: notifications.map((notification) => ({
				id: notification.id,
				userId: notification.userId,
				application: notification.application,
				status: notification.status,
				errorMessage: notification.errorMessage,
				createdAt: notification.createdAt.toISOString(),
				updatedAt: notification.updatedAt?.toISOString(),
				batchNotificationId: notification.batchNotificationId,
				pushId: notification.pushNotification?.pushId,
				title: notification.pushNotification?.title,
				content: notification.pushNotification?.content,
				messageId: notification.pushNotification?.messageId,
				seen: notification.pushNotification?.seen,
			})),
			pageNumber: params.pageNumber,
			pageSize: params.pageSize,
			total: count,
		};
	}

	async setSeen(pushId: string): Promise<PushNotification> {
		const pushNotification = await this.prisma.pushNotification.findUnique({
			where: { pushId },
			include: { notification: true },
		});

		if (!pushNotification) {
			throw new NotFoundException();
		}

		if (pushNotification.notification.status !== NotificationStatus.SUCCESS) {
			throw new BadRequestException('Notification status is not SUCCESS');
		}

		return await this.prisma.pushNotification.update({
			where: { pushId },
			data: { seen: true },
		});
	}

	async sendNotification(notificationDto: PushNotificationDto): Promise<PushNotificationResponseDto> {
		const notification = await this.prisma.notification.create({
			data: {
				userId: notificationDto.userId,
				application: notificationDto.application,
				type: NotificationType.PUSH,
				status: NotificationStatus.PENDING,
				pushNotification: {
					create: {
						deviceToken: notificationDto.deviceToken,
						title: notificationDto.title,
						content: notificationDto.content,
						imageUrl: notificationDto.imageUrl,
						data: notificationDto.data,
					},
				},
			},
		});

		const message = {
			notification: {
				title: notificationDto.title,
				body: notificationDto.content,
				imageUrl: notificationDto.imageUrl,
			},
			data: notificationDto.data,
			token: notificationDto.deviceToken,
		};

		try {
			const messageId = await this.firebaseMessaging.send(message);
			this.logger.debug('Successfully sent message:', messageId);

			await this.prisma.notification.update({
				where: { id: notification.id },
				data: {
					status: NotificationStatus.SUCCESS,
					pushNotification: {
						update: {
							messageId,
						},
					},
				},
			});

			return {
				messageId,
				id: notification.id,
				status: NotificationStatus.SUCCESS,
			};
		} catch (error: unknown) {
			this.logger.error('Error sending notification: ', error);
			this.logger.error('Error sending notification: ', (<Record<string, unknown>>error).errorInfo);

			let errorMessage = 'Unexpected error';

			const firebaseError = <Record<string, unknown>>error;
			const firebaseErrorInfo = <Record<string, string>>firebaseError.errorInfo;
			if ('message' in firebaseErrorInfo) {
				errorMessage = `${firebaseErrorInfo.code}::${firebaseErrorInfo.message}`;
			}

			await this.prisma.notification.update({
				where: { id: notification.id },
				data: {
					errorMessage,
					status: NotificationStatus.FAILED,
				},
			});

			throw new exceptions.FailedPushNotificationException(errorMessage);
		}
	}
}
