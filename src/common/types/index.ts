import { HttpException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export interface IException extends HttpException {
	errorCode: number;
	message: string;
	stack?: string;
}

export type Pagination<T> = {
	data: T;
	pageNumber: number;
	pageSize: number;
	total: number;
};

export type PrismaExceptions =
	| Prisma.PrismaClientRustPanicError
	| Prisma.PrismaClientValidationError
	| Prisma.PrismaClientKnownRequestError
	| Prisma.PrismaClientUnknownRequestError
	| Prisma.PrismaClientInitializationError;
