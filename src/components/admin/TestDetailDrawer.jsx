import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { testService } from "../../services/testService";
import { questionService } from "../../services/questionService";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { LoadingState } from "../common/LoadingState";
import { formatDate } from "../../utils/formatters";
import { X, Edit2, Eye, Clock, Award, HelpCircle } from "lucide-react";
import { CodeSnippetViewer } from "../assessment/CodeSnippetViewer";

export const TestDetailDrawer = ({ testId, onClose }) => {
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!testId) return;
    const load = async () => {
      setLoading(true);
      try {
        const found = await testService.getTestById(testId);
        setTest(found);
        const ids = found.questionIds || [];
        if (ids.length) {
          setQuestions(await questionService.getQuestionsByIds(ids));
        } else {
          setQuestions([]);
        }
      } catch {
        setTest(null);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [testId]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (testId) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [testId, onClose]);

  if (!testId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        aria-label="Close drawer"
        onClick={onClose}
      />
      <aside
        className="relative w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Assessment details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {loading ? (
            <LoadingState message="Loading..." />
          ) : !test ? (
            <p className="text-sm text-slate-500">Assessment not found.</p>
          ) : (
            <>
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="indigo">{test.category}</Badge>
                  <Badge
                    variant={
                      test.difficulty === "Easy"
                        ? "success"
                        : test.difficulty === "Medium"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {test.difficulty}
                  </Badge>
                  <Badge variant={test.status === "Active" ? "success" : "default"}>
                    {test.status}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{test.description}</p>
                <p className="text-[11px] text-slate-400 mt-2">ID: {test.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span>{test.durationMinutes} min</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>
                    {test.totalMarks} marks (pass {test.passingScore})
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 col-span-2">
                  <HelpCircle className="w-4 h-4 text-emerald-500" />
                  <span>{questions.length} questions</span>
                </div>
              </div>

              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <li>Negative marking: {test.negativeMarking ? "On" : "Off"}</li>
                <li>Shuffle questions: {test.randomizeQuestions ? "On" : "Off"}</li>
                <li>
                  Show results immediately: {test.showResultsImmediately ? "Yes" : "No"}
                </li>
                <li>Created: {formatDate(test.createdAt)}</li>
              </ul>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Question list
                </h4>
                {questions.length === 0 ? (
                  <p className="text-xs text-slate-400">No questions linked.</p>
                ) : (
                  <ol className="space-y-3 list-decimal list-inside text-xs">
                    {questions.map((q) => (
                      <li key={q.id} className="text-slate-800 dark:text-slate-200">
                        <span className="font-medium">{q.text}</span>
                        <span className="text-slate-400 ml-1">(+{q.marks} marks)</span>
                        {q.codeSnippet && (
                          <div className="mt-2 ml-4">
                            <CodeSnippetViewer code={q.codeSnippet} />
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </>
          )}
        </div>

        {test && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
            <Link to={`/admin/tests/${test.id}/preview`} className="flex-1 min-w-[120px]">
              <Button variant="secondary" className="w-full" icon={Eye}>
                Preview
              </Button>
            </Link>
            <Link to={`/admin/tests/${test.id}/edit`} className="flex-1 min-w-[120px]">
              <Button variant="primary" className="w-full" icon={Edit2}>
                Edit
              </Button>
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
};
