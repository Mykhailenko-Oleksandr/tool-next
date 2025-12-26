import EditToolPage from "@/components/EditToolPage/EditToolPage";
import css from "./EditToolPageRoute.module.css";
import { Metadata } from "next";

interface Props {
  params: Promise<{
    toolId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { toolId } = await params;

  return {
    title: "Редагування інструмента",
    description:
      "Сторінка редагування інформації про інструмент. Оновіть назву, опис, характеристики та зображення інструмента.",
    openGraph: {
      title: "Редагування інструмента — ToolNext",
      description:
        "Редагуйте інформацію про свій інструмент на ToolNext: опис, характеристики, фото та умови оренди.",
      url: `https://tool-next-chi.vercel.app/tools/edit/${toolId}`,
      images: [
        {
          url: "https://res.cloudinary.com/ddln4hnns/image/upload/v1765352917/cover_kkf3m7.jpg",
        },
      ],
    },
  };
}

export default function EditToolPageRoute() {
  return (
    <section className={css.pageSection}>
      <div className="container">
        <EditToolPage />
      </div>
    </section>
  );
}
