import { NextRequest, NextResponse } from "next/server";
import { api } from "../api";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../_utils/utils";
import { cookies } from "next/headers";

// export async function GET(request: Request) {
// 	try {
// 		const { searchParams } = new URL(request.url);
// 		const page = searchParams.get("page") || "1";

// 		const res = await api.get(`/tools?page=${page}`);

// 		return NextResponse.json(res.data, { status: res.status });
// 	} catch (error) {
// 		if (isAxiosError(error)) {
// 			logErrorResponse(error.response?.data);
// 			return NextResponse.json(
// 				{ error: error.message, response: error.response?.data },
// 				{ status: error.response?.status || 500 }
// 			);
// 		}
// 		logErrorResponse({ message: (error as Error).message });
// 		return NextResponse.json(
// 			{ error: "Internal Server Error" },
// 			{ status: 500 }
// 		);
// 	}
// }

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const formData = await request.formData();

    const res = await api.post("/tools", formData, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const search = request.nextUrl.searchParams.get("search") ?? "";
    const page = Number(request.nextUrl.searchParams.get("page") ?? 1);
    const perPage = Number(request.nextUrl.searchParams.get("perPage") ?? 8);
    const sortBy = request.nextUrl.searchParams.get("sortBy") ?? "_id";
    const sortOrder = request.nextUrl.searchParams.get("sortOrder") ?? "asc";

    const rawCategory = request.nextUrl.searchParams.get("category") ?? "";
    const category = rawCategory === "All" ? "" : rawCategory;

    const categoryParam = category ? category.split(",").join(",") : undefined;

    const res = await api.get("/tools", {
      params: {
        ...(search !== "" && { search }),
        page,
        perPage,
        ...(categoryParam && { category: categoryParam }),
        // sortBy,
        // sortOrder,
      },
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status ?? 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
