import { fetchToolById } from "@/lib/api/clientApi";
import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import BookingToolClient from "./BookingTool.client";

interface Props {
  params: Promise<{ toolId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { toolId } = await params;
  const tool = await fetchToolById(toolId);

  return {
    title: `Бронювання ${tool.name}`,
    description: tool.description.slice(0, 30),
    openGraph: {
      title: `Бронювання ${tool.name}`,
      description: tool.description.slice(0, 100),
      url: `https://tool-next-chi.vercel.app/tools/${toolId}/booking`,
      images: [{ url: tool.images }],
    },
  };
}

export default async function BookingTool({ params }: Props) {
  const { toolId } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tool", toolId],
    queryFn: () => fetchToolById(toolId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BookingToolClient />
    </HydrationBoundary>
  );
}
