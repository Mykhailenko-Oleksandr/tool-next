"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import css from "./BookingTool.module.css";
import { fetchToolById } from "@/lib/api/clientApi";
import BookingToolForm from "@/components/BookingToolForm/BookingToolForm";

export default function BookingToolClient() {
  const { toolId } = useParams<{ toolId: string }>();
  const router = useRouter();

  const {
    data: tool,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tool", toolId],
    queryFn: () => fetchToolById(toolId),
    refetchOnMount: false,
  });

  console.log(tool);

  if (isLoading) return <p>Триває завантаження...</p>;

  if (error || !tool) return <p>Щось пішло не так</p>;

  return (
    <section className={css.section}>
      <div className="container">
        <h2 className={css.title}>Підтвердження бронювання</h2>

        <BookingToolForm tool={tool} />
      </div>
    </section>
  );
}
