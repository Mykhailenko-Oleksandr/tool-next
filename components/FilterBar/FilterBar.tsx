"use client";

import dynamic from "next/dynamic";
import type {
	Props as SelectProps,
	StylesConfig,
	MultiValue,
} from "react-select";
import { Category } from "@/types/category";

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

export default function FilterBar({
	categories,
	selectedCategories,
	onChange,
	onReset,
}: Props) {
	const options: Option[] = categories.map((cat) => ({
		value: cat._id,
		label: cat.title,
	}));

	const selectedOptions: Option[] = selectedCategories.map((cat) => ({
		value: cat._id,
		label: cat.title,
	}));

	const styles: StylesConfig<Option, true> = {
		control: (base) => ({
			...base,
			borderRadius: "8px",
			minHeight: "40px",
			borderColor: "#000",
			boxShadow: "none",
		}),
		menu: (base) => ({
			...base,
			marginTop: 0,
		}),
	};

	const handleChange = (value: MultiValue<Option>) => {
		const mapped = value
			.map((opt) => categories.find((c) => c._id === opt.value))
			.filter((c): c is Category => Boolean(c));

		onChange(mapped);
	};

	return (
		<div style={{ display: "flex", gap: 10 }}>
			<Select<Option, true>
				options={options}
				value={selectedOptions}
				onChange={handleChange}
				styles={styles}
				isMulti
				placeholder="Всі категорії"
			/>

			{onReset && <button onClick={onReset}>Скинути фільтри</button>}
		</div>
	);
}
