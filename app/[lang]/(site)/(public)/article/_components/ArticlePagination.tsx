import { Fragment } from "react";

type ArticlePaginationProps = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
  dictionary: {
    prev: string;
    next: string;
  };
  disabled?: boolean;
};

const createPages = (current: number, total: number) => {
  const pages = new Set<number>();
  const add = (value: number) => {
    if (value >= 1 && value <= total) pages.add(value);
  };

  add(1);
  add(total);
  add(current - 1);
  add(current);
  add(current + 1);

  return Array.from(pages).sort((a, b) => a - b);
};

function ArticlePagination({ currentPage, totalPages, onChange, dictionary, disabled = false }: ArticlePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = createPages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-3 py-8 font-[Lato] text-[14px]">
      <button
        type="button"
        onClick={() => onChange(currentPage - 1)}
        disabled={disabled || currentPage <= 1}
        className="text-primary font-medium flex items-center gap-1 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        {dictionary.prev}
      </button>

      {pages.map((page, index) => {
        const previous = pages[index - 1];
        const showEllipsis = previous !== undefined && page - previous > 1;
        const isActive = page === currentPage;

        return (
          <Fragment key={page}>
            {showEllipsis ? <span className="text-primary font-medium">...</span> : null}
            <button
              type="button"
              onClick={() => onChange(page)}
              disabled={disabled || isActive}
              className={
                isActive
                  ? "text-primary font-medium underline underline-offset-4"
                  : "text-primary font-medium hover:underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-50"
              }
            >
              {page}
            </button>
          </Fragment>
        );
      })}

      <button
        type="button"
        onClick={() => onChange(currentPage + 1)}
        disabled={disabled || currentPage >= totalPages}
        className="text-primary font-medium flex items-center gap-1 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
      >
        {dictionary.next}
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

export default ArticlePagination;
