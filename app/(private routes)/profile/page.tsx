import UserProfile from "@/components/UserProfile/UserProfile";
import ToolGrid from "@/components/ToolGrid/ToolGrid";
import { getMe } from "@/lib/api/serverApi";
import { redirect } from "next/navigation";
import css from "./ProfilePage.module.css";
import { Metadata } from "next";
import PrivateProfilePlaceholder from "@/components/PrivateProfilePlaceholder/PrivateProfilePlaceholder";
import { fetchToolsUserId } from "@/lib/api/clientApi";

export async function generateMetadata(): Promise<Metadata> {
  const user = await getMe();

  if (!user) {
    return { title: "Профіль" };
  }

  return {
    title: `${user.name}`,
    description: "Ваш профіль",
    robots: { index: false, follow: false },
  };
}

export default async function ProfilePage() {
  const user = await getMe();

  if (!user) {
    redirect("/");
  }

  const tools = await fetchToolsUserId(user._id);

  return (
    <section className={css.profilePage}>
      <div className="container">
        <UserProfile user={user} />

        <div className={css.titleWrap}>
          <h2 className={css.profileToolsTitle}>Інструменти</h2>
        </div>

        {tools.length > 0 ? (
          <>
            <ToolGrid tools={tools} />

            {/* кнопка для майбутньої пагінації */}
            <div className={css.loadMoreWrapper}>
              <button type="button" className={css.loadMoreButton}>
                Показати більше
              </button>
            </div>
          </>
        ) : (
          <PrivateProfilePlaceholder />
        )}
      </div>
    </section>
  );
}
