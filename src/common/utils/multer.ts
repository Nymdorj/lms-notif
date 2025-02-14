import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
import * as path from 'path';

export const multerConfig: MulterOptions = {
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
	fileFilter: (req, file, callback) => {
		const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.txt', '.doc', '.docx', '.xlsx'];
		const ext = path.extname(file.originalname).toLowerCase();

		if (allowedExtensions.includes(ext)) {
			callback(null, true);
		} else {
			callback(new BadRequestException('File type not allowed'), false);
		}
	},
};
