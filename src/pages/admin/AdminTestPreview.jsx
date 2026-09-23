import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { testService } from "../../services/testService";
import { questionService } from "../../services/questionService";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { LoadingState } from "../../components/common/LoadingState";
import { CodeSnippetViewer } from "../../components/assessment/CodeSnippetViewer";
import {
  ArrowLeft,
  Clock,
  HelpCircle,
  Award,
  CheckCircle2,
  ShieldAlert,
  Eye,
} from "lucide-react";

export const AdminTestPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const found = await testService.getTestById(id);
        setTest(found);
        const ids = found.questionIds || [];
        setQuestions(ids.length ? await questionService.getQuestionsByIds(ids) : []);
      } catch {
        setTest(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <LoadingState message="Loading preview..." />;
  if (!test) {
    return (
      <div className="text-center py-12 text-sm text-slate-500">
        Assessment not found.{" "}
        <button type="button" className="text-indigo-600" onClick={() => navigate("/admin/tests")}>
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/tests")}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to assessments
        </button>
        <Badge variant="warning" className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" /> Admin preview — read only
        </Badge>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-3">
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

        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{test.title}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{test.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Duration</p>
              <p className="text-sm font-bold">{test.durationMinutes} min</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Questions</p>
              <p className="text-sm font-bold">{questions.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Total marks</p>
              <p className="text-sm font-bold">{test.totalMarks}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-rose-500" />
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Passing</p>
              <p className="text-sm font-bold">{test.passingScore}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <h3 className="text-base font-bold flex items-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5 text-indigo-500" />
          Rules (candidate view)
        </h3>
        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
          <li>Timer starts when candidate begins — auto-submit when time ends.</li>
          <li>
            Negative marking: {test.negativeMarking ? "enabled" : "disabled"}.
          </li>
          <li>
            Question order: {test.randomizeQuestions ? "shuffled per attempt" : "fixed"}.
          </li>
        </ul>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Questions ({questions.length})
        </h3>
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2"
          >
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="font-bold text-slate-400">Q{index + 1}</span>
              <Badge variant="indigo">{q.category}</Badge>
              <span className="text-slate-400">+{q.marks} marks</span>
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{q.text}</p>
            {q.codeSnippet && <CodeSnippetViewer code={q.codeSnippet} />}
            <ul className="text-xs text-slate-500 space-y-1 mt-2">
              {(q.options || []).map((opt) => (
                <li key={opt.id} className="pl-2">
                  • {opt.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 pb-8">
        <Link to={`/admin/tests/${id}/edit`}>
          <Button variant="primary">Edit assessment</Button>
        </Link>
      </div>
    </div>
  );
};
