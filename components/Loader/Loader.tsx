"use client";

import styles from "./Loader.module.css";

type Props = {
  size?: number;
  backdrop?: boolean;
};

export default function Loader({ size = 72, backdrop = true }: Props) {
  return (
    <div
      className={backdrop ? styles.backdrop : styles.wrapper}
      style={{ "--size": `${size}px` } as React.CSSProperties}
    >
      <div className={styles.spinner} />
    </div>
  );
}
