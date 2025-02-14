import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';

export class PaginationDto {
	static PAGE_SIZE = 20;
	static PAGE_NUMBER = 1;

	@ApiProperty({
		example: 20,
		default: PaginationDto.PAGE_SIZE,
		description: 'Number of items per page',
		type: 'number',
	})
	@Type(() => Number)
	@IsNumber()
	@IsInt()
	@Min(1)
	pageSize: number;

	@ApiProperty({
		example: 1,
		default: PaginationDto.PAGE_NUMBER,
		description: 'Current number of page',
		type: 'number',
	})
	@Type(() => Number)
	@IsNumber()
	@IsInt()
	@Min(1)
	pageNumber: number;

	constructor(pageSize = PaginationDto.PAGE_SIZE, pageNumber = PaginationDto.PAGE_NUMBER) {
		this.pageSize = pageSize;
		this.pageNumber = pageNumber;
	}
}
