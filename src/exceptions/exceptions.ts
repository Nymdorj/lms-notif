import { HttpException } from '@nestjs/common';
import { ErrorCodeList, getErrorCodeList } from './error.code';
import { UnknownException } from './unknown.exception';

type ExceptionConstructor = new (message?: string, code?: number) => HttpException;

const exceptions: Record<ErrorCodeList, ExceptionConstructor> | Record<string, ExceptionConstructor> = {};

getErrorCodeList().forEach((key: ErrorCodeList) => {
	class DynamicException extends UnknownException {
		constructor(message?: string, code?: number) {
			super(message, code, key);

			Object.setPrototypeOf(this, DynamicException.prototype);
		}
	}

	exceptions[key] = DynamicException;
});

export default exceptions;
