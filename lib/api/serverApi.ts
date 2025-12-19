import axios from "axios";
import { cookies } from "next/headers";
import { nextServer } from "./api";
import { User } from "@/types/user";
import { CheckSessionRequest } from "./clientApi";

export const serverApi = axios.create({
  baseURL: process.env.BACKEND_API_URL || "https://tool-next-backend.onrender.com",
  withCredentials: true,
});

export async function getMe() {
  const cookieStore = await cookies();
  const { data } = await nextServer.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}

export async function checkSession() {
  const cookieStore = await cookies();
  const res = await nextServer.post<CheckSessionRequest>("/auth/refresh", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
}
