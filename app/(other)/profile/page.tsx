import UserProfile from "@/components/UserProfile/UserProfile";
import { getMe } from "@/lib/api/serverApi";
import { redirect } from "next/navigation";
import css from "./ProfilePage.module.css";
import { Metadata } from "next";
import ProfilePaginationTools from "@/components/ProfilePaginationsTool/ProfilePaginationsTool";

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

export default async function ProfilePage() {
  const user = await getMe();

  if (!user) {
    redirect("/");
  }

  return (
    <section className={css.profilePage}>
      <div className="container">
        <UserProfile user={user} />

        <div className={css.titleWrap}>
          <h2 className={css.profileToolsTitle}>Інструменти</h2>
        </div>

        <ProfilePaginationTools userId={user._id} typePage="private" />
      </div>
    </section>
  );
}
