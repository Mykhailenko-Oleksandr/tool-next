// FeaturedToolsBlock.tsx
"use client";

import React, { useState } from "react";
import styles from "./FeaturedToolsBlock.module.css";
// import ToolCard from "../ToolsCard/ToolCard";
// import ToolModal from "../ToolsCard/ToolModal";
import Link from "next/link";

interface Tool {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  description: string;
}

interface Props {
  tools: Tool[];
}

const FeaturedToolsBlock: React.FC<Props> = ({ tools }) => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const handleCardClick = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const closeModal = () => {
    setSelectedTool(null);
  };

  return (
    // ❗️ Прибрано "container" щоб уникнути лівого прилипання
    <section className={styles.featuredToolsContainer}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Популярні інструменти</h2>

        <div className={styles.grid}>
          {tools.slice(0, 8).map((tool) => (
            <div
              key={tool.id}
              className={styles.cardPlaceholder}
              onClick={() => handleCardClick(tool)}
            >
              <img src={tool.imageUrl} alt={tool.name} />
              <h3>{tool.name}</h3>
              <p>{tool.price} грн</p>
            </div>
          ))}
        </div>

        <div className={styles.buttonWrapper}>
          <Link href="/tools" className={styles.catalogButton}>
            До всіх інструментів
          </Link>
        </div>

        {/* {selectedTool && <ToolModal tool={selectedTool} onClose={closeModal} />} */}
      </div>
    </section>
  );
};

export default FeaturedToolsBlock;
