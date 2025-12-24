import { redirect } from "next/navigation";
import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchToolsUserId } from "@/lib/api/serverApi";
import PublicProfileClient from "./PublicProfile.client";
import { fetchUserById } from "@/lib/api/clientApi";

interface Props {
  params: Promise<{
    userId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  const user = await fetchUserById(userId);

  if (!user) {
    return { title: "Профіль" };
  }

  return {
    title: `${user.name}`,
    description: `Профіль користувача ${user.name} на платформі ToolNext`,
    openGraph: {
      title: user.name,
      description: `Переглянь профіль користувача ${user.name}: інструменти, рейтинги та активність на ToolNext.`,
      url: `https://tool-next-chi.vercel.app/profile/${user._id}`,
      images: [
        {
          url: user.avatarUrl
            ? user.avatarUrl
            : "https://res.cloudinary.com/ddln4hnns/image/upload/v1765352917/cover_kkf3m7.jpg",
        },
      ],
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { userId } = await params;
  const queryClient = new QueryClient();
  const user = await fetchUserById(userId);

  if (!user) {
    redirect("/");
  }

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["tools", user._id],
    queryFn: ({ pageParam = 1 }) => fetchToolsUserId(user._id, pageParam),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PublicProfileClient user={user} />
    </HydrationBoundary>
  );
}
