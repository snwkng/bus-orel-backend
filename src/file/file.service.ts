import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MFile } from './mfile.class';
import * as sharp from 'sharp';
import { join } from 'path';
import { access, mkdir, writeFile } from 'fs/promises';
import { FileResponse } from 'src/interfaces/file.interface';

@Injectable()
export class FileService {
  async saveFiles(files: MFile[], folder: string = 'default') {
    const uploadFolder = join(__dirname, '..', '..', 'public', folder);

    try {
      await access(uploadFolder);
    } catch (err) {
      await mkdir(uploadFolder, { recursive: true });
    }

    const res: FileResponse[] = await Promise.all(
      files.map(async (file: MFile): Promise<FileResponse> => {
        try {
          await writeFile(join(uploadFolder, file.originalname), file.buffer);
        } catch (err) {
          throw new InternalServerErrorException('Ошибка при записи файла');
        }
        return {
          url: `/public/${folder}/${file.originalname}`,
          name: file.originalname,
        };
      }),
    );
    return res;
  }

  async filterFiles(files: MFile[]): Promise<MFile[]> {
    const newFiles: MFile[] = await Promise.all(
      files.map(async (file: MFile) => {
        const mimetype = file.mimetype;
        const currentFileType = file.mimetype.split('/')[1];
        const type = file.originalname.split('.')[1];
        file.originalname = file.originalname.split('.')[0];
        if (mimetype.includes('image')) {
          if (currentFileType != 'svg+xml') {
            const buffer = await this.convertToWebP(file.buffer);
            return new MFile({
              buffer,
              originalname: `${file.originalname}.webp`,
              mimetype,
              // size,
            });
          }
          return new MFile({
            buffer: file.buffer,
            originalname: `${file.originalname}.svg`,
            mimetype,
            // size: file.size,
          });
        }
        return new MFile({
          buffer: file.buffer,
          originalname: `${file.originalname}.${type}`,
          mimetype,
        });
      }),
    );
    return newFiles;
  }

  convertToWebP(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer).webp({ quality: 100 }).toBuffer();
  }
}
