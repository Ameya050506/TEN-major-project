import React from "react";

export const Card = ({ children, className = "", hover = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-all duration-200 ${
        hover
          ? "hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md cursor-pointer"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};