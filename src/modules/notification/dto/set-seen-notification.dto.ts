import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class SetSeentNotificationDto {
	@ApiProperty({
		description: 'Notification unique id',
		type: String,
	})
	@IsNotEmpty()
	@IsString()
	pushId: string;
}
