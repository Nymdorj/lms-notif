import { Body, Controller, Get, HttpCode, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { PushNotificationDto } from './dto/push-notification.dto';
import { GetNotificationDto } from './dto/get-notification.dto';

import { ApiResponseWrapper } from '@common/decorators/api-response-wrapper.decorator';
import { NotificationService } from './notification.service';
import { SetSeentNotificationDto } from './dto/set-seen-notification.dto';
import { PushNotificationResponseDto } from './dto/push-notification-response.dto';
import { ApiResponsePagination } from '@common/decorators/api-response-pagination.decorator';
import { NotificationDto } from './dto/notification.dto';

@Controller('notification')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@ApiOperation({ summary: 'Get user push notifications' })
	@ApiResponsePagination({
		description: 'Success response',
		type: NotificationDto,
	})
	@HttpCode(200)
	@Get()
	async getNotifications(@Query() getNotificationDto: GetNotificationDto) {
		return await this.notificationService.getNotification(getNotificationDto);
	}

	@ApiOperation({ summary: 'Set seen push notification' })
	@ApiResponseWrapper({
		description: 'Success response',
		type: String,
	})
	@HttpCode(200)
	@Patch('seen')
	async setSeen(@Query() dto: SetSeentNotificationDto) {
		await this.notificationService.setSeen(dto.pushId);

		return 'Success';
	}

	@ApiOperation({ summary: 'Send push notification' })
	@ApiResponseWrapper({
		description: 'Success response',
		type: PushNotificationResponseDto,
	})
	@HttpCode(200)
	@Post('push')
	async notify(@Body() notificationDto: PushNotificationDto) {
		return await this.notificationService.sendNotification(notificationDto);
	}
}
