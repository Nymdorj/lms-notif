import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
	@ApiProperty({
		example: 0,
		description: 'Response code',
	})
	readonly code: number;

	@ApiProperty({
		description: 'Response data',
	})
	readonly response: T;

	constructor({ code = 0, response }: { code?: number; response: T }) {
		this.code = code;
		this.response = response;
	}
}
