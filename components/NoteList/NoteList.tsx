"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteList.module.css";
import toast from "react-hot-toast";
import { deleteNote } from "@/lib/api/clientApi";
import { Note } from "@/types/note";
import Link from "next/link";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteNoteMutate = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  function handleDeleteNote(id: string) {
    deleteNoteMutate.mutate(id);
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => {
        return (
          <li
            className={css.listItem}
            key={note.id}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>
              <Link
                className={css.link}
                href={`/notes/${note.id}`}>
                View details
              </Link>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className={css.button}>
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
