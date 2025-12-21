"use client";

import Image from "next/image";
import css from "./EmptyToolCard.module.css";

interface EmptyToolCardProps {
	categoryName: string; // назва категорії, по якій нічого не знайдено
}

export default function EmptyToolCard({ categoryName }: EmptyToolCardProps) {
	return (
		<div className={css.toolCard}>
			<Image
				src="/images/blank-image-desk.jpg"
				alt="Порожня категорія"
				width={335}
				height={413}
				className={css.image}
			/>
			<h4 className={css.title}>
				Інструменти за категорією {categoryName} не знайдені
			</h4>
		</div>
	);
}
