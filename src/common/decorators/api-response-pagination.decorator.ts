import { PaginationResponseDto } from '@common/dto/pagination-response.dto';
import { ResponseDto } from '@common/dto/response.dto';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiResponsePagination = <T extends Type<any>>({
	type,
	description,
}: {
	type: T;
	description?: string;
}) => {
	return applyDecorators(
		ApiExtraModels(ResponseDto, PaginationResponseDto, type),
		ApiOkResponse({
			description,
			schema: {
				allOf: [
					{ $ref: getSchemaPath(ResponseDto) },
					{
						properties: {
							response: {
								allOf: [
									{ $ref: getSchemaPath(PaginationResponseDto) },
									{
										properties: {
											data: { $ref: getSchemaPath(type) },
										},
									},
								],
							},
						},
					},
				],
			},
		}),
	);
};
