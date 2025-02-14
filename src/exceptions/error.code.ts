interface IErrorCode {
	code: number;
	message: string;
	description?: string;
}

type ErrorCodeList = Exclude<keyof typeof ErrorCode, 'prototype'>;

const getErrorCodeList = (): ErrorCodeList[] => {
	const errorCodeList = Object.keys(ErrorCode).filter(
		(name) => name.substring(name.length - 9).toLowerCase() == 'exception',
	);

	return <ErrorCodeList[]>errorCodeList;
};

const swaggerExceptions = (): string => {
	let doc = '';
	const errorCodes = getErrorCodeList();

	errorCodes.forEach((key) => {
		const { code, message, description } = ErrorCode[key];

		doc += `#### ${code} ${message}\n - ${description ?? message}\n`;
	});

	return doc;
};

class ErrorCode {
	static UnknownException: IErrorCode = {
		code: 1000,
		message: 'Unknown error',
		description: 'An unknown error occurred while processing the request.',
	};

	static FailedSendMailException: IErrorCode = {
		code: 1100,
		message: 'Failed to send email',
	};

	static FailedPushNotificationException: IErrorCode = {
		code: 1200,
		message: 'Failed to push notification',
	};
}

export { getErrorCodeList, ErrorCode, ErrorCodeList, IErrorCode, swaggerExceptions };
