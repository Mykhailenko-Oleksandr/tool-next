import { cookies } from "next/headers";
import { nextServer } from "./api";
import { Tool } from "@/types/tool";

// export async function fetchToolById(id: string) {
//   const cookieStore = await cookies();
//   const response = await nextServer.get<Tool>(`/tools/${id}`, {
//     headers: {
//       Cookie: cookieStore.toString(),
//     },
//   });
//   return response.data;
// }
