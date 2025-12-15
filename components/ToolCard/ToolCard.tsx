import Image from "next/image";
import Link from "next/link";
import css from "./ToolCard.module.css";
import StarsRating from "../StarsRating/StarsRating";
import { Tool } from "@/types/tool";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const isAuth = false;

  return (
    <>
      <div className={css.toolCard}>
        <Image
          src={tool.images}
          alt={tool.name}
          width={335}
          height={413}
          className={css.image}
        />

        <StarsRating rating={tool.rating} />
        <h4 className={css.title}>{tool.name}</h4>
        <p className={css.price}>`{tool.pricePerDay} грн/день`</p>
        {isAuth ? (
          <Link
            className={css.link}
            href={`/tools/${tool.id}`}>
            Детальніше
          </Link>
        ) : (
          <div className={css.btnBox}>
            <Link
              className={css.link}
              href={`/tools/edit/${tool.id}`}>
              Редагувати
            </Link>
            <button
              className={css.deleteBtn}
              type="button">
              <svg
                className={css.icon}
                width={24}
                height={24}>
                <use href="/icons.svg#icon-delete"></use>
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
