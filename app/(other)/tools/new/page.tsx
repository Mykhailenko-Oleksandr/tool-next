import AddEditToolForm from "@/components/AddEditToolForm/AddEditToolForm";
import css from "./AddToolPage.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Створення нового інструмента",
  description:
    "Створіть та опублікуйте нове оголошення для оренди вашого інструмента",
  openGraph: {
    title: "Створення нового інструмента на ToolNext",
    description:
      "Створіть та опублікуйте нове оголошення для оренди вашого інструмента на ToolNext. Почніть отримувати пасивний дохід.",
    url: "https://tool-next-chi.vercel.app/tools/new",
    images: [
      {
        url: "https://res.cloudinary.com/ddln4hnns/image/upload/v1765352917/cover_kkf3m7.jpg",
      },
    ],
  },
};

export default function AddToolPage() {
  return (
    <section className={css.pageSection}>
      <div className="container">
        <AddEditToolForm />
      </div>
    </section>
  );
}
