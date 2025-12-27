import { Metadata } from "next";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import ToolDetailsClient from "./ToolDetails.client";
import { fetchToolById, fetchToolByIdWithFeedbacks } from "@/lib/api/clientApi";

interface Props {
  params: Promise<{
    toolId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { toolId } = await params;
  const tool = await fetchToolById(toolId); // Метаданные без отзывов (не нужны для SEO)

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
    queryKey: ["tool", toolId, "withFeedbacks"],
    queryFn: () => fetchToolByIdWithFeedbacks(toolId), // V2807: Prefetch с отзывами
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ToolDetailsClient toolId={toolId} />
    </HydrationBoundary>
  );
}
