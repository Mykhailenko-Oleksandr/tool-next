import { Tool } from "@/types/tool";
import { nextServer } from "./api";

export async function deleteTool(id: string) {
  const res = await nextServer.delete<Tool>(`/tools/${id}`);
  return res.data;
}

export async function fetchToolById(id: string) {
  const response = await nextServer.get<Tool>(`/tools/${id}`);
  return response.data;
}
