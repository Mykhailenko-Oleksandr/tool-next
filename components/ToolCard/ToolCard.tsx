import Image from "next/image";
import Link from "next/link";
import css from "./ToolCard.module.css";

export default function ToolCard() {
  return (
    <>
      <div className={css.toolCard}>
        <Image
          src="/images/blank-image-mob.jpg"
          alt="Tool image"
          width={335}
          height={413}
          className={css.image}
        />

        <p className={css.rating}>5</p>
        <h4 className={css.title}>Штукатурна станція PFT G4</h4>
        <p className={css.price}>1500 грн/день</p>
        <Link className={css.link} href="/tools/id">
          Детальніше
        </Link>
      </div>
    </>
  );
}
