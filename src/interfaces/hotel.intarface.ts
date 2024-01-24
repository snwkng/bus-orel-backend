import { ObjectId } from 'mongoose';
export interface Hotel {
  name: string;
  type: string;
  locationDescription: string;
  rooms: [
    {
      type: string;
      numberOfSeats: number;
      inRoom: string;
    },
  ];
  food: string;
  beach: string;
  distanceToBeach: string;
  checkInConditions: string;
  address: string;
  fare: number;
  thePriceIncludes: string;
  tours: [
    {
      startDate: string;
      endDate: string;
      rooms: [
        {
          room: ObjectId;
          price: number;
        },
      ];
    },
  ];
  city: string;
  region: string;
}
