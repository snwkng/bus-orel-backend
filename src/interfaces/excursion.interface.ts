export interface Excursion {
  name: string;
  descriptrion: string[];
  images: { name: string }[];
  duration: number;
  price: number;
  documentName: string;
  excursionStart: Date;
  city: string;
  hotelName: string;
  thePriceIncludes: string[];
}
