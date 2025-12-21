import { nextServer } from "./api";
import { Tool } from "@/types/tool";
import { Category } from "@/types/category";
import { getCategories } from "./clientApi";
import { fetchToolById } from "./clientApi";

export type { Tool, Category };

export interface CreateToolData {
  name: string;
  pricePerDay: number;
  category: string;
  rentalTerms: string;
  description: string;
  specifications?: string;
  images?: File | null;
}

export interface UpdateToolData {
  id: string;
  name?: string;
  pricePerDay?: number;
  category?: string;
  rentalTerms?: string;
  description?: string;
  specifications?: string;
  images?: File | null;
}

export async function fetchCategories(): Promise<Category[]> {
  return await getCategories();
}

export { fetchToolById };

export async function createTool(data: CreateToolData): Promise<Tool> {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("pricePerDay", String(data.pricePerDay));
  formData.append("category", data.category);
  formData.append("rentalTerms", data.rentalTerms);
  formData.append("description", data.description);
  if (data.specifications) {
    formData.append("specifications", data.specifications);
  }
  if (data.images) {
    formData.append("image", data.images);
  }

  const response = await nextServer.post<Tool>("/tools", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function updateTool(data: UpdateToolData): Promise<Tool> {
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
  if (toolData.specifications) {
    formData.append("specifications", toolData.specifications);
  }
  if (toolData.images) {
    formData.append("image", toolData.images);
  }

  const response = await nextServer.patch<Tool>(`/tools/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
