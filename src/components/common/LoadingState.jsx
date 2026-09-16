import React from "react";

export const LoadingState = ({ message = "Loading data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-10 h-10 border-4 border-indigo-200 dark:border-indigo-950 border-t-indigo-600 rounded-full animate-spin" />
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 font-medium">{message}</p>
    </div>
  );
};