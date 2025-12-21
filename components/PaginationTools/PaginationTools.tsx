"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ToolGrid from "@/components/ToolGrid/ToolGrid";
import { fetchTools } from "@/lib/api/clientApi";
import { Tool } from "@/types/tool";
import LoadMoreButton from "../LoadMoreButton/LoadMoreButton";
import { Category } from "@/types/category";
import FilterBar from "../FilterBar/FilterBar";
import EmptyToolCard from "../EmptyToolCard/EmptyToolCard";

interface Props {
	categories: Category[];
}

export default function PaginationTools({ categories }: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(
		searchParams.get("search") || ""
	);

	const [perPage, setPerPage] = useState(16);
	const [tools, setTools] = useState<Tool[] | null>(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

	useEffect(() => {
		const updatePerPage = () => setPerPage(window.innerWidth < 1440 ? 8 : 16);
		updatePerPage();
		window.addEventListener("resize", updatePerPage);
		return () => window.removeEventListener("resize", updatePerPage);
	}, []);

	useEffect(() => {
		setSearchQuery(searchParams.get("search") || "");
	}, [searchParams]);

	useEffect(() => {
		const fetchFilteredTools = async () => {
			setLoading(true);
			setPage(1);

			const categoryIds = selectedCategories.map((c) => c._id);

			try {
				const response = await fetchTools(1, categoryIds, perPage, searchQuery);
				setTools(response.tools);
				setTotalPages(response.totalPages);
			} finally {
				setLoading(false);
			}
		};

		fetchFilteredTools();
	}, [searchQuery, selectedCategories, perPage]);

	const handleShowMore = async () => {
		if (page >= totalPages) return;

		const nextPage = page + 1;
		setLoading(true);

		const categoryIds = selectedCategories.map((c) => c._id);

		try {
			const response = await fetchTools(
				nextPage,
				categoryIds,
				perPage,
				searchQuery
			);
			setTools((prev) =>
				prev ? [...prev, ...response.tools] : response.tools
			);
			setPage(nextPage);
		} finally {
			setLoading(false);
		}
	};

	const handleResetFilters = () => {
		setSelectedCategories([]);
		const params = new URLSearchParams(window.location.search);
		params.delete("search");
		router.replace(`${window.location.pathname}?${params.toString()}`);
		setSearchQuery("");
	};

	const handleCategoryChange = (newSelected: Category[]) => {
		setSelectedCategories(newSelected);

		if (searchQuery) {
			const params = new URLSearchParams(window.location.search);
			params.delete("search");
			router.replace(`${window.location.pathname}?${params.toString()}`);
			setSearchQuery("");
		}
	};

	return (
		<div>
			<FilterBar
				categories={categories}
				selectedCategories={selectedCategories}
				onChange={handleCategoryChange}
				onReset={handleResetFilters}
			/>

			{tools ? (
				tools.length > 0 ? (
					<ToolGrid tools={tools} />
				) : (
					!loading && (
						<EmptyToolCard
							searchQuery={searchQuery}
							categoryName={selectedCategories.map((c) => c.title).join(", ")}
						/>
					)
				)
			) : (
				<div>Завантаження...</div>
			)}

			{tools && page < totalPages && (
				<LoadMoreButton
					onClick={handleShowMore}
					disabled={loading}
					loading={loading}
				/>
			)}
		</div>
	);
}
