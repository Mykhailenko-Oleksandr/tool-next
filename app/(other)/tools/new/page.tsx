import AddEditToolForm from "@/components/AddEditToolForm/AddEditToolForm";
import css from "./AddToolPage.module.css";

export default function AddToolPage() {
  return (
    <section className={css.pageSection}>
      <div className="container">
        <AddEditToolForm />
      </div>
    </section>
  );
}
