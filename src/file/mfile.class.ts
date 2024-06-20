export class MFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  // size: number;

  constructor(file: Express.Multer.File | MFile) {
    this.buffer = file.buffer;
    this.originalname = file.originalname;
    this.mimetype = file.mimetype;
    // this.size = file.size;
  }
}
