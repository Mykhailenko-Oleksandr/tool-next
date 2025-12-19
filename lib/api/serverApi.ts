import { cookies } from "next/headers";
import { nextServer } from "./api";
import { User } from "@/types/user";
import { CheckSessionRequest } from "./clientApi";

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
    id: 'me',
    name: 'Антон Петренко',
    tools: [
      {
        id: '1',
        title: 'Бензогенератор Honda',
        price: '800 грн/день',
        rating: 4.6,
      },
    ],
  };
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

