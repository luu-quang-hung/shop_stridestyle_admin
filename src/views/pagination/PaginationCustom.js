import React, { useState } from "react";
import { Pagination } from "react-bootstrap";


const PaginationCustom = ({ maxPageNumber = 0, total, perPage, onChange, currentPageP }) => {
    const [currentPage, setCurrentPage] = useState(currentPageP | 1);
    const generatePageNumbers = () => {
        const pageNumbers = [];

        let startPage = currentPage - Math.floor(maxPageNumber / 2);
        startPage = Math.max(startPage, 1);
        const endPage = startPage + maxPageNumber - 1;

        for (let i = startPage; i <= endPage && i <= total; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };
    function handlePageChange(pageNumber) {
        setCurrentPage(pageNumber);
        onChange(pageNumber);
    }
    return (
        <Pagination className="pagination-custom">
            <Pagination.First
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
            />
            <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            />

            {generatePageNumbers().map((pageNumber) => (
                <Pagination.Item
                    key={pageNumber}
                    active={pageNumber === currentPage}
                    onClick={() => handlePageChange(pageNumber)}
                >
                    {pageNumber}
                </Pagination.Item>
            ))}
            <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === total}
            />
            <Pagination.Last
                onClick={() => handlePageChange(total)}
                disabled={currentPage === total}
            />
        </Pagination>
    )
}

export default PaginationCustom;