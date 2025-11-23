interface PaginationProps {
  handleClickPrevPage: () => void;
  handleClickNextPage: () => void;
  page: number;
  totalPages: number;
}
const Pagination = (props: PaginationProps) => {
  const { page, handleClickNextPage, handleClickPrevPage, totalPages } = props;

  return (
    <div className="flex items-center gap-4 mt-4">
      <button
        onClick={handleClickPrevPage}
        disabled={page === 1}
        className="px-3 py-1.5 text-sm min-w-[80px] bg-primary hover:bg-primary-hover text-white disabled:bg-primary-disabled disabled:cursor-not-allowed"
      >
        前へ
      </button>

      <span>
        ページ {page} / {totalPages}
      </span>

      <button
        onClick={handleClickNextPage}
        disabled={page === totalPages}
        className="px-3 py-1.5 text-sm min-w-[80px] bg-primary hover:bg-primary-hover text-white disabled:bg-primary-disabled disabled:cursor-not-allowed"
      >
        次へ
      </button>
    </div>
  );
};

export default Pagination;
