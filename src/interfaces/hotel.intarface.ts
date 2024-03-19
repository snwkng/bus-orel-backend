// import Document from 'mongoose';
export interface Hotel {
  name: string;
  type: string;
  locationDescription: string;
  images: {
    name: string;
  }[];
  tours: [
    {
      type: string;
      roomName: string;
      numberOfSeats: number;
      inRoom: string;
      datesAndPrices: {
        startDate: Date;
        endDate: Date;
        price: number;
      }[];
    },
  ];
  food: string;
  beach: string;
  distanceToBeach: string;
  checkInConditions: string;
  address: string;
  fare: number;
  thePriceIncludes: string;
  city: string;
  region: string;
  seaType: string;
}
