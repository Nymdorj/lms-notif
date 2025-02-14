import { ApiProperty } from '@nestjs/swagger';
import { NotificationStatus } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class PushNotificationResponseDto {
	@ApiProperty({
		description: 'Notification message id',
		type: String,
	})
	@IsNotEmpty()
	messageId: string;

	@ApiProperty({
		description: 'Unique identifier',
		type: Number,
		example: 1,
	})
	@IsNotEmpty()
	id: number;

	@ApiProperty({
		description: 'Notification sent status',
		example: NotificationStatus.SUCCESS,
		type: String,
	})
	@IsNotEmpty()
	status: NotificationStatus;
}
