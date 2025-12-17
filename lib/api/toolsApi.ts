import { api } from "@/app/api/api";
import { ApiError } from "@/app/api/api";

export interface Category {
  id: string;
  name: string;
}

export interface Tool {
  _id?: string;
  id?: string;
  name: string;
  pricePerDay: number;
  category: string;
  rentalTerms: string;
  description: string;
  specifications: string | object;
  images?: string;
  owner?: string;
}

export interface CreateToolData {
  name: string;
  pricePerDay: number;
  category: string;
  rentalTerms: string;
  description: string;
  specifications: string;
  images?: File;
}

export interface UpdateToolData extends CreateToolData {
  id: string;
  _id?: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<Category[]>("/categories");
    return response.data;
  } catch (error) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.error || "Не вдалося завантажити категорії"
    );
  }
};

export const fetchToolById = async (toolId: string): Promise<Tool> => {
  try {
    const response = await api.get<Tool>(`/api/tools/${toolId}`);
    const tool = response.data;
    return {
      ...tool,
      id: tool._id || tool.id,
    };
  } catch (error) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.error || "Не вдалося завантажити інструмент"
    );
  }
};

export const createTool = async (data: CreateToolData): Promise<Tool> => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("pricePerDay", data.pricePerDay.toString());
    formData.append("category", data.category);
    formData.append("rentalTerms", data.rentalTerms);
    formData.append("description", data.description);
    formData.append("specifications", data.specifications);
    if (data.images) {
      formData.append("images", data.images);
    }

    const response = await api.post<Tool>("/api/tools", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const tool = response.data;
    return {
      ...tool,
      id: tool._id || tool.id,
    };
  } catch (error) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.error ||
        apiError.response?.data?.response?.message ||
        "Не вдалося створити інструмент"
    );
  }
};

export const updateTool = async (data: UpdateToolData): Promise<Tool> => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("pricePerDay", data.pricePerDay.toString());
    formData.append("category", data.category);
    formData.append("rentalTerms", data.rentalTerms);
    formData.append("description", data.description);
    formData.append("specifications", data.specifications);
    if (data.images) {
      formData.append("images", data.images);
    }

    const response = await api.patch<{ message: string; tool: Tool }>(
      `/api/tools/${data.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const tool = response.data.tool;
    return {
      ...tool,
      id: tool._id || tool.id,
    };
  } catch (error) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.error ||
        apiError.response?.data?.response?.message ||
        "Не вдалося оновити інструмент"
    );
  }
};

