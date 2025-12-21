import PaginationTools from "@/components/PaginationTools/PaginationTools";
import { fetchCategories, fetchTools } from "@/lib/api/clientApi";
import css from "./Tools.module.css";

const Tools = async () => {
	const response = await fetchTools(1, "All", 16);
	const categoriesResponse = await fetchCategories();
	console.log(categoriesResponse);

	return (
		<section>
			<div className="container">
				<h2 className={css.toolTitle}>Всі інструменти</h2>
				{response?.tools?.length > 0 && (
					<PaginationTools
						initialTools={response.tools}
						totalPages={response.totalPages}
						categories={categoriesResponse}
					/>
				)}
			</div>
		</section>
	);
};

export default Tools;
