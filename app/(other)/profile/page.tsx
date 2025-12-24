import { fetchToolsUserId, getMe } from "@/lib/api/serverApi";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ProfileClient from "./Profile.client";

export async function generateMetadata(): Promise<Metadata> {
  const user = await getMe();

  if (!user) {
    return { title: "Профіль" };
  }

  return {
    title: `${user.name}`,
    description: `Профіль користувача ${user.name} на платформі ToolNext`,
    openGraph: {
      title: user.name,
      description: `Переглянь профіль користувача ${user.name}: інструменти, рейтинги та активність на ToolNext.`,
      url: "https://tool-next-chi.vercel.app/profile",
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

const page = 1;

export default async function ProfilePage() {
  const queryClient = new QueryClient();
  const user = await getMe();

  if (!user) {
    redirect("/");
  }

  await queryClient.prefetchQuery({
    queryKey: ["tools", page, user._id],
    queryFn: () => fetchToolsUserId(user._id, page),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileClient user={user} />
    </HydrationBoundary>
  );
}
