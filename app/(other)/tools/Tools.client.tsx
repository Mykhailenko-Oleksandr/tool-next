"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";

import ToolGrid from "@/components/ToolGrid/ToolGrid";
import LoadMoreButton from "@/components/LoadMoreButton/LoadMoreButton";
import FilterBar from "@/components/FilterBar/FilterBar";
import EmptyToolCard from "@/components/EmptyToolCard/EmptyToolCard";

import { fetchTools } from "@/lib/api/clientApi";
import { Tool } from "@/types/tool";
import { Category } from "@/types/category";

interface Props {
	categories: Category[];
	initialSearch: string;
}

export default function ToolsClient({ categories, initialSearch }: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
	const [perPage, setPerPage] = useState(16);
	const [searchValue, setSearchValue] = useState(initialSearch);

	useEffect(() => {
		const urlSearch = searchParams.get("search") ?? "";
		setSearchValue(urlSearch);
	}, [searchParams]);

	useEffect(() => {
		const updatePerPage = () => {
			setPerPage(window.innerWidth < 1440 ? 8 : 16);
		};

		updatePerPage();
		window.addEventListener("resize", updatePerPage);
		return () => window.removeEventListener("resize", updatePerPage);
	}, []);

	const categoryIds = useMemo(
		() => selectedCategories.map((c) => c._id),
		[selectedCategories]
	);

	const searchQuery = selectedCategories.length > 0 ? "" : searchValue;

	const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
		useInfiniteQuery({
			queryKey: ["tools", searchQuery, categoryIds, perPage],
			queryFn: ({ pageParam = 1 }) =>
				fetchTools({
					page: pageParam,
					perPage,
					search: searchQuery,
					categories: categoryIds,
				}),
			initialPageParam: 1,
			getNextPageParam: (lastPage, pages) =>
				pages.length < lastPage.totalPages ? pages.length + 1 : undefined,
		});

	const tools: Tool[] = data?.pages.flatMap((page) => page.tools) ?? [];

	const handleCategoryChange = (newSelected: Category[]) => {
		setSelectedCategories(newSelected);
		setSearchValue("");

		if (searchParams.get("search")) {
			router.replace("/tools");
		}
	};

	const handleResetFilters = () => {
		setSelectedCategories([]);
		setSearchValue("");
		router.replace("/tools");
	};

	return (
		<div>
			<FilterBar
				categories={categories}
				selectedCategories={selectedCategories}
				onChange={handleCategoryChange}
				onReset={handleResetFilters}
			/>

			{isLoading ? (
				<div>Завантаження...</div>
			) : tools.length > 0 ? (
				<ToolGrid tools={tools} />
			) : (
				!isFetching && (
					<EmptyToolCard
						searchQuery={searchQuery}
						categoryName={selectedCategories.map((c) => c.title).join(", ")}
					/>
				)
			)}

			{hasNextPage && (
				<LoadMoreButton
					onClick={() => fetchNextPage()}
					disabled={isFetching}
					loading={isFetching}
				/>
			)}
		</div>
	);
}
