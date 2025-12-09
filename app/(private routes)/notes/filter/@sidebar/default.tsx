import Link from "next/link";
import css from "./SidebarNotes.module.css";

const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function SidebarNotes() {
  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link href={`/notes/filter/All`} className={css.menuLink}>
          All
        </Link>
      </li>
      {tags.map((tag) => {
        return (
          <li className={css.menuItem} key={tag}>
            <Link
              href={`/notes/filter/${tag}`}
              className={css.menuLink}
              key={tag}
            >
              {tag}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
