import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";
import type { Dispatch } from "react";

interface PaginationProps {
  totalPages: number;
  page: number;
  updatePage: Dispatch<React.SetStateAction<number>>;
}

export default function Pagination({
  totalPages,
  page,
  updatePage,
}: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => updatePage(selected + 1)}
      forcePage={page - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}
