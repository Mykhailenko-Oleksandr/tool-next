import EditToolPage from "@/components/EditToolPage/EditToolPage";
import css from "./EditToolPageRoute.module.css";

export default function EditToolPageRoute() {
  return (
    <section className={css.pageSection}>
      <div className="container">
        <EditToolPage />
      </div>
    </section>
  );
}
