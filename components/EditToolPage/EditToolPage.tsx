"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchToolById, Tool } from "@/lib/api/toolsApi";
import AddEditToolForm from "@/components/AddEditToolForm/AddEditToolForm";
import Loading from "@/app/loading";
import toast from "react-hot-toast";

export default function EditToolPage() {
  const params = useParams();
  const router = useRouter();
  const toolId = params.toolId as string;
  const [tool, setTool] = useState<Tool | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTool = async () => {
      try {
        setIsLoading(true);
        const data = await fetchToolById(toolId);
        setTool(data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Не вдалося завантажити інструмент"
        );
        router.push("/tools");
      } finally {
        setIsLoading(false);
      }
    };

    if (toolId) {
      loadTool();
    }
  }, [toolId, router]);

  if (isLoading) {
    return <Loading />;
  }

  if (!tool) {
    return null;
  }

  return <AddEditToolForm toolId={toolId} initialData={tool} />;
}
