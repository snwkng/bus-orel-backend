import { Types } from 'mongoose';

export interface IExcursion {
  _id?: Types.ObjectId
  name: string;
  descriptrion: string[];
  images: { name: string }[];
  duration: number;
  price: number;
  documentName: string;
  excursionStartDates: Date[];
  cities: string[];
  hotelName: string;
  thePriceIncludes: string[];
}

export interface IRequestParams {
  city: string;
}