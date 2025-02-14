import { ApiProperty } from '@nestjs/swagger';

export class ExceptionDto {
	@ApiProperty({
		example: 500,
		description: 'Error code',
	})
	code: number;

	@ApiProperty({
		example: '2024-07-08T00:00:00Z',
		description: 'Error catched time',
	})
	timestamp: string;

	@ApiProperty({
		example: 'Internal server error',
		description: 'Error message',
	})
	response: string;
}
