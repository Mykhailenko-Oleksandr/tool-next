"use client";

import UserProfile from "@/components/UserProfile/UserProfile";
import css from "./ProfilePage.module.css";
import { User } from "@/types/user";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchToolsUserId } from "@/lib/api/clientApi";
import { useEffect, useState } from "react";
import PrivateProfilePlaceholder from "@/components/PrivateProfilePlaceholder/PrivateProfilePlaceholder";
import ToolGrid from "@/components/ToolGrid/ToolGrid";
import LoadMoreButton from "@/components/LoadMoreButton/LoadMoreButton";
import { Tool } from "@/types/tool";

interface ProfileClientProps {
  user: User;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const [page, setPage] = useState(1);
  const [tools, setTools] = useState<Tool[] | []>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tools", page, user._id],
    queryFn: () => fetchToolsUserId(user._id, page),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (data?.tools) {
      setTools((prev) => [...prev, ...data.tools]);
    }
  }, [data]);

  console.log(data);

  const totalPages = data?.totalPages ?? 0;

  if (isLoading) return <p>Завантаження...</p>;

  const handleShowMore = () => {
    setPage(page + 1);
  };

  // const handleShowMore = async () => {
  //   if (page >= totalPages || loading) return;

  //   const nextPage = page + 1;
  //   setLoading(true);

  //   try {
  //     const response = await fetchToolsUserId(userId, nextPage, perPage);
  //     setTools((prev) => {
  //       if (prev && nextPage === page + 1) {
  //         return [...prev, ...response.tools];
  //       }
  //       return prev || response.tools;
  //     });
  //     setPage(nextPage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <section className={css.profilePage}>
      <div className="container">
        <UserProfile user={user} />
        <div className={css.titleWrap}>
          <h2 className={css.profileToolsTitle}>Інструменти</h2>
        </div>

        {data !== undefined && data?.tools.length === 0 && (
          <PrivateProfilePlaceholder />
        )}
        {isError && <p>Щось пішло не так... Спробуйте ще.</p>}

        {data !== undefined && data?.tools.length > 0 && (
          <>
            <ToolGrid tools={data.tools} />
            {page < totalPages && (
              <LoadMoreButton
                onClick={handleShowMore}
                disabled={isLoading}
                loading={isLoading}
              />
            )}{" "}
          </>
        )}
      </div>
    </section>
  );
}
