import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

import * as compression from 'compression';
import helmet from 'helmet';
import { LoggingInterceptor } from '@interceptors/logging.interceptor';
import { ResponseInterceptor } from '@interceptors/response.interceptor';
import { GlobalExceptionFilter } from '@filters/exception.filter';
import { swaggerExceptions } from '@exceptions/error.code';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	const httpAdapterHost = app.get(HttpAdapterHost);
	app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));

	app.useGlobalInterceptors(new ResponseInterceptor());
	app.useGlobalInterceptors(new LoggingInterceptor());

	app.enableCors();
	app.use(helmet());
	app.use(compression());

	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	const config = new DocumentBuilder()
		.setTitle('Notification service')
		.setDescription('Wallet API description\n' + '### Error Codes\n' + swaggerExceptions())
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document, {
		jsonDocumentUrl: 'swagger/json',
	});

	const port = configService.get<number>('PORT', 3000);

	const logger = new Logger();
	logger.log(`Notification service listening on: ${port}`);

	app.enableVersioning({
		type: VersioningType.URI,
	});
	await app.listen(port);
}

bootstrap();
