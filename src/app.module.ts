import { Module } from '@nestjs/common';
import { MailModule } from './modules/mail/mail.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@prisma/prisma.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		MailModule,
		NotificationModule,
		PrismaModule,
	],
})
export class AppModule {}
