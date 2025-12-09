"use client";

import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { fetchNotes } from "@/lib/api/clientApi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import css from "./NotesPage.module.css";
import Link from "next/link";

interface NotesClientProps {
  category?: string;
}

export default function NotesClient({ category }: NotesClientProps) {
  const [topic, setTopic] = useState("");
  const [page, setPage] = useState(1);

  const { data, isError, isSuccess } = useQuery({
    queryKey: ["notes", topic, page, category],
    queryFn: () => fetchNotes(topic, page, category),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const totalPages = data?.totalPages ?? 0;

  const updateSearchWord = useDebouncedCallback((searchWord: string) => {
    setTopic(searchWord);
    setPage(1);
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={updateSearchWord} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            page={page}
            updatePage={setPage}
          />
        )}
        <Link
          href={"/notes/action/create"}
          className={css.button}>
          Create note +
        </Link>
      </header>
      {isError && (
        <ErrorMessage text="There was an error, please try again..." />
      )}
      {data !== undefined && data?.notes.length === 0 && (
        <ErrorMessage text="No notes found" />
      )}
      {data !== undefined && data?.notes.length > 0 && (
        <NoteList notes={data?.notes} />
      )}
    </div>
  );
}
