"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import css from "./ToolCard.module.css";
import type { Tool } from "@/types/tool";

type Props = {
  tool: Tool;
};

const clampRating = (v: unknown) => {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : 0;
  const safe = Number.isFinite(n) ? n : 0;
  return Math.max(0, Math.min(5, safe));
};

const toPrice = (v: unknown) => {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : 0;
};

const normalizeImages = (images: Tool["images"]) => {
  if (typeof images === "string") return [images.trim()];
  if (Array.isArray(images)) return images.map((i) => i.trim()).filter(Boolean);
  return [];
};

export default function ToolCard({ tool }: Props) {
  const name = tool.name ?? "";
  const rating = clampRating(tool.rating);
  const price = toPrice(tool.pricePerDay);

  const fallback = "/images/blank-image-desk.jpg";

  const sources = useMemo(() => {
    const list = normalizeImages(tool.images);
    return [...list, fallback];
  }, [tool.images]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [sources]);

  const src = sources[index] ?? fallback;
  const filled = Math.round(rating);

  return (
    <article className={css.card}>
      <div className={css.imageWrap}>
        <Image
          key={src}
          src={src}
          alt={name || "Tool"}
          fill
          unoptimized
          sizes="(min-width: 1440px) 310px, (min-width: 768px) 340px, 100vw"
          className={css.image}
          onError={() => {
            setIndex((i) => Math.min(i + 1, sources.length - 1));
          }}
        />
      </div>

      <div className={css.body}>
        <div className={css.stars}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < filled ? css.starFilled : css.star}>
              ★
            </span>
          ))}
        </div>

        <h3 className={css.name}>{name}</h3>

        <div className={css.meta}>
          <span className={css.price}>{price ? `${price} грн/день` : "Ціну уточнюйте"}</span>
          <button type="button" className={css.button}>
            Детальніше
          </button>
        </div>
      </div>
    </article>
  );
}
