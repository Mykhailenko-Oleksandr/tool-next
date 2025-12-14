export type Category = {
  _id: string;
  title: string;
  keywords?: string;
};

export type Tool = {
  _id: string;
  name: string;
  description?: string;
  rating?: number;
  pricePerDay?: number;
  images?: string | string[];
  category?: string | Category;
};

export type ToolsApiResponse = {
  items: Tool[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
};

export type CategoriesApiResponse = Category[];
