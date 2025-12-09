"use client";

import { fetchNoteById } from "@/lib/api/clientApi";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  function handleBack() {
    router.back();
  }

  if (isLoading) return <p>Loading, please wait...</p>;

  if (error || !note) return <p>Something went wrong</p>;

  return (
    <>
      <button
        className={css.backBtn}
        onClick={handleBack}>
        Back
      </button>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{note.createdAt}</p>
        </div>
      </div>
    </>
  );
}
