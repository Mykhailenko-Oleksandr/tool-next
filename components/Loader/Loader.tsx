import { BeatLoader } from "react-spinners";
import css from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={css.loader}>
      <BeatLoader color="#8808cc" size={12} />
    </div>
  );
}

