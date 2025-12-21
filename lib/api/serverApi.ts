import { cookies } from "next/headers";
import { nextServer } from "./api";
import { User } from "@/types/user";
import { CheckSessionRequest } from "./clientApi";
import { Tool } from "@/types/tool";

export interface CreateToolRequest {
  name: string;
  pricePerDay: number;
  category: string;
  rentalTerms: string;
  description: string;
  specifications?: object;
  image: File;
}

export interface UpdateToolRequest {
  name?: string;
  pricePerDay?: number;
  category?: string;
  rentalTerms?: string;
  description?: string;
  specifications?: object;
  image?: File;
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

export async function createTool(data: CreateToolRequest) {
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
  formData.append("image", data.image);

  const res = await nextServer.post<Tool>("/tools", formData, {
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function updateTool(id: string, data: UpdateToolRequest) {
  const cookieStore = await cookies();
  const formData = new FormData();

  if (data.name) {
    formData.append("name", data.name);
  }
  if (data.pricePerDay) {
    formData.append("pricePerDay", String(data.pricePerDay));
  }
  if (data.category) {
    formData.append("category", data.category);
  }
  if (data.rentalTerms) {
    formData.append("rentalTerms", data.rentalTerms);
  }
  if (data.description) {
    formData.append("description", data.description);
  }
  if (data.specifications) {
    formData.append("specifications", JSON.stringify(data.specifications));
  }
  if (data.image) {
    formData.append("image", data.image);
  }

  const res = await nextServer.patch<Tool>(`/tools/${id}`, formData, {
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}
