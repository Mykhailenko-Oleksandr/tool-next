"use client";

import { ReactNode } from "react";
import css from "./AddEditToolPage.module.css";

interface AddEditToolPageProps {
  children: ReactNode;
}

export default function AddEditToolPage({ children }: AddEditToolPageProps) {
  return (
    <section className={css["page-section"]}>
      <div className="container">{children}</div>
    </section>
  );
}

