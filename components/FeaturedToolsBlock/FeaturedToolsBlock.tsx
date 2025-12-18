import React from "react";
import styles from "./FeaturedToolsBlock.module.css";
import ToolCard from "../ToolCard/ToolCard";
import Link from "next/link";
import { Tool } from "@/types/tool";

interface Props {
  tools?: Tool[];
}

export default function FeaturedToolsBlock({ tools }: Props) {
  const safeTools = Array.isArray(tools) ? tools : [];

  return (
    <section className={styles.featuredToolsContainer}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Популярні інструменти</h2>

        <div className={styles.toolsList}>
          {safeTools.length > 0 ? (
            safeTools.slice(0, 8).map((tool) => (
              <ToolCard
                key={tool._id}
                tool={tool}
              />
            ))
          ) : (
            <p className={styles.emptyMessage}>Немає доступних інструментів</p>
          )}
        </div>

        <div className={styles.buttonWrapper}>
          <Link
            href="/tools"
            className={styles.catalogButton}>
            До всіх інструментів
          </Link>
        </div>
      </div>
    </section>
  );
}
