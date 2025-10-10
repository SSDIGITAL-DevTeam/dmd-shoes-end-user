import clsx from "clsx";
import { lato } from "@/config/font";

type PaginationLabels = {
  prev?: string;
  next?: string;
};

type ProductPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  labels?: PaginationLabels;
  className?: string;
};

const clampPage = (page: number, total: number) =>
  Math.min(Math.max(page, 1), total);

const buildSequence = (current: number, total: number): (number | "ellipsis")[] => {
  if (total <= 6) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) {
    pages.push("ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < total - 1) {
    pages.push("ellipsis");
  }

  pages.push(total);

  return pages;
};

export default function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
  labels,
  className,
}: ProductPaginationProps) {
  const safeTotalPages = totalPages > 0 ? totalPages : 1;
  const current = clampPage(currentPage, safeTotalPages);
  const pages = buildSequence(current, safeTotalPages);
  const prevLabel = labels?.prev ?? "Sebelumnya";
  const nextLabel = labels?.next ?? "Selanjutnya";

  const goTo = (target: number) => {
    const page = clampPage(target, safeTotalPages);
    if (page !== current) {
      onPageChange(page);
    }
  };

  return (
    <nav
      className={clsx(
        "mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-primary lg:justify-end",
        className,
      )}
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => goTo(current - 1)}
        className="flex items-center gap-1 text-primary transition hover:underline disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:no-underline"
        disabled={current === 1}
      >
        <span aria-hidden="true">‹</span>
        {prevLabel}
      </button>

      <ul className={clsx(lato.className, "flex items-center gap-3 text-base")}>
        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <li key={`ellipsis-${index}`} className="text-gray-400">
              &hellip;
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                onClick={() => goTo(item)}
                className={clsx(
                  "transition",
                  item === current
                    ? "font-semibold underline underline-offset-4"
                    : "text-[#6B7280] hover:text-primary hover:underline",
                )}
                aria-current={item === current ? "page" : undefined}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        onClick={() => goTo(current + 1)}
        className="flex items-center gap-1 text-primary transition hover:underline disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:no-underline"
        disabled={current === safeTotalPages}
      >
        {nextLabel}
        <span aria-hidden="true">›</span>
      </button>
    </nav>
  );
}
