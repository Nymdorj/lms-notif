import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsObject, IsOptional, IsString, IsUrl } from 'class-validator';
import { Application } from '@prisma/client';

export class PushNotificationDto {
	@ApiProperty({
		example: Application.LMS,
		description: 'Application name: \n\n- HR\n\n- RMS\n\n- LMS\n\n- BURGER_KING',
		type: String,
		enum: Application,
	})
	@IsNotEmpty()
	application: Application;

	@ApiProperty({
		description: 'CUM: User unique identifier. Can be null',
		type: String,
	})
	@IsNotEmpty()
	userId: string;

	@ApiProperty({
		description: 'FCM token of device',
		type: String,
	})
	@IsNotEmpty()
	deviceToken: string;

	@ApiProperty({
		description: 'The title of the notification',
		type: String,
	})
	@IsNotEmpty()
	@IsString()
	title: string;

	@ApiProperty({
		description: 'The notification body',
		type: String,
	})
	@IsNotEmpty()
	@IsString()
	content: string;

	@ApiProperty({
		description: 'URL of an image to be displayed in the notification.',
		type: String,
		required: false,
	})
	@IsOptional()
	@IsNotEmpty()
	@IsUrl()
	imageUrl?: string;

	@ApiProperty({
		description: 'Custom data for notification',
		type: 'object',
		properties: {},
	})
	@IsOptional()
	@IsObject()
	data: { [key: string]: string };
}
