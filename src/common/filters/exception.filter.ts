import { UnknownException } from '@exceptions/unknown.exception';
import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpStatus,
	Logger,
	LogLevel,
	BadRequestException,
	HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { PrismaExceptions } from '@types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(GlobalExceptionFilter.name);

	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	private prismaExceptionHandler = (e: PrismaExceptions) => {
		let httpStatus = HttpStatus.OK;
		let message = '';
		let level: LogLevel = 'fatal';
		let errorCode = HttpStatus.INTERNAL_SERVER_ERROR;

		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			message = e.code + '::' + e.name;
			level = 'verbose';
			errorCode = HttpStatus.BAD_REQUEST;

			this.logger[level](`${e.code}::${JSON.stringify(e.meta)}::${e.message}}`);
		}

		if (e instanceof Prisma.PrismaClientUnknownRequestError) {
			level = 'verbose';
			errorCode = HttpStatus.BAD_REQUEST;
			message = 'An error occurred for a request';

			this.logger[level](e.message);
		}

		if (e instanceof Prisma.PrismaClientRustPanicError) {
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
			message = 'The underlying engine has crashed';

			this.logger[level](e.message);
		}

		if (e instanceof Prisma.PrismaClientInitializationError) {
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
			message = 'An error occurred while connecting to the database';

			this.logger[level](e.message);
		}

		if (e instanceof Prisma.PrismaClientValidationError) {
			errorCode = HttpStatus.BAD_REQUEST;
			level = 'verbose';
			message = 'Validation Error: Incorrect field type provided';

			this.logger[level](e.message);
		}

		return { httpStatus, message, errorCode, level };
	};

	catch(exception: any, host: ArgumentsHost): void {
		const { httpAdapter } = this.httpAdapterHost;

		const ctx = host.switchToHttp();

		let httpStatus = HttpStatus.OK;
		let errorCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = 'INTERNAL_SERVER_ERROR';
		let level: LogLevel = 'error';
		let errors: unknown[] = [];

		if (exception instanceof UnknownException) {
			errorCode = exception.errorCode;
			message = exception.message;
			level = 'error';
		} else if (exception instanceof HttpException) {
			const responseData = exception.getResponse();

			httpStatus = exception.getStatus();
			errorCode = exception.getStatus();
			message = exception.message;
			level = 'warn';

			if (exception instanceof BadRequestException) {
				if (typeof responseData === 'object' && 'message' in responseData && Array.isArray(responseData['message'])) {
					message = 'Validation failed';
					errors = responseData['message'];
				}
			}
		} else if (exception instanceof TypeError) {
			httpStatus = HttpStatus.BAD_REQUEST;
			errorCode = HttpStatus.BAD_REQUEST;
			message = exception.message || 'Bad Request: Type Error';
		} else if (
			exception instanceof Prisma.PrismaClientRustPanicError ||
			exception instanceof Prisma.PrismaClientValidationError ||
			exception instanceof Prisma.PrismaClientKnownRequestError ||
			exception instanceof Prisma.PrismaClientUnknownRequestError ||
			exception instanceof Prisma.PrismaClientInitializationError
		) {
			const prismaException = this.prismaExceptionHandler(exception);

			httpStatus = prismaException.httpStatus;
			message = prismaException.message;
			errorCode = prismaException.errorCode;
		} else {
			level = 'error';
			httpStatus = 500;
		}

		const stack = exception.stack || 'No stack trace available';

		const location = stack.split('\n')[1]?.trim();

		const responseBody = {
			code: errorCode,
			timestamp: new Date().toISOString(),
			response: message,
			errors,
		};

		this.logger[level](`${location} | ${errorCode}`);

		httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
	}
}
