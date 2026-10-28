import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UsersDocument = User & Document;
@Schema()
export class User {
  @ApiProperty({ example: 'username', description: 'username' })
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @ApiProperty({ example: '123456', description: 'password' })
  @Prop({ type: String, required: true, select: false })
  password: string;

  @ApiProperty({ description: 'token hash' })
  @Prop({ required: false, default: null, select: false })
  currentHashedRefreshToken?: string;
}

export const UsersDocument = SchemaFactory.createForClass(User);
