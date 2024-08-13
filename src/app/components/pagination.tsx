import React from "react";

interface PaginationProps {
  totalPosts: number;
  postsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPosts,
  postsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const maxPageLinks = 10; // Maximum number of page links to display
  const maxPageLinksHalf = Math.floor(maxPageLinks / 5);

  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > maxPageLinks) {
    if (currentPage <= maxPageLinksHalf) {
      endPage = maxPageLinks;
    } else if (currentPage >= totalPages - maxPageLinksHalf) {
      startPage = totalPages - maxPageLinks + 1;
    } else {
      startPage = currentPage - maxPageLinksHalf;
      endPage = currentPage + maxPageLinksHalf;
    }
  }

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className=" flex flex-wrap gap-2">
      {currentPage !== 1 && (
        <button className="btn btn-minimal" onClick={handlePreviousPage}>
          Previous
        </button>
      )}

      {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
        const page = startPage + index;
        return (
          <button
            key={page}
            className={`btn ${
              page === currentPage ? "btn-primary" : "btn-minimal"
            }`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        );
      })}

      {currentPage !== totalPages && (
        <button className="btn btn-minimal" onClick={handleNextPage}>
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;





