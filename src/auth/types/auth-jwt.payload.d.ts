import { type Types } from 'mongoose';

export type AuthJwtPayload = {
  username: string;
  sub: Types.ObjectId;
};
