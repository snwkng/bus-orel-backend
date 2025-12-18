export interface IHotel {
  name: string;
  type: string;
  locationDescription: string;
  images: {
    name: string;
  }[];
  // tours: [
  //   {
  //     type: string;
  //     roomName: string;
  //     capacity: number;
  //     inRoom: string;
  //     datesAndPrices: {
  //       startDate: Date;
  //       endDate: Date;
  //       price: number;
  //     }[];
  //   },
  // ];
  food: string;
  beach: string;
  distanceToBeach: string;
  checkInConditions: string;
  address: string;
  price: number;
  thePriceIncludes: string[];
  city: string;
  region: string;
  seaType: string;
  documentName: string[];
  published: boolean;
}


export interface IRequestParams {
  seaType: string
  city: string
}