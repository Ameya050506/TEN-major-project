import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
      <Link
        to="/"
        className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors flex items-center gap-1"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            {isLast || !item.to ? (
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};