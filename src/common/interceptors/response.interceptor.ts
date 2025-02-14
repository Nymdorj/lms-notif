import { ResponseDto } from '@common/dto/response.dto';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseDto<T>> {
	intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto<T>> {
		return next.handle().pipe(
			map((data: T) => {
				// const httpStatus = context.switchToHttp().getResponse().statusCode;

				return new ResponseDto({ response: data });
			}),
		);
	}
}
