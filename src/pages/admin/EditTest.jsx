import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { testService } from "../../services/testService";
import { questionService } from "../../services/questionService";
import { useNotification } from "../../context/NotificationContext";
import { validateTestForm } from "../../utils/testValidation";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { LoadingState } from "../../components/common/LoadingState";
import { EmptyState } from "../../components/common/EmptyState";
import { ArrowLeft, Save, Check, FileCode } from "lucide-react";

export const EditTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [test, setTest] = useState(null);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [found, questions] = await Promise.all([
          testService.getTestById(id),
          questionService.getAllQuestions(),
        ]);
        setTest(found);
        setSelectedQuestionIds(found.questionIds || []);
        setAvailableQuestions(questions);
      } catch (err) {
        showToast("Assessment not found", "error");
        navigate("/admin/tests");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate, showToast]);

  const selectedQuestions = availableQuestions.filter((q) =>
    selectedQuestionIds.includes(q.id)
  );
  const computedTotalMarks = selectedQuestions.reduce(
    (acc, q) => acc + (q.marks || 4),
    0
  );

  const toggleQuestionSelection = (questionId) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((qId) => qId !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateTestForm({
      title: test.title,
      durationMinutes: test.durationMinutes,
      passingScore: test.passingScore,
      totalMarks: computedTotalMarks,
      selectedQuestionIds,
    });
    if (errors.length) {
      showToast(errors[0], "error");
      return;
    }

    setIsSaving(true);
    try {
      await testService.updateTest(id, {
        title: test.title,
        description: test.description,
        category: test.category,
        difficulty: test.difficulty,
        durationMinutes: Number(test.durationMinutes),
        totalMarks: computedTotalMarks,
        passingScore: Number(test.passingScore),
        negativeMarking: test.negativeMarking,
        randomizeQuestions: test.randomizeQuestions,
        showResultsImmediately: test.showResultsImmediately,
        status: test.status,
        questionIds: selectedQuestionIds,
      });
      showToast("Assessment updated successfully", "success");
      navigate("/admin/tests");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingState message="Loading assessment data..." />;
  if (!test) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/tests")}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Edit Assessment
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">ID: {test.id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <Input
            label="Assessment Title"
            value={test.title}
            onChange={(e) => setTest({ ...test, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={test.description || ""}
              onChange={(e) => setTest({ ...test, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              options={[
                { value: "Java", label: "Java" },
                { value: "SQL", label: "SQL" },
                { value: "OOP", label: "OOP" },
                { value: "Data Structures", label: "Data Structures" },
                { value: "DBMS", label: "DBMS" },
                { value: "Aptitude", label: "Aptitude" },
              ]}
              value={test.category}
              onChange={(e) => setTest({ ...test, category: e.target.value })}
            />

            <Select
              label="Difficulty"
              options={[
                { value: "Easy", label: "Easy" },
                { value: "Medium", label: "Medium" },
                { value: "Hard", label: "Hard" },
              ]}
              value={test.difficulty}
              onChange={(e) => setTest({ ...test, difficulty: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Duration (Minutes)"
              type="number"
              min="1"
              value={test.durationMinutes}
              onChange={(e) => setTest({ ...test, durationMinutes: e.target.value })}
              required
            />
            <Input
              label="Passing Marks"
              type="number"
              min="1"
              value={test.passingScore}
              onChange={(e) => setTest({ ...test, passingScore: e.target.value })}
              required
            />
            <Input
              label="Total Marks (computed)"
              type="number"
              value={computedTotalMarks}
              readOnly
              disabled
            />
          </div>

          <Select
            label="Status"
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
            value={test.status}
            onChange={(e) => setTest({ ...test, status: e.target.value })}
          />
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Questions ({selectedQuestionIds.length} selected)
            </h3>
            <Badge variant="indigo">{availableQuestions.length} in bank</Badge>
          </div>

          {availableQuestions.length === 0 ? (
            <EmptyState
              icon={FileCode}
              title="Question bank is empty"
              description="Add questions before assigning them to this assessment."
              actionLabel="Open Question Bank"
              onAction={() => navigate("/admin/questions")}
            />
          ) : (
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 pr-1">
              {availableQuestions.map((q) => {
                const isSelected = selectedQuestionIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => toggleQuestionSelection(q.id)}
                    className={`py-3 px-3 rounded-xl cursor-pointer flex items-start justify-between gap-3 transition-colors ${
                      isSelected
                        ? "bg-indigo-50/70 dark:bg-indigo-950/40"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="indigo">{q.category}</Badge>
                        <span className="text-[11px] text-slate-400">+{q.marks} Marks</span>
                      </div>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                        {q.text}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-1 ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" icon={Save} isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
