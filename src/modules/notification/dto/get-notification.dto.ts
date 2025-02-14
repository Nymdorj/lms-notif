import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { Application, NotificationStatus } from '@prisma/client';
import { PaginationDto } from '@common/dto/pagination.dto';

export class GetNotificationDto extends PaginationDto {
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
		description: '',
		type: String,
		required: false,
	})
	@IsOptional()
	@IsNotEmpty()
	startDate: string;

	@ApiProperty({
		description: '',
		type: String,
		required: false,
	})
	@IsOptional()
	@IsNotEmpty()
	endDate: string;

	@ApiProperty({
		description: '',
		type: String,
		enum: NotificationStatus,
		required: false,
	})
	@IsOptional()
	@IsNotEmpty()
	status: NotificationStatus;

	@ApiProperty({
		description: '',
		type: Boolean,
		required: false,
	})
	@IsOptional()
	@IsNotEmpty()
	@IsBoolean()
	seen: boolean;
}
