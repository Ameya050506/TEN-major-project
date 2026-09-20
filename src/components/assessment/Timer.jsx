import React from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { formatDuration } from "../../utils/formatters";

export const Timer = ({ secondsLeft = 0, className = "" }) => {
  const isCritical = secondsLeft <= 300; // Under 5 mins
  const isUrgent = secondsLeft <= 60; // Under 1 min

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-semibold transition-colors ${
        isUrgent
          ? "bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse"
          : isCritical
          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
      } ${className}`}
    >
      {isCritical ? (
        <AlertTriangle className="w-4 h-4 animate-bounce text-inherit" />
      ) : (
        <Clock className="w-4 h-4 text-inherit" />
      )}
      <span className="tracking-wider text-base">{formatDuration(secondsLeft)}</span>
    </div>
  );
};