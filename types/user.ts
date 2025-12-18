import { Tool } from "./tool";
export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl: string;
  createdAt?: string;
  updatedAt?: string;
  tools?: Tool[];
}
