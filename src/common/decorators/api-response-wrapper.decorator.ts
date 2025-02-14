import { ResponseDto } from '@common/dto/response.dto';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiResponseWrapper = <T extends Type<any>>({ type, description }: { type: T; description?: string }) => {
	return applyDecorators(
		ApiExtraModels(ResponseDto, type),
		ApiOkResponse({
			description,
			schema: {
				allOf: [
					{ $ref: getSchemaPath(ResponseDto) },
					{
						properties: {
							response: { $ref: getSchemaPath(type) },
						},
					},
				],
			},
		}),
	);
};
