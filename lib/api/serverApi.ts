import { cookies } from "next/headers";
import { nextServer } from "./api";
import { User } from "@/types/user";
import { CheckSessionRequest } from "./clientApi";
import { Tool } from "@/types/tool";

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

export async function fetchToolsUserIdServer(id: string) {
	const cookieStore = await cookies();

	const { data } = await nextServer.get<Tool[]>(`/users/${id}/tools`, {
		headers: {
			Cookie: cookieStore.toString(),
		},
	});
	return data;
}
