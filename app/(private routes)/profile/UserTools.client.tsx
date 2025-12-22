"use client";

import LoadMoreButton from "@/components/LoadMoreButton/LoadMoreButton";
import ToolGrid from "@/components/ToolGrid/ToolGrid";
import { Tool } from "@/types/tool";
import { useMemo, useState } from "react";

const perPage = 8;

export default function UserToolsClient({ tools }: {tools: Tool[]}) {
    const [visibleCount, setVisibleCount] = useState(perPage);

    const visibleTools = useMemo(
        () => tools.slice(0, visibleCount),
        [tools, visibleCount]
    );

    const hasMore = visibleCount < tools.length;

    return (<>
        <ToolGrid tools={visibleTools} />

        {hasMore && (
            <LoadMoreButton
                onClick={() =>
                    setVisibleCount((prev) => Math.min(prev + perPage, tools.length))
                }
            />
        )}
    </>
    );
}