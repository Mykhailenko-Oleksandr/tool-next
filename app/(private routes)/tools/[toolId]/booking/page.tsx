import { fetchToolById } from "@/lib/api/clientApi";
import { Metadata } from "next";
import css from "./BookingTool.module.css";

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

export default function BookingTool() {
  return (
    <section className={css.section}>
      <div className="container">
        <h2 className={css.title}>Підтвердження бронювання</h2>
      </div>
    </section>
  );
}
