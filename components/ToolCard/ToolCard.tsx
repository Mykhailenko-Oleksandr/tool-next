"use client";

import Image from "next/image";
import Link from "next/link";
import css from "./ToolCard.module.css";
import StarsRating from "../StarsRating/StarsRating";
import { Tool } from "@/types/tool";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteTool } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { ApiError } from "@/app/api/api";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const { isAuthenticated, user } = useAuthStore();

  const queryClient = useQueryClient();

  const deleteToolMutate = useMutation({
    mutationFn: (id: string) => deleteTool(id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
    onError(error: unknown) {
      const err = error as ApiError;
      toast.error(
        err.response?.data?.response?.validation?.body?.message ||
          err.response?.data?.response?.message ||
          "Не вдалося видалити інструмент"
      );
    },
  });

  function handleDeleteTool(id: string) {
    deleteToolMutate.mutate(id);
  }

  const imageSrc = tool.images || "/images/blank-image-desk.jpg";

  return (
    <div className={css.toolCard}>
      <Image
        src={imageSrc}
        alt={tool.name}
        width={335}
        height={413}
        className={css.image}
      />

      <StarsRating rating={tool.rating} />
      <h3 className={css.title}>{tool.name}</h3>
      <p className={css.price}>{tool.pricePerDay} грн/день</p>
      {isAuthenticated && user?._id === tool.owner ? (
        <div className={css.btnBox}>
          <Link
            className={css.link}
            href={`/tools/${tool._id}/edit`}>
            Редагувати
          </Link>
          <button
            className={css.deleteBtn}
            onClick={() => handleDeleteTool(tool._id)}
            type="button">
            <svg
              className={css.icon}
              width={24}
              height={24}>
              <use href="/icons.svg#icon-delete"></use>
            </svg>
          </button>
        </div>
      ) : (
        <Link
          className={css.link}
          href={`/tools/${tool._id}`}>
          Детальніше
        </Link>
      )}
    </div>
  );
}
