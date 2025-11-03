// client/src/components/Pagination.jsx
import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null; // no need to show pagination

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={{ marginTop: "20px" }}>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            marginRight: "5px",
            padding: "5px 10px",
            fontWeight: currentPage === page ? "bold" : "normal",
          }}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
