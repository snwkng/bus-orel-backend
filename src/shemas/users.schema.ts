import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UsersDocument = User & Document;
@Schema()
export class User {
  @ApiProperty({ example: 'username', description: 'username' })
  @Prop({ type: String, required: true })
  username: string;

  @ApiProperty({ example: '123456', description: 'password' })
  @Prop({ type: String, required: true })
  password: string;
}

export const UsersDocument = SchemaFactory.createForClass(User);
