import { cookies } from "next/headers";
import { nextServer } from "./api";
import { User } from "@/types/user";
import { CheckSessionRequest, UserToolsResponse } from "./clientApi";

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

export async function fetchToolsUserId(id: string) {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<UserToolsResponse>(
    `/users/${id}/tools`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );
  return data;
}
