"use client";

import { useState, useEffect } from "react";
import ToolGrid from "@/components/ToolGrid/ToolGrid";
import { fetchToolsUserId } from "@/lib/api/clientApi";
import { Tool } from "@/types/tool";
import LoadMoreButton from "../LoadMoreButton/LoadMoreButton";
import PrivateProfilePlaceholder from "../PrivateProfilePlaceholder/PrivateProfilePlaceholder";
import PublicProfilePlaceholder from "../PublicProfilePlaceholder/PublicProfilePlaceholder";

interface Props {
  userId: string;
  typePage: "public" | "private";
}

export default function ProfilePaginationTools({ userId, typePage }: Props) {
  const [perPage, setPerPage] = useState(16);
  const [tools, setTools] = useState<Tool[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updatePerPage = () => setPerPage(window.innerWidth < 1440 ? 8 : 16);
    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchFilteredTools = async () => {
      setLoading(true);
      setPage(1);

      try {
        const response = await fetchToolsUserId(userId, 1, perPage);
        if (!cancelled) {
          setTools(response.tools);
          setTotalPages(response.totalPages);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchFilteredTools();
    return () => {
      cancelled = true;
    };
  }, [perPage]);

  const handleShowMore = async () => {
    if (page >= totalPages || loading) return;

    const nextPage = page + 1;
    setLoading(true);

    try {
      const response = await fetchToolsUserId(userId, nextPage, perPage);
      setTools((prev) => {
        if (prev && nextPage === page + 1) {
          return [...prev, ...response.tools];
        }
        return prev || response.tools;
      });
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {tools ? (
        tools.length > 0 ? (
          <ToolGrid tools={tools} />
        ) : !loading && typePage === "private" ? (
          <PrivateProfilePlaceholder />
        ) : (
          <PublicProfilePlaceholder />
        )
      ) : (
        <div>Завантаження...</div>
      )}

      {tools && page < totalPages && (
        <LoadMoreButton
          onClick={handleShowMore}
          disabled={loading}
          loading={loading}
        />
      )}
    </div>
  );
}
