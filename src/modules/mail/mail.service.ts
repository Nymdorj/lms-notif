import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

import { NotificationStatus, NotificationType } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';

import { SendMailDto } from './dto/send-mail.dto';
import exceptions from '@exceptions/exceptions';

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name);

	constructor(
		private readonly mailerService: MailerService,
		private readonly prisma: PrismaService,
	) {}

	async sendEmail(mailDto: SendMailDto, files: Array<Express.Multer.File>) {
		const notification = await this.prisma.notification.create({
			data: {
				userId: mailDto.userId,
				application: mailDto.application,
				type: NotificationType.EMAIL,
				status: NotificationStatus.PENDING,
				emailNotification: {
					create: {
						from: mailDto.from,
						recipient: mailDto.recipient.join(','),
						subject: mailDto.subject,
						content: mailDto.text,
						html: mailDto.html,
					},
				},
			},
		});

		try {
			const result = <unknown>await this.mailerService.sendMail({
				to: mailDto.recipient,
				subject: mailDto.subject,
				text: mailDto.text,
				html: mailDto.html,
				attachments: mailDto.attachments,
			});

			// attachments: files.map((file) => ({
			// 	filename: file.originalname,
			// 	content: file.buffer,
			// })),
			// attachments: [
			// 	{
			// 		filename: file.originalname,
			// 		content: file.buffer, // File buffer from Multer
			// 	},
			// ],

			await this.prisma.notification.update({
				where: { id: notification.id },
				data: {
					status: NotificationStatus.SUCCESS,
					emailNotification: {
						update: {
							messageId: (<Record<'messageId', string>>result).messageId,
						},
					},
				},
			});

			return {
				id: notification.id,
				messageId: (<Record<'messageId', string>>result).messageId,
				status: NotificationStatus.SUCCESS,
			};
		} catch (error: unknown) {
			this.logger.error('Error sending email: ', error);

			let errorMessage = 'Unexpected error';

			const mailerError = <Record<string, string>>error;

			if (mailerError.code === 'EAUTH') {
				errorMessage = 'Authentication error';
			} else if (mailerError.code === 'ECONNECTION') {
				errorMessage = 'Cannot reach SMTP server';
			} else if (mailerError.code === 'ESOCKET') {
				errorMessage = mailerError.reason ?? 'Wrong version number';
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}

			await this.prisma.notification.update({
				where: { id: notification.id },
				data: {
					errorMessage,
					status: NotificationStatus.FAILED,
				},
			});

			throw new exceptions.FailedSendMailException(errorMessage);
		}
	}
}
