import { TourAvailability } from '../subschemas/tour-availability.subschema';

export interface ITourItem {
  type: string;
  roomType: string;
  roomName: string;
  beds: number;
  description: string;
  availability: TourAvailability[];
}