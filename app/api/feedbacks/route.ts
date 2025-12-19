import { NextRequest, NextResponse } from "next/server";
import { serverApi } from "@/lib/api/serverApi";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("perPage") || "15";

    const response = await serverApi.get("/api/feedbacks", {
      params: {
        page,
        perPage,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error("Error fetching feedbacks:", error);
    
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      return NextResponse.json(
        { error: "Не вдалося завантажити відгуки" },
        { status: axiosError.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Не вдалося завантажити відгуки" },
      { status: 500 }
    );
  }
}

