import { Tool } from "@/types/tool";
import { nextServer } from "./api";

interface responseTools {
  page: number;
  perPage: number;
  tools: Tool[];
  totalPages: number;
  totalTools: number;
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
