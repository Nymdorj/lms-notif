import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '@common/utils/multer';

@Controller('mail')
export class MailController {
	constructor(private readonly mailService: MailService) {}

	@Post('send')
	@UseInterceptors(FileInterceptor('attachment', multerConfig))
	async sendEmail(@UploadedFile() files: Array<Express.Multer.File>, @Body() mailDto: SendMailDto) {
		return await this.mailService.sendEmail(mailDto, files);
	}
}
