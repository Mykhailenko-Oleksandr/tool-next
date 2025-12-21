"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import UserProfile from "@/components/UserProfile/UserProfile";
import ToolGrid from "@/components/ToolGrid/ToolGrid";
import PublicProfilePlaceholder from "@/components/PublicProfilePlaceholder/PublicProfilePlaceholder";
import Loader from "@/components/Loader/Loader";
import css from "./page.module.css";
import { Tool } from "@/types/tool";
import { User } from "@/types/user";

type ApiUser = {
  _id: string;
  name: string;
  avatarUrl?: string;
};

type ApiTool = {
  _id: string;
  name: string;
  pricePerDay: number;
  images: unknown;
  rating?: number;
  specifications?: Record<string, unknown>;
};

type ApiPagination = {
  hasNextPage: boolean;
};

type ApiResponse = {
  user?: ApiUser;
  page?: number | string;
  perPage?: number | string;
  totalPages?: number | string;
  totalTools?: number | string;
  pagination?: ApiPagination;
  tools?: ApiTool[];
  message?: string;
};

function toNumber(v: unknown, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function uniqById(list: Tool[]) {
  const map = new Map<string, Tool>();
  for (const t of list) map.set(t._id, t);
  return Array.from(map.values());
}

function toUser(u: ApiUser): User {
  return {
    _id: u._id,
    name: u.name,
    email: "",
    avatarUrl: u.avatarUrl ?? "",
  };
}

function toTool(t: ApiTool, owner: User): Tool {
  return {
    _id: t._id,
    owner,
    category: "",
    name: t.name,
    description: "",
    pricePerDay: t.pricePerDay,
    images: t.images as Tool["images"],
    rating: typeof t.rating === "number" ? t.rating : 0,
    specifications: (t.specifications ?? {}) as Tool["specifications"],
    rentalTerms: "",
    bookedDates: [],
    feedbacks: [],
  };
}

export default function PublicProfilePage() {
  const params = useParams<{ userId: string }>();
  const userId = params?.userId;

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [owner, setOwner] = useState<User | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    async function loadFirst() {
      setIsLoading(true);
      setIsLoadingMore(false);
      setErrorText("");
      setOwner(null);
      setTools([]);
      setPage(1);
      setHasNext(false);

      const res = await fetch(
        `/api/users/${encodeURIComponent(userId)}/tools?page=1&perPage=8`,
        { cache: "no-store" }
      );

      const json = (await res.json().catch(() => null)) as ApiResponse | null;

      if (cancelled) return;

      if (!res.ok || !json?.user) {
        setIsLoading(false);
        return;
      }

      const user = toUser(json.user);
      const list = Array.isArray(json.tools) ? json.tools : [];
      const mapped = list.map((t) => toTool(t, user));

      const currentPage = toNumber(json.page, 1);
      const totalPages = toNumber(json.totalPages, 1);
      const backendHasNext = Boolean(json.pagination?.hasNextPage);

      setOwner(user);
      setTools(mapped);
      setPage(currentPage);
      setHasNext(backendHasNext && currentPage < totalPages);
      setIsLoading(false);
    }

    loadFirst();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function handleLoadMore() {
    if (!userId || !owner || !hasNext || isLoadingMore) return;

    setIsLoadingMore(true);
    setErrorText("");

    const next = page + 1;

    const res = await fetch(
      `/api/users/${encodeURIComponent(userId)}/tools?page=${next}&perPage=8`,
      { cache: "no-store" }
    );

    const json = (await res.json().catch(() => null)) as ApiResponse | null;

    if (!res.ok) {
      setErrorText(json?.message || "Не вдалося завантажити наступну сторінку.");
      setIsLoadingMore(false);
      return;
    }

    const list = Array.isArray(json?.tools) ? json.tools : [];
    const more = list.map((t) => toTool(t, owner));

    const currentPage = toNumber(json?.page, next);
    const totalPages = toNumber(json?.totalPages, currentPage);
    const backendHasNext = Boolean(json?.pagination?.hasNextPage);

    setTools((prev) => uniqById([...prev, ...more]));
    setPage(currentPage);
    setHasNext(backendHasNext && currentPage < totalPages);
    setIsLoadingMore(false);
  }

  if (isLoading) {
    return (
      <section className={css.profilePage}>
        <Loader />
      </section>
    );
  }

  if (!owner) {
    return (
      <section className={css.profilePage}>
        <div className="container">
          <PublicProfilePlaceholder />
        </div>
      </section>
    );
  }

  return (
    <section className={css.profilePage}>
      <div className="container">
        <UserProfile user={owner} />
      </div>

      <div className="container">
        <div className={css.titleWrap}>
          <h2 className={css.profileToolsTitle}>Інструменти</h2>
        </div>
      </div>

      {tools.length > 0 ? <ToolGrid tools={tools} /> : <PublicProfilePlaceholder />}

      <div className="container">
        {errorText ? <p className={css.errorText}>{errorText}</p> : null}

        {tools.length > 0 && hasNext ? (
          <div className={css.loadMoreWrapper}>
            <button
              type="button"
              className={css.loadMoreButton}
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? <Loader size={24} backdrop={false} /> : "Показати більше"}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
