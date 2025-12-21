import { Tool } from "@/types/tool";
import { User } from "@/types/user";
import { nextServer } from "./api";
import { Feedback } from "@/types/feedback";
import { Booked } from "@/types/booked";
import { Category } from "@/types/category";

interface responseTools {
  page: number;
  perPage: number;
  tools: Tool[];
  totalPages: number;
  totalTools: number;
}

export interface UserRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface CheckSessionRequest {
  success: boolean;
}

export interface FeedbacksResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  feedbacks: Feedback[];
}

interface BookingRequest {
  firstName: string;
  lastName: string;
  phone: string;
  startDate: string;
  endDate: string;
  deliveryCity: string;
  deliveryBranch: string;
}

interface BookingResponse {
  message: string;
  booked: Booked;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export async function deleteTool(id: string) {
  const res = await nextServer.delete<Tool>(`/tools/${id}`);
  return res.data;
}

export async function fetchToolById(id: string) {
  const response = await nextServer.get<Tool>(`/tools/${id}`);
  return response.data;
}

export async function fetchPopularTool() {
  const response = await nextServer.get<responseTools>(`/tools`);
  return response.data;
}

export const login = async (data: UserRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

export async function checkSession() {
  const res = await nextServer.post<CheckSessionRequest>("/auth/refresh");
  return res.data;
}

export async function register(data: RegisterRequest) {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
}

export async function logout(): Promise<void> {
  await nextServer.post("/auth/logout");
}

export async function fetchFeedbacks(page?: number, perPage?: number) {
  const response = await nextServer.get<FeedbacksResponse>("/feedbacks", {
    params: {
      page,
      perPage,
    },
  });
  return response.data.feedbacks;
}

export async function bookingTool(data: BookingRequest, id: string) {
  const response = await nextServer.post<BookingResponse>(
    `/bookings/${id}`,
    data
  );
  return response.data;
}

export async function fetchToolsUserId(id: string) {
  const { data } = await nextServer.get<Tool[]>(`/users/${id}/tools`);
  return data;
}

export async function getCategories() {
  const { data } = await nextServer.get<Category[]>(`/api/categories`);
  return data;
}
