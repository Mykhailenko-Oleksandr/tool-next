"use client";

import css from "./EmptyToolCard.module.css";

interface EmptyToolCardProps {
	categoryName: string; // назва категорії, по якій нічого не знайдено
}

export default function EmptyToolCard({ categoryName }: EmptyToolCardProps) {
	return (
		<div className={css.toolCard}>
			<h4 className={css.title}>
				Інструменти за категорією {categoryName} не знайдені
			</h4>
		</div>
	);
}
