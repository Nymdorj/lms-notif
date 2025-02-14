import { ApiProperty } from '@nestjs/swagger';
import { Application, NotificationStatus } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class NotificationDto {
	@ApiProperty({
		example: 1,
		description: 'Notification id {autoincreament}',
		type: Number,
	})
	@IsNotEmpty()
	id: number;

	@ApiProperty({
		example: 3,
		description: 'User unique id of CUM',
		type: String,
	})
	@IsNotEmpty()
	userId: string | null;

	@ApiProperty({
		example: Application.LMS,
		description: 'Application name: \n\n- HR\n\n- RMS\n\n- LMS\n\n- BURGER_KING',
		type: String,
		enum: Application,
	})
	@IsNotEmpty()
	application: Application;

	@ApiProperty({
		example: NotificationStatus.SUCCESS,
		description: 'Notification status',
		type: String,
		enum: NotificationStatus,
	})
	@IsNotEmpty()
	status: NotificationStatus;

	@ApiProperty({
		description: 'If notification error occurs while sending notification. Error description will be here',
		type: String,
		required: false,
	})
	errorMessage: string | null;

	@ApiProperty({
		example: '2025-02-14T06:20:38.900Z',
		description: 'Notification created date time. `ISO Date` format',
		type: String,
	})
	createdAt: string;

	@ApiProperty({
		example: '2025-02-14T06:20:39.604Z',
		description: 'Notification status updated date time. `ISO Date` format',
		type: String,
	})
	updatedAt?: string | null;

	@ApiProperty({
		description: 'Batch id',
		required: false,
		type: Number,
	})
	@IsOptional()
	batchNotificationId: number | null;

	@ApiProperty({
		description: 'Push notification unique id',
		type: String,
	})
	pushId?: string;

	@ApiProperty({
		description: 'Title of notification',
		type: String,
	})
	title?: string;

	@ApiProperty({
		description: 'Body of notification',
		type: String,
	})
	content?: string;

	@ApiProperty({
		description: 'Message id of notification',
		required: false,
		type: String,
	})
	@IsOptional()
	messageId?: string | null;

	@ApiProperty({
		description: 'Seened by user or not',
		type: Boolean,
	})
	seen?: boolean;
}

// {
//   "batchNotificationId": null,
//   "pushNotification": {
//     "id": 1,
//     "pushId": "cm74dqulx0000mt10jyiboo08",
//     "deviceToken": "trytru",
//     "title": "tryu",
//     "content": "tyru",
//     "messageId": null,
//     "imageUrl": null,
//     "data": {},
//     "seen": true,
//     "notificationId": 2
//   }
// },
