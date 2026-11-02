import { BadRequestException } from '@nestjs/common';
import { ParseObjectIdPipe } from './parse-object-id.pipe';

describe('ParseObjectIdPipe', () => {
  const pipe = new ParseObjectIdPipe();

  it('пропускает валидный ObjectId', () => {
    const id = '507f1f77bcf86cd799439011';
    expect(pipe.transform(id)).toBe(id);
  });

  it('бросает BadRequest при некорректном id', () => {
    expect(() => pipe.transform('not-an-id')).toThrow(BadRequestException);
    expect(() => pipe.transform('')).toThrow(BadRequestException);
  });
});
