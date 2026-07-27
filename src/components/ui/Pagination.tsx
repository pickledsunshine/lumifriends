"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  pageCount,
  rowsPerPage,
  rowsPerPageOptions,
  onPageChange,
  onRowsPerPageChange,
}: {
  page: number;
  pageCount: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <div className="flex flex-wrap items-center justify-end gap-4">
      <label className="flex items-center gap-2 text-sm text-muted">
        Rows per page
        <select
          value={rowsPerPage}
          onChange={(event) => onRowsPerPageChange(Number(event.target.value))}
          className="min-h-9 rounded-control border border-line bg-surface px-2 py-1 text-sm font-semibold text-heading"
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="inline-flex size-9 items-center justify-center rounded-control border border-line text-body transition-colors hover:bg-page disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronLeft aria-hidden className="size-4" />
        </button>

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            aria-current={pageNumber === page ? "page" : undefined}
            aria-label={`Page ${pageNumber}`}
            className={`inline-flex size-9 items-center justify-center rounded-control text-sm font-bold transition-colors ${
              pageNumber === page
                ? "bg-brand text-white"
                : "border border-line text-body hover:bg-page"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
          className="inline-flex size-9 items-center justify-center rounded-control border border-line text-body transition-colors hover:bg-page disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronRight aria-hidden className="size-4" />
        </button>
      </nav>
    </div>
  );
}
