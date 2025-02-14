import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsEmail, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { AttachmentDto } from './attachment.dto';
import { Application } from '@prisma/client';

export class SendMailDto {
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
		required: false,
	})
	@IsOptional()
	@IsNotEmpty()
	userId?: string;

	@ApiProperty({
		description: 'Email address that will appear on the `From: field`. Default it will takes smtp service mail',
		type: String,
		required: false,
	})
	@IsNotEmpty()
	@IsOptional()
	@IsEmail()
	from?: string;

	@ApiProperty({
		description: 'An array of recipients email addresses that will appear on the `To: field`',
		type: 'array',
		items: {},
	})
	@IsNotEmpty()
	@IsArray()
	@IsEmail({}, { each: true })
	recipient: string[];

	@ApiProperty({
		description: 'Currency of wallet.\n\nDefault: MNT',
		type: String,
	})
	@IsNotEmpty()
	subject: string;

	@ApiProperty({
		description: 'The plaintext version of the message. __Required__ when not sending `html` content.',
		type: String,
		required: false,
	})
	@ValidateIf((o: SendMailDto) => !o.html)
	@IsOptional()
	@IsNotEmpty()
	text?: string;

	@ApiProperty({
		description: 'The HTML version of the message. __Required__ when not sending `text` content.',
		type: String,
		required: false,
	})
	@ValidateIf((o: SendMailDto) => !o.text)
	@IsOptional()
	@IsNotEmpty()
	html?: string;

	@ApiProperty({
		description: 'An array of attachment objects',
		type: String,
	})
	@IsOptional()
	attachments: AttachmentDto[];
}
