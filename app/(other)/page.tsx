import Benefits from "@/components/Benefits/Benefits";
import FeaturedToolsBlock from "@/components/FeaturedToolsBlock/FeaturedToolsBlock";
import FeedbacksBlock from "@/components/FeedbacksBlock/FeedbacksBlock";
import Hero from "@/components/Hero/Hero";
import RegistrationBlock from "@/components/RegistrationBlock/RegistrationBlock";
import { fetchTools } from "@/lib/api/clientApi";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Створення інструмента",
  description:
    "Створи оголошення про оренду інструмента на ToolNext. Додай фото, опис, характеристики та ціну — і почни заробляти на своєму обладнанні вже сьогодні. Швидко, зручно та без зайвих кроків.",
  openGraph: {
    title: "Створення інструмента — ToolNext",
    description:
      "Додай інструмент для оренди на ToolNext. Просте створення оголошення, керування орендою та стабільний дохід від твого обладнання.",
    url: "https://tool-next-chi.vercel.app/tools/new",
    images: [
      {
        url: "https://res.cloudinary.com/ddln4hnns/image/upload/v1765352917/cover_kkf3m7.jpg",
      },
    ],
  },
};

export default async function HomePage() {
  const res = await fetchTools();
  const tools = res.tools;

  return (
    <>
      <Hero />
      <Benefits />
      <FeaturedToolsBlock tools={tools} />
      <FeedbacksBlock />
      <RegistrationBlock />
    </>
  );
}
