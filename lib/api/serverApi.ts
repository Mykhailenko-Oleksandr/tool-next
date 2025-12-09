import { cookies } from "next/headers";
import { nextServer } from "./api";
import { CheckSessionRequest, OptionsAPI, ResponseAPI } from "./clientApi";
import { Note } from "@/types/note";
import { User } from "@/types/user";

export async function fetchNotes(
  searchWord: string,
  page: number,
  tag?: string
) {
  const cookieStore = await cookies();
  if (tag === "All") {
    tag = undefined;
  }

  const options: OptionsAPI = {
    params: {
      search: searchWord,
      tag: tag,
      page: page,
      perPage: 12,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  };

  const { data } = await nextServer.get<ResponseAPI>("/notes", options);
  return data;
}

export async function fetchNoteById(id: string) {
  const cookieStore = await cookies();
  const { data } = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}

export async function checkSession() {
  const cookieStore = await cookies();
  const res = await nextServer.get<CheckSessionRequest>("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
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
