import PaginationTools from "@/components/PaginationTools/PaginationTools";
import { fetchCategories } from "@/lib/api/clientApi";
import css from "./Tools.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Каталог інструментів",
	description: "Всі інструменти доступні для перегляду та оренди",
	openGraph: {
		title: "Каталог інструментів",
		description: "Всі інструменти доступні для перегляду та оренди",
		siteName: "ToolNext",
	},
};

const Tools = async () => {
	const categoriesResponse = await fetchCategories();

	return (
		<section className={css.toolSection}>
			<div className="container">
				<h2 className={css.toolTitle}>Всі інструменти</h2>
				<PaginationTools categories={categoriesResponse} />
			</div>
		</section>
	);
};

export default Tools;
