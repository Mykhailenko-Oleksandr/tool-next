import { User } from "@/types/user";
import type { Note, NoteFormData } from "../../types/note";
import { nextServer } from "./api";

export interface ResponseAPI {
  notes: Note[];
  totalPages: number;
}

export interface OptionsAPI {
  params: {
    search: string;
    tag?: string;
    page: number;
    perPage: number;
  };
  headers?: {
    Cookie: string;
  };
}

export type UserRequest = {
  email: string;
  password: string;
};

export interface CheckSessionRequest {
  success: boolean;
}

export interface UpdateUserRequest {
  username: string;
}

export async function fetchNotes(
  searchWord: string,
  page: number,
  tag?: string
) {
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
  };

  const res = await nextServer.get<ResponseAPI>("/notes", options);
  return res.data;
}

export async function fetchNoteById(id: string) {
  const res = await nextServer.get<Note>(`/notes/${id}`);
  return res.data;
}

export async function createNote(data: NoteFormData) {
  const res = await nextServer.post<Note>("/notes", data);
  return res.data;
}

export async function deleteNote(id: string) {
  const res = await nextServer.delete<Note>(`/notes/${id}`);
  return res.data;
}

export async function register(data: UserRequest) {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
}

export async function login(data: UserRequest) {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
}

export async function logout(): Promise<void> {
  await nextServer.post("/auth/logout");
}

export async function checkSession() {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data;
}

export async function getMe() {
  const res = await nextServer.get<User>("/users/me");
  return res.data;
}

export async function updateMe(payload: UpdateUserRequest) {
  const res = await nextServer.patch<User>("/users/me", payload);
  return res.data;
}
