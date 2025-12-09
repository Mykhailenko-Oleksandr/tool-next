import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { Metadata } from "next";
import { fetchNotes } from "@/lib/api/serverApi";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${slug[0]} Notes`,
    description: `Notes by category "${slug[0]}"`,
    openGraph: {
      title: `Notes: ${slug[0]}`,
      description: `Notes by category "${slug[0]}"`,
      url: `https://08-zustand-blush-beta.vercel.app/notes/filter/${slug[0]}`,
      images: [
        { url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg" },
      ],
    },
  };
}

// Prefetch виконується тільки для першої сторінки без пошуку (topic="").
// На клієнті NotesClient вже сам керує topic та page.
const topic = "";
const page = 1;

export default async function Notes({ params }: Props) {
  const queryClient = new QueryClient();

  const { slug } = await params;
  const category = slug[0];

  await queryClient.prefetchQuery({
    queryKey: ["notes", topic, page, category],
    queryFn: () => fetchNotes(topic, page, category),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient category={category} />
    </HydrationBoundary>
  );
}
