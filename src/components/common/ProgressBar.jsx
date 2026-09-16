import React from "react";

export const ProgressBar = ({
  progress = 0,
  max = 100,
  label,
  showPercentage = true,
  color = "indigo",
  height = "h-2",
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((progress / (max || 1)) * 100)));

  const colors = {
    indigo: "bg-indigo-600",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          {label && <span className="font-medium text-slate-600 dark:text-slate-300">{label}</span>}
          {showPercentage && (
            <span className="font-semibold text-slate-700 dark:text-slate-200">{percentage}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${colors[color] || colors.indigo} ${height} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};