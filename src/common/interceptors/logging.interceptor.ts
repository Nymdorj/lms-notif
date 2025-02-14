import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger();

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		const method = request.method;
		const url = request.url;
		const protocol = request.protocol;
		const now = Date.now();

		this.logger.log(`[REQUEST][${protocol}] ${method} ${url}::${now}`);

		return next.handle().pipe(
			tap({
				next: () => {
					const response = context.switchToHttp().getResponse();
					const statusCode = response.statusCode;
					const elapsedTime = Date.now() - now;
					this.logger.log(`[RESPONSE] ${method} ${url}::${statusCode}::${elapsedTime}ms`);
				},
				error: (err) => {
					const response = context.switchToHttp().getResponse();
					const statusCode = response.statusCode;
					const elapsedTime = Date.now() - now;
					this.logger.error(`[ERROR] ${method} ${url}::${statusCode}::${err}::${elapsedTime}ms`);
				},
			}),
		);
	}
}
