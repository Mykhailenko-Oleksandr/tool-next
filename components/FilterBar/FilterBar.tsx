"use client";

import dynamic from "next/dynamic";
import type {
	Props as SelectProps,
	StylesConfig,
	MultiValue,
} from "react-select";
import { Category } from "@/types/category";
import css from "./FilterBar.module.css";

const Select = dynamic(() => import("./ClientSelect"), { ssr: false }) as <
	Option,
	IsMulti extends boolean = false,
>(
	props: SelectProps<Option, IsMulti>
) => React.ReactElement;

interface Props {
	categories: Category[];
	selectedCategories: Category[];
	onChange: (categories: Category[]) => void;
	onReset?: () => void;
}

interface Option {
	value: string;
	label: string;
}

const ALL_OPTION: Option = {
	value: "__all__",
	label: "Всі категорії",
};

export default function FilterBar({
	categories,
	selectedCategories,
	onChange,
	onReset,
}: Props) {
	const options: Option[] = [
		ALL_OPTION,
		...categories.map((cat) => ({
			value: cat._id,
			label: cat.title,
		})),
	];

	const selectedOptions: Option[] = selectedCategories.map((cat) => ({
		value: cat._id,
		label: cat.title,
	}));

	const styles: StylesConfig<Option, true> = {
		control: (base, state) => ({
			...base,
			minHeight: 40,
			borderRadius: state.selectProps.menuIsOpen ? "6px 6px 0 0" : 6,
			borderWidth: 2,
			borderStyle: "solid",
			transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
			color: "var(--color-scheme-1-text)",
			borderColor: state.isFocused
				? "var(--color-electric-violet-light);"
				: "var(--color-neutral-darkest)",
			backgroundColor: state.isFocused
				? "var(--color-electric-violet-lightest)"
				: "var(--opacity-transparent)",
			boxShadow: "none",
			cursor: "pointer",
			"&:hover": {
				backgroundColor: "var(--color-electric-violet-lightest)",
				color: "var(--color-neutral-darkest)",
			},
		}),

		indicatorSeparator: () => ({
			display: "none",
		}),

		dropdownIndicator: (base, state) => ({
			...base,
			transition:
				"transform 250ms cubic-bezier(0.4, 0, 0.2, 1), color 250ms cubic-bezier(0.4, 0, 0.2, 1)",
			transform: state.selectProps.menuIsOpen
				? "rotate(180deg)"
				: "rotate(0deg)",
			color: state.isFocused
				? "var(--opacity-neutral-darkest-60)"
				: "var(--color-scheme-1-text)",
		}),

		placeholder: (base) => ({
			...base,
			color: "#000",
		}),

		multiValue: (base) => ({
			...base,
			backgroundColor: "#ede9fe",
			borderRadius: 6,
		}),

		multiValueLabel: (base) => ({
			...base,
			color: "#5b21b6",
			fontWeight: 500,
		}),

		multiValueRemove: (base) => ({
			...base,
			cursor: "pointer",
			":hover": {
				backgroundColor: "#8b5cf6",
				color: "#fff",
			},
		}),

		menu: (base) => ({
			...base,
			marginTop: 0,
			borderRadius: "0 0 6px 6px",
			overflow: "hidden",
			borderWidth: 2,
			borderTopWidth: 0,
			borderStyle: "solid",
			borderColor: "var(--color-electric-violet-light);",
			backgroundColor: "var(--color-electric-violet-lightest)",
		}),

		menuList: (base) => ({
			...base,
			maxHeight: 264,
			padding: 0,
			"::-webkit-scrollbar": {
				width: "7px",
			},
			"::-webkit-scrollbar-track": {
				background: "var(--color-electric-violet-light)",
				borderRadius: "4px",
			},
			"::-webkit-scrollbar-thumb": {
				background: "var(--color-electric-violet-dark)",
				borderRadius: "4px",
			},
			"::-webkit-scrollbar-thumb:hover": {
				background: "#5b21b6",
			},
		}),

		option: (base, state) => ({
			...base,
			cursor: "pointer",
			paddingLeft: 12,
			paddingTop: 8,
			paddingBottom: 8,
			transition:
				"background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), color 250ms cubic-bezier(0.4, 0, 0.2, 1)",
			color: state.isSelected
				? "var(--color-neutral-darkest)"
				: "var(--color-scheme-1-text);",
			backgroundColor: state.isSelected
				? "var(--color-electric-violet-lighter)"
				: state.isFocused
					? "var(--color-electric-violet-lighter)"
					: "var(--color-electric-violet-lightest)",
			"&:active": {
				backgroundColor: "var(--color-electric-violet-lighter)",
			},
		}),
	};

	const handleChange = (value: MultiValue<Option>) => {
		if (value.some((v) => v.value === "__all__")) {
			onChange([]);
			return;
		}

		const mapped = value
			.map((opt) => categories.find((c) => c._id === opt.value))
			.filter((c): c is Category => Boolean(c));

		onChange(mapped);
	};

	return (
		<div className={css.filterWrapper}>
			<Select<Option, true>
				options={options}
				value={selectedOptions}
				onChange={handleChange}
				styles={styles}
				isMulti
				closeMenuOnSelect={false}
				hideSelectedOptions={false}
				placeholder="Всі категорії"
				classNamePrefix="categorySelect"
				className={css.selectFilter}
				isSearchable={false}
			/>

			{onReset && (
				<button className={css.resetBtn} onClick={onReset}>
					Скинути фільтри
				</button>
			)}
		</div>
	);
}
