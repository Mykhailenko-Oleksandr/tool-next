import css from "./ToolGrid.module.css";
import ToolCard from "../ToolCard/ToolCard";
import { Tool } from "@/types/tool";

type Props = {
	tools: Tool[];
};

export default function ToolGrid({ tools }: Props) {
	return (
		<div className={css.grid}>
			{tools.map((tool) => (
				<ToolCard key={tool._id} tool={tool} />
			))}
		</div>
	);
}
