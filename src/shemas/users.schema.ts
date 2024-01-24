import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UsersDocument = User & Document;
@Schema()
export class User {
  @ApiProperty({ example: 'test@test.test', description: 'email' })
  @Prop({ type: String, required: true })
  email: string;

  @ApiProperty({ example: '123456', description: 'password' })
  @Prop({ type: String, required: true })
  password: string;

  @ApiProperty({ example: 'false', description: 'is banned' })
  @Prop({ type: Boolean, default: false })
  banned: boolean;

  @ApiProperty({ example: 'for reason', description: 'reason banned' })
  @Prop({ type: String })
  banReason: string;
}

export const UsersDocument = SchemaFactory.createForClass(User);
