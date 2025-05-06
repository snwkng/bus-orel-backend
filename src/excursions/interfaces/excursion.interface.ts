import { Types } from 'mongoose';

export interface IExcursion {
  _id?: Types.ObjectId
  name: string;
  descriptrion: string[];
  images: { name: string }[];
  duration: number;
  price: number;
  documentName: string;
  excursionStart: Date;
  cities: Types.ObjectId[];
  hotelName: string;
  thePriceIncludes: string[];
}

export interface IRequestParams {
  city: Types.ObjectId,
}