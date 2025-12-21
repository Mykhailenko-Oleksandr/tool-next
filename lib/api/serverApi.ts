import { cookies } from "next/headers";
import { nextServer } from "./api";
import { User } from "@/types/user";
import { CheckSessionRequest } from "./clientApi";
import { Tool } from "@/types/tool";

export interface CreateToolData {
  name: string;
  pricePerDay: number;
  category: string;
  rentalTerms: string;
  description: string;
  specifications?: Record<string, string>;
  images: File;
}

export interface UpdateToolData {
  id: string;
  name?: string;
  pricePerDay?: number;
  category?: string;
  rentalTerms?: string;
  description?: string;
  specifications?: Record<string, string>;
  images?: File;
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
  const res = await nextServer.post<CheckSessionRequest>("/auth/refresh", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
}

export async function updateTool(data: UpdateToolData): Promise<Tool> {
  const cookieStore = await cookies();
  const { id, ...toolData } = data;
  const formData = new FormData();

  if (toolData.name) {
    formData.append("name", toolData.name);
  }
  if (toolData.pricePerDay !== undefined) {
    formData.append("pricePerDay", String(toolData.pricePerDay));
  }
  if (toolData.category) {
    formData.append("category", toolData.category);
  }
  if (toolData.rentalTerms) {
    formData.append("rentalTerms", toolData.rentalTerms);
  }
  if (toolData.description) {
    formData.append("description", toolData.description);
  }
  if (data.specifications) {
    formData.append("specifications", JSON.stringify(data.specifications));
  }
  if (toolData.images) {
    formData.append("image", toolData.images);
  }

  const response = await nextServer.patch<Tool>(`/tools/${id}`, formData, {
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function createTool(data: CreateToolData) {
  const cookieStore = await cookies();
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("pricePerDay", String(data.pricePerDay));
  formData.append("category", data.category);
  formData.append("rentalTerms", data.rentalTerms);
  formData.append("description", data.description);
  if (data.specifications) {
    formData.append("specifications", JSON.stringify(data.specifications));
  }
  formData.append("image", data.images);

  const response = await nextServer.post<Tool>("/tools", formData, {
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
