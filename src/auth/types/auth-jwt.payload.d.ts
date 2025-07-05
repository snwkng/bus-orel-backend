import { type ObjectId } from 'mongoose';

export type AuthJwtPayload = {
  username: string;
  sub: ObjectId;
};