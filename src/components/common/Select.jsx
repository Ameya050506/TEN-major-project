import React from "react";

export const Select = ({
  label,
  options = [],
  value,
  onChange,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error
            ? "border-rose-500"
            : "border-slate-300 dark:border-slate-700 focus:border-indigo-500"
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
};