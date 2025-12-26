"use client";

import css from "./EmptyToolCard.module.css";

interface EmptyToolCardProps {
	searchQuery: string;
	categoryName: string;
}

export default function EmptyToolCard({
	searchQuery,
	categoryName,
}: EmptyToolCardProps) {
	const message = searchQuery
		? `Інструменти за пошуковим запитом "${searchQuery}" не знайдені`
		: categoryName
			? `Інструменти за категорією ${categoryName} не знайдені`
			: `Інструменти не знайдені`;

	return (
		<div className={css.toolCard}>
			<h4 className={css.title}>{message}</h4>
		</div>
	);
}
