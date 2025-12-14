import axios from "axios";
import type { CategoriesApiResponse, ToolsApiResponse } from "@/types/tool";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://tool-next-backend.onrender.com/api",
});

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const toNumber = (v: unknown, fallback = 0) => {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : fallback;
};

const asArray = (v: unknown) => (Array.isArray(v) ? v : []);

const normalizeToolsResponse = (data: unknown, fallbackPerPage = 8): ToolsApiResponse => {
  if (!isRecord(data)) {
    return { items: [], page: 1, perPage: fallbackPerPage, totalItems: 0, totalPages: 1 };
  }

  const toolsArr = asArray(data.tools);
  const itemsArr = asArray(data.items);
  const rawItems = itemsArr.length ? itemsArr : toolsArr;

  const page = toNumber(data.page, 1);
  const perPage = toNumber(data.perPage, fallbackPerPage);

  const totalItems =
    toNumber(data.totalItems, 0) ||
    toNumber(data.totalTools, 0) ||
    rawItems.length;

  const totalPages =
    toNumber(data.totalPages, 0) ||
    (perPage > 0 ? Math.max(1, Math.ceil(totalItems / perPage)) : 1);

  return {
    items: rawItems as ToolsApiResponse["items"],
    page,
    perPage,
    totalItems,
    totalPages,
  };
};

export type GetToolsParams = {
  page?: number;
  perPage?: number;
  categoryId?: string;
};

const requestTools = async (
  params: Record<string, string | number>
): Promise<ToolsApiResponse> => {
  const res = await api.get("/tools", { params });
  const perPage = typeof params.perPage === "number" ? params.perPage : 8;
  return normalizeToolsResponse(res.data, perPage);
};

export const getTools = async ({
  page = 1,
  perPage = 8,
  categoryId,
}: GetToolsParams = {}): Promise<ToolsApiResponse> => {
  const baseParams: Record<string, string | number> = { page, perPage };

  if (!categoryId || categoryId === "all") {
    return requestTools(baseParams);
  }

  try {
    return await requestTools({ ...baseParams, categoryId });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const status = e.response?.status;
      if (status && status >= 400 && status < 500) {
        return requestTools({ ...baseParams, category: categoryId });
      }
    }
    throw e;
  }
};

export const getCategories = async (): Promise<CategoriesApiResponse> => {
  const res = await api.get("/categories");
  return (Array.isArray(res.data) ? res.data : []) as CategoriesApiResponse;
};


