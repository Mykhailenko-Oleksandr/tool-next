export interface Feedback {
  _id: string;
  name: string;
  description: string;
  rate: number;
  createdAt?: string;
}

export interface FeedbackListResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  feedbacks: Feedback[];
}

export interface CreateFeedbackDto {
  toolId: string;
  name: string;
  description: string;
  rate: number;
}
