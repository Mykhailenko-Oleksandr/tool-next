import { cookies } from "next/headers";
import { nextServer } from "./api";
import { User } from "@/types/user";
import { CheckSessionRequest, OptionsAPI, responseTools } from "./clientApi";
import { Category } from "@/types/category";

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

export async function fetchTools(page: number, category?: string, perPage = 8) {
	if (category === "All") category = undefined;

	const options: OptionsAPI = {
		params: { category, page, perPage },
	};

	const res = await nextServer.get<responseTools>("/tools", options);
	return res.data;
}

export async function fetchCategories(): Promise<Category[]> {
	const res = await nextServer.get("/categories");
	return res.data;
}
