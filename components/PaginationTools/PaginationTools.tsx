// "use client";

// import { useState, useEffect } from "react";
// import ToolGrid from "@/components/ToolGrid/ToolGrid";
// import { fetchTools } from "@/lib/api/clientApi";
// import { Tool } from "@/types/tool";
// import LoadMoreButton from "../LoadMoreButton/LoadMoreButton";
// import { Category } from "@/types/category";
// import FilterBar from "../FilterBar/FilterBar";

// interface Props {
// 	initialTools: Tool[];
// 	totalPages: number;
// 	categories: Category[];
// }

// export default function PaginationTools({
// 	initialTools,
// 	totalPages,
// 	categories,
// }: Props) {
// 	const [perPage, setPerPage] = useState(16);
// 	const [tools, setTools] = useState<Tool[]>(initialTools);
// 	const [page, setPage] = useState(1);
// 	const [totalPagesState] = useState(totalPages);
// 	const [loading, setLoading] = useState(false);
// 	const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

// 	useEffect(() => {
// 		const updatePerPage = () => {
// 			const width = window.innerWidth;
// 			if (width < 768) setPerPage(8);
// 			else if (width < 1440) setPerPage(8);
// 			else setPerPage(16);
// 		};

// 		updatePerPage();
// 		window.addEventListener("resize", updatePerPage);
// 		return () => window.removeEventListener("resize", updatePerPage);
// 	}, []);

// 	const handleShowMore = async () => {
// 		if (page >= totalPagesState) return;

// 		const nextPage = page + 1;
// 		setLoading(true);

// 		try {
// 			const response = await fetchTools(nextPage, undefined, perPage);
// 			setTools((prev) => [...prev, ...response.tools]);
// 			setPage(nextPage);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return (
// 		<div>
// 			{/* {categories.map((cat) => (
// 				<div key={cat._id}>{cat.title}</div>
// 			))} */}
// 			<FilterBar
// 				categories={categories}
// 				onChange={(cats) => setSelectedCategories(cats)}
// 			/>
// 			<ToolGrid tools={tools} />

// 			{page < totalPagesState && (
// 				<LoadMoreButton
// 					onClick={handleShowMore}
// 					disabled={loading}
// 					loading={loading}
// 				/>
// 			)}
// 		</div>
// 	);
// }
"use client";

import { useState, useEffect } from "react";
import ToolGrid from "@/components/ToolGrid/ToolGrid";
import { fetchTools } from "@/lib/api/clientApi";
import { Tool } from "@/types/tool";
import LoadMoreButton from "../LoadMoreButton/LoadMoreButton";
import { Category } from "@/types/category";
import FilterBar from "../FilterBar/FilterBar";

interface Props {
	initialTools: Tool[];
	totalPages: number;
	categories: Category[];
}

export default function PaginationTools({
	initialTools,
	totalPages,
	categories,
}: Props) {
	const [perPage, setPerPage] = useState(16);
	const [tools, setTools] = useState<Tool[]>(initialTools);
	const [page, setPage] = useState(1);
	const [totalPagesState, setTotalPagesState] = useState(totalPages);
	const [loading, setLoading] = useState(false);
	const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

	useEffect(() => {
		const updatePerPage = () => {
			const width = window.innerWidth;
			if (width < 1440) setPerPage(8);
			else setPerPage(16);
		};

		updatePerPage();
		window.addEventListener("resize", updatePerPage);
		return () => window.removeEventListener("resize", updatePerPage);
	}, []);

	useEffect(() => {
		const fetchFilteredTools = async () => {
			setLoading(true);
			setPage(1);

			const categoryIds = selectedCategories.map((c) => c._id);
			const categoryParam = categoryIds.length
				? categoryIds.join(",")
				: undefined;

			try {
				const response = await fetchTools(1, categoryParam, perPage);
				setTools(response.tools);
				setTotalPagesState(response.totalPages);
			} finally {
				setLoading(false);
			}
		};

		fetchFilteredTools();
	}, [selectedCategories, perPage]);

	const handleShowMore = async () => {
		if (page >= totalPagesState) return;

		const nextPage = page + 1;
		setLoading(true);

		const categoryIds = selectedCategories.map((c) => c._id);
		const categoryParam = categoryIds.length
			? categoryIds.join(",")
			: undefined;

		try {
			const response = await fetchTools(nextPage, categoryParam, perPage);
			setTools((prev) => [...prev, ...response.tools]);
			setPage(nextPage);
		} finally {
			setLoading(false);
		}
	};

	const handleResetFilters = () => {
		setSelectedCategories([]);
	};

	return (
		<div>
			<FilterBar
				categories={categories}
				selectedCategories={selectedCategories}
				onChange={setSelectedCategories}
				onReset={handleResetFilters}
			/>
			<ToolGrid tools={tools} />

			{page < totalPagesState && (
				<LoadMoreButton
					onClick={handleShowMore}
					disabled={loading}
					loading={loading}
				/>
			)}
		</div>
	);
}
