import { cookies } from "next/headers";
import { nextServer } from "./api";
import { User } from "@/types/user";
import { CheckSessionRequest } from "./clientApi";
import { Tool } from "@/types/tool";

// export async function getMe() {
//   const cookieStore = await cookies();
//   const { data } = await nextServer.get<User>("/users/me", {
//     headers: {
//       Cookie: cookieStore.toString(),
//     },
//   });
//   return data;
// }


export async function getMe() {
  return {
    name: 'Антон Петренко',
  };
}

export const getMyTools = async (): Promise<Tool[]> => {
 
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return [];
  }

  const res = await fetch(`${process.env.API_URL}/tools/my`, {
    method: "GET",
    headers: {
     
      'Authorization': `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
};


export async function checkSession() {
  const cookieStore = await cookies();
  const res = await nextServer.post<CheckSessionRequest>("/auth/refresh", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
}

