import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class PaginationResponseDto<T> {
	@ApiProperty({
		description: 'Data array of page',
		type: 'array',
	})
	data: T;

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

	@ApiProperty({
		example: 1,
		description: 'Total records',
		type: 'number',
	})
	@Type(() => Number)
	@IsNumber()
	@IsInt()
	total: number;
}
