import { cookies } from "next/headers";
import { nextServer } from "./api";
import { User } from "@/types/user";
import { CheckSessionRequest, UserToolsResponse } from "./clientApi";

export interface UserByIdResponse {
  _id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  feedbacksCount: number;
}

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
  const res = await nextServer.get<CheckSessionRequest>("/auth/refresh", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
}

export async function fetchToolsUserId(
  id: string,
  page?: number,
  perPage?: number
) {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<UserToolsResponse>(
    `/users/${id}/tools`,
    {
      params: {
        page,
        perPage,
      },
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );
  return data;
}

export async function fetchUserById(id: string) {
  const cookieStore = await cookies();
  const response = await nextServer.get<UserByIdResponse>(`/users/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}
