import React from "react";
import { Check, Bookmark } from "lucide-react";

export const QuestionNavigator = ({
  questions = [],
  currentIndex,
  onSelectIndex,
  answers = {},
  markedForReview = new Set(),
}) => {
  const answeredCount = Object.keys(answers).length;
  const markedCount = markedForReview.size;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="flex flex-col gap-4">
      {/* Legend summary pills */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50">
          <span className="block font-bold text-emerald-600 dark:text-emerald-400 text-sm">
            {answeredCount}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">Answered</span>
        </div>
        <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50">
          <span className="block font-bold text-amber-600 dark:text-amber-400 text-sm">
            {markedCount}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">Review</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="block font-bold text-slate-700 dark:text-slate-300 text-sm">
            {unansweredCount}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">Unanswered</span>
        </div>
      </div>

      {/* Numerical grid */}
      <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1 py-1">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answers[q.id] !== undefined;
          const isMarked = markedForReview.has(q.id);

          let buttonStyle = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400";

          if (isMarked) {
            buttonStyle = "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-semibold";
          } else if (isAnswered) {
            buttonStyle = "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold";
          }

          if (isCurrent) {
            buttonStyle += " ring-2 ring-indigo-600 dark:ring-indigo-400 ring-offset-2 dark:ring-offset-slate-950";
          }

          return (
            <button
              key={q.id || idx}
              onClick={() => onSelectIndex(idx)}
              className={`relative h-10 w-full flex items-center justify-center rounded-lg border text-xs transition-all ${buttonStyle}`}
            >
              {idx + 1}
              {isAnswered && (
                <Check className="w-2.5 h-2.5 absolute top-1 right-1 text-emerald-600 dark:text-emerald-400" />
              )}
              {isMarked && (
                <Bookmark className="w-2.5 h-2.5 absolute bottom-1 right-1 fill-amber-500 text-amber-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};