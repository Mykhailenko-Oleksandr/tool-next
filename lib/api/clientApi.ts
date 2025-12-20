import { Tool } from "@/types/tool";
import { User } from "@/types/user";
import { nextServer } from "./api";

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
