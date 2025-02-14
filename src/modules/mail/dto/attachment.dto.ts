import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AttachmentDto {
	@ApiProperty({
		description: 'Filename to be reported as the name of the attached file',
		type: String,
	})
	@IsNotEmpty()
	filename: string;

	@ApiProperty({
		description: 'Optional content type for the attachment, if not set will be derived from the filename property',
		required: false,
		type: String,
	})
	@IsOptional()
	@IsNotEmpty()
	contentType: string;

	@ApiProperty({
		description: 'String, Buffer or a Stream contents for the attachment',
		type: String,
	})
	@IsNotEmpty()
	content: string;
}
