export interface Excursion {
  name: string;
  descriptrion: string;
  images: { name: string }[];
  duration: number;
  price: number;
  hotel: string;
  documentName: string;
  excursionStart: Date;
  city: string;
  thePriceIncludes: string[];
}
