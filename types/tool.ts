export interface Tool {
  _id: string;
  owner: string;
  category: string;
  name: string;
  description: string;
  pricePerDay: number;
  images: string;
  rating: number;
  specifications: object;
  rentalTerms: string;
  bookedDates?: string[] | [];
  feedbacks: object[];
  createdAt?: string;
  updatedAt?: string;
}