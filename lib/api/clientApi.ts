import { Tool } from "@/types/tool";
import { User } from "@/types/user";
import { nextServer } from "./api";
import { Feedback } from "@/types/feedback";
import { Booked } from "@/types/booked";
import { Category } from "@/types/category";

export interface OptionsAPI {
  params: {
    category?: string;
    page: number;
    perPage: number;
    search?: string;
  };
}

interface BookingRequest {
  firstName: string;
  lastName: string;
  phone: string;
  startDate: string;
  endDate: string;
  deliveryCity: string;
  deliveryBranch: string;
}

interface BookingResponse {
  message: string;
  booked: Booked;
  totalPrice: number;
  status: string;
  createdAt: string;
}

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

interface responseTools {
  page: number;
  perPage: number;
  tools: Tool[];
  totalPages: number;
  totalTools: number;
}

export interface UserRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface CheckSessionRequest {
  success: boolean;
}

export interface FeedbacksResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  feedbacks: Feedback[];
}

export interface UserToolsResponse {
  user: {
    name: string;
    avatarUrl: string;
  };
  page: number;
  perPage: number;
  totalPages: number;
  totalTools: number;
  pagination: {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  tools: Tool[];
}

export async function fetchTools(
  page: number,
  categories?: string[] | string,
  perPage = 8,
  search?: string
) {
  let categoryParam: string | undefined;

  if (Array.isArray(categories)) {
    categoryParam = categories.length ? categories.join(",") : undefined;
  } else if (categories === "All") {
    categoryParam = undefined;
  } else {
    categoryParam = categories;
  }

  const options: OptionsAPI = {
    params: {
      category: categoryParam,
      page,
      perPage,
      ...(search ? { search } : {}),
    },
  };

  const res = await nextServer.get<responseTools>("/tools", options);
  return res.data;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await nextServer.get("/categories");
  return res.data;
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
  const response = await nextServer.get<responseTools>(`/tools`, {
    params: {
      page: 1,
      perPage: 8,
      sortBy: "rating",
    },
  });
  return response.data;
}

export const login = async (data: UserRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

export async function checkSession() {
  const res = await nextServer.get<CheckSessionRequest>("/auth/refresh");
  return res.data;
}

export async function register(data: RegisterRequest) {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
}

export async function logout(): Promise<void> {
  await nextServer.post("/auth/logout");
}

export async function fetchFeedbacks(page?: number, perPage?: number) {
  const response = await nextServer.get<FeedbacksResponse>("/feedbacks", {
    params: {
      page,
      perPage,
    },
  });
  return response.data.feedbacks;
}

export async function bookingTool(data: BookingRequest, id: string) {
  const response = await nextServer.post<BookingResponse>(
    `/bookings/${id}`,
    data
  );
  return response.data;
}

export async function fetchToolsUserId(
  id: string,
  page?: number,
  perPage?: number
) {
  const { data } = await nextServer.get<UserToolsResponse>(
    `/users/${id}/tools`,
    {
      params: {
        page,
        perPage,
      },
    }
  );
  return data;
}

export async function getCategories() {
  const { data } = await nextServer.get<Category[]>(`/categories`);
  return data;
}

export async function updateTool(data: UpdateToolData) {
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
  // specifications всегда отправляем (даже если пустой объект)
  formData.append("specifications", JSON.stringify(data.specifications || {}));
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

export async function createTool(data: CreateToolData) {
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
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function getMe() {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
}

export async function fetchUserById(id: string) {
  const response = await nextServer.get<User>(`/users/${id}`);
  return response.data;
}
