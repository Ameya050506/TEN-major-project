import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { testService } from "../../services/testService";
import { questionService } from "../../services/questionService";
import { useNotification } from "../../context/NotificationContext";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { LoadingState } from "../../components/common/LoadingState";
import { validateTestForm } from "../../utils/testValidation";
import { EmptyState } from "../../components/common/EmptyState";
import { Plus, Check, ArrowLeft, Layers, Clock, Award, FileCode } from "lucide-react";

export const CreateTest = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Java",
    difficulty: "Medium",
    description: "",
    durationMinutes: 30,
    passingScore: 16,
    negativeMarking: true,
    randomizeQuestions: true,
    showResultsImmediately: true,
    status: "Active",
    selectedQuestionIds: [],
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const qs = await questionService.getAllQuestions();
        setAvailableQuestions(qs);
        // Pre-select first 3 questions by default
        setFormData((prev) => ({
          ...prev,
          selectedQuestionIds: qs.slice(0, 3).map((q) => q.id),
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const toggleQuestionSelection = (id) => {
    setFormData((prev) => {
      const exists = prev.selectedQuestionIds.includes(id);
      return {
        ...prev,
        selectedQuestionIds: exists
          ? prev.selectedQuestionIds.filter((qId) => qId !== id)
          : [...prev.selectedQuestionIds, id],
      };
    });
  };

  const selectedQuestions = availableQuestions.filter((q) =>
    formData.selectedQuestionIds.includes(q.id)
  );
  const computedTotalMarks = selectedQuestions.reduce((acc, q) => acc + (q.marks || 4), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateTestForm({
      title: formData.title,
      durationMinutes: formData.durationMinutes,
      passingScore: formData.passingScore,
      totalMarks: computedTotalMarks,
      selectedQuestionIds: formData.selectedQuestionIds,
    });
    if (errors.length) {
      showToast(errors[0], "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await testService.createTest({
        title: formData.title,
        category: formData.category,
        difficulty: formData.difficulty,
        description: formData.description,
        durationMinutes: Number(formData.durationMinutes),
        totalMarks: computedTotalMarks,
        passingScore: Number(formData.passingScore),
        negativeMarking: formData.negativeMarking,
        randomizeQuestions: formData.randomizeQuestions,
        showResultsImmediately: formData.showResultsImmediately,
        status: formData.status,
        questionIds: formData.selectedQuestionIds,
      });

      showToast("Assessment created and published successfully", "success");
      navigate("/admin/tests");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Initializing question catalog..." />;

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
            Create Technical Assessment
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure test duration, passing criteria, and select questions from the bank
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Test Parameters */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              General Information
            </h3>

            <Input
              label="Assessment Title"
              placeholder="e.g. Core Java & Collections Benchmark"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Description / Objectives
              </label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Details on what candidate knowledge is being evaluated..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />

              <Select
                label="Difficulty Level"
                options={[
                  { value: "Easy", label: "Easy" },
                  { value: "Medium", label: "Medium" },
                  { value: "Hard", label: "Hard" },
                ]}
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Duration (Minutes)"
                type="number"
                min="5"
                max="180"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                required
              />

              <Input
                label="Passing Score (Marks)"
                type="number"
                min="1"
                value={formData.passingScore}
                onChange={(e) => setFormData({ ...formData, passingScore: e.target.value })}
                required
              />
            </div>

            <div className="pt-2 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.negativeMarking}
                  onChange={(e) => setFormData({ ...formData, negativeMarking: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  Enable Negative Marking for incorrect answers (-1 mark)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.randomizeQuestions}
                  onChange={(e) => setFormData({ ...formData, randomizeQuestions: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  Shuffle Question Order for Each Candidate
                </span>
              </label>
            </div>
          </div>

          {/* Question Selector List */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Select Questions from Bank ({formData.selectedQuestionIds.length} Selected)
              </h3>
              <Badge variant="indigo">{availableQuestions.length} in Bank</Badge>
            </div>

            {availableQuestions.length === 0 ? (
              <EmptyState
                icon={FileCode}
                title="Question bank is empty"
                description="Create questions in the bank before publishing an assessment."
                actionLabel="Open Question Bank"
                onAction={() => navigate("/admin/questions")}
              />
            ) : (
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 pr-1">
              {availableQuestions.map((q) => {
                const isSelected = formData.selectedQuestionIds.includes(q.id);
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
                        <Badge variant={q.difficulty === "Easy" ? "success" : q.difficulty === "Medium" ? "warning" : "danger"}>
                          {q.difficulty}
                        </Badge>
                        <span className="text-[11px] text-slate-400">+{q.marks} Marks</span>
                      </div>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                        {q.text}
                      </p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-1 transition-colors ${
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
          </div>
        </div>

        {/* Right Sticky Summary Sidebar */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm sticky top-24 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Live Test Summary
            </h3>

            <div className="space-y-3 text-xs border-y border-slate-100 dark:border-slate-800 py-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Selected Questions</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formData.selectedQuestionIds.length} Items
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Marks</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {computedTotalMarks} Marks
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Passing Threshold</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formData.passingScore} Marks
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Duration</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formData.durationMinutes} Minutes
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isSubmitting}
              icon={Plus}
            >
              Publish Assessment
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};