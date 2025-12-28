"use client";

import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import css from "./InteractiveStarsRating.module.css";

// V2807: Интерактивный рейтинг из 5 звёзд (используется внутри FeedbackFormModal).
interface InteractiveStarsRatingProps {
  value: number;
  onChange: (value: number) => void;
}

const CustomStar = (
  <path d="m15.999 23.257-6.216 3.749a1.137 1.137 0 0 1-1.259-.041c-.177-.127-.308-.291-.394-.493s-.104-.429-.054-.684l1.641-7.083-5.482-4.783c-.199-.171-.321-.365-.365-.58s-.038-.425.017-.63c.05-.204.164-.377.344-.518s.396-.222.65-.245l7.249-.633 2.808-6.691c.1-.232.25-.404.452-.518s.405-.17.609-.17.407.057.609.17c.202.113.353.286.452.518l2.808 6.691 7.257.633c.249.022.463.104.642.245s.294.313.344.518c.055.204.061.414.017.63s-.165.409-.365.58l-5.482 4.783 1.641 7.083c.05.254.032.482-.054.684a1.148 1.148 0 0 1-.999.704 1.115 1.115 0 0 1-.654-.17l-6.216-3.749z" />
);

const myStyles = {
  itemShapes: CustomStar,
  itemStrokeWidth: 2,
  // V2807: активные/неактивные звёзды — как на проекте
  activeFillColor: "var(--color-scheme-1-text)",
  activeStrokeColor: "var(--color-scheme-1-text)",
  inactiveFillColor: "transparent",
  inactiveStrokeColor: "var(--color-scheme-1-text)",
};

export default function InteractiveStarsRating({
  value,
  onChange,
}: InteractiveStarsRatingProps) {
  return (
    <Rating
      className={css.ratingBox}
      value={value}
      itemStyles={myStyles}
      onChange={onChange}
      items={5}
    />
  );
}


