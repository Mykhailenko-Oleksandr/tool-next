import { Metadata } from "next";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import ToolDetailsClient from "./ToolDetails.client";
import { fetchToolById } from "@/lib/api/clientApi";

interface Props {
  params: Promise<{
    toolId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { toolId } = await params;
  const tool = await fetchToolById(toolId);

  return {
    title: tool.name,
    description: tool.description.slice(0, 30),
    openGraph: {
      title: tool.name,
      description: tool.description.slice(0, 100),
      url: `https://tool-next-chi.vercel.app/tools/${toolId}`,
      images: [
        {
          url: tool.images
            ? tool.images
            : "https://res.cloudinary.com/ddln4hnns/image/upload/v1765352917/cover_kkf3m7.jpg",
        },
      ],
    },
  };
}

export default async function ToolDetailsPage({ params }: Props) {
  const { toolId } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tool", toolId],
    queryFn: () => fetchToolById(toolId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ToolDetailsClient toolId={toolId} />
    </HydrationBoundary>
  );
}
