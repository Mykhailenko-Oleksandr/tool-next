import { nextServer } from "./api";
import { cookies } from "next/headers";
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


// export const getUserTools = async (id: string): Promise<Tool[]> => {
//   const cookieStore = await cookies();

//   const { data } = await nextServer.get<Tool[]>(`/users/${id}/tools`, {
//     headers: {
//       Cookie: cookieStore.toString(),
//     },
//   });

//   return data;
// };

export const mockUser = {
  id: "1",
  name: "Олександр Іванов",
  tools: [
    { id: 1, name: "SEO Analyzer", description: "Опис інструменту..." },
    { id: 2, name: "Keyword Research", description: "Опис інструменту..." }
  ]
};

