import { Feedback } from "./feedback";
import { User } from "./user";
export interface Tool {
  _id: string;
  owner: User | string;
  category: string;
  name: string;
  description: string;
  pricePerDay: number;
  images: string;
  rating: number;
  specifications: object;
  rentalTerms: string;
  bookedDates?: BookedDate[] | [];
  feedbacks: Feedback[] | [];
  createdAt?: string;
  updatedAt?: string;
}

export interface BookedDate {
  startDate: string;
  endDate: string;
}
