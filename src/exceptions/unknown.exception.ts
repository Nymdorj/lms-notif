import { HttpException, HttpStatus } from '@nestjs/common';
import { IException } from '@types';
import { ErrorCode, ErrorCodeList, IErrorCode } from './error.code';

export class UnknownException extends HttpException implements IException {
	errorCode = 500;
	isOperational = false;

	constructor(
		message: string = 'Unknown error',
		errorCode?: number,
		exception: ErrorCodeList = 'UnknownException',
		isOperational = true,
	) {
		let targetError: IErrorCode | null = null;

		if (exception !== 'UnknownException') {
			targetError = ErrorCode[exception];
		}

		const updatedMessage = targetError?.message ?? message;

		super(updatedMessage, HttpStatus.OK);

		this.name = exception;
		this.isOperational = isOperational;
		this.errorCode = errorCode || (targetError?.code ?? 500);
		Error.captureStackTrace(this, this.constructor);
	}
}
