import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { resultService } from "../../services/resultService";
import { questionService } from "../../services/questionService";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { ProgressBar } from "../../components/common/ProgressBar";
import { LoadingState } from "../../components/common/LoadingState";
import { CodeSnippetViewer } from "../../components/assessment/CodeSnippetViewer";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  Award,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { formatDuration } from "../../utils/formatters";

export const TestResult = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResult = async () => {
      try {
        const foundResult = await resultService.getResultById(id);
        setResult(foundResult);
        const questionIds = Object.keys(foundResult.answers || {});
        const qs = await questionService.getQuestionsByIds(questionIds);
        setQuestions(qs);
      } catch (err) {
        console.error("Result fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadResult();
  }, [id]);

  if (loading) return <LoadingState message="Compiling assessment evaluation..." />;
  if (!result) return <div className="p-8 text-center">Result record not found.</div>;

  const isPassed = result.status === "PASSED";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Hero Outcome Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md text-center">
        <div
          className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 ${
            isPassed
              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 border border-emerald-200 dark:border-emerald-800"
              : "bg-rose-50 dark:bg-rose-950/60 text-rose-500 border border-rose-200 dark:border-rose-800"
          }`}
        >
          {isPassed ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
        </div>

        <Badge variant={isPassed ? "success" : "danger"} className="text-sm px-3 py-1">
          {result.status}
        </Badge>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 mt-3">
          {result.percentage}%
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Score: {result.score} / {result.totalMarks} Total Marks
        </p>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-left">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Time Taken
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-1">
              <Clock className="w-4 h-4 text-indigo-500" />
              {formatDuration(result.timeTakenSeconds)}
            </span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Cohort Rank
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-1">
              <Trophy className="w-4 h-4 text-amber-500" /> #{result.rank || 1}
            </span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Correct Qs
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-4 h-4" /> {result.correctCount || 0}
            </span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Incorrect Qs
            </span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mt-1">
              <XCircle className="w-4 h-4" /> {result.incorrectCount || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {result.categoryBreakdown && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" /> Category Performance
          </h3>
          <div className="space-y-3">
            {Object.entries(result.categoryBreakdown).map(([cat, pct]) => (
              <ProgressBar
                key={cat}
                label={cat}
                progress={pct}
                max={100}
                color={pct >= 70 ? "emerald" : pct >= 40 ? "amber" : "rose"}
              />
            ))}
          </div>
        </div>
      )}

      {/* Detailed Question Review */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Question-by-Question Review
        </h3>
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const candidateAnswerId = result.answers[q.id];
            const isCorrect = candidateAnswerId === q.correctOptionId;
            const candidateOption = q.options.find((o) => o.id === candidateAnswerId);
            const correctOption = q.options.find((o) => o.id === q.correctOptionId);

            return (
              <div
                key={q.id}
                className={`p-6 rounded-2xl border bg-white dark:bg-slate-900 ${
                  isCorrect
                    ? "border-emerald-200 dark:border-emerald-800/50"
                    : "border-rose-200 dark:border-rose-800/50"
                }`}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Question {idx + 1}
                  </span>
                  <Badge variant={isCorrect ? "success" : "danger"}>
                    {isCorrect ? "Correct (+4)" : "Incorrect"}
                  </Badge>
                </div>

                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {q.text}
                </p>

                {q.codeSnippet && (
                  <CodeSnippetViewer code={q.codeSnippet} language={q.category.toLowerCase()} />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
                  <div
                    className={`p-3 rounded-xl border ${
                      isCorrect
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-800 dark:text-emerald-300"
                        : "bg-rose-50 dark:bg-rose-950/30 border-rose-300 text-rose-800 dark:text-rose-300"
                    }`}
                  >
                    <span className="block font-semibold mb-0.5">Your Selected Answer:</span>
                    <span>{candidateOption ? candidateOption.text : "Unanswered"}</span>
                  </div>

                  <div className="p-3 rounded-xl border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 text-emerald-800 dark:text-emerald-300">
                    <span className="block font-semibold mb-0.5">Correct Answer:</span>
                    <span>{correctOption?.text}</span>
                  </div>
                </div>

                {q.explanation && (
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                      Technical Explanation:
                    </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
        <Link to="/candidate/dashboard">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
        <Link to="/candidate/leaderboard">
          <Button variant="primary" icon={ArrowRight}>
            View Leaderboard
          </Button>
        </Link>
      </div>
    </div>
  );
};