import { Tool } from "@/types/tool";
import { nextServer } from "./api";

export async function deleteTool(id: string) {
  const res = await nextServer.delete<Tool>(`/tools/${id}`);
  return res.data;
}
