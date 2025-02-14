import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '@prisma/prisma.module';

@Module({
	imports: [
		PrismaModule,
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				transport: {
					host: configService.get('MAIL_HOST'),
					port: configService.get('MAIL_PORT'),
					secure: false,
					auth: {
						user: configService.get('MAIL_USER'),
						pass: configService.get('MAIL_PASSWORD'),
					},
				},
			}),
		}),
	],
	controllers: [MailController],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
