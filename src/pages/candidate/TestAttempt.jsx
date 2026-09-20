import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAssessment } from "../../context/AssessmentContext";
import { useAuth } from "../../context/AuthContext";
import { Timer } from "../../components/assessment/Timer";
import { QuestionNavigator } from "../../components/assessment/QuestionNavigator";
import { CodeSnippetViewer } from "../../components/assessment/CodeSnippetViewer";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { Badge } from "../../components/common/Badge";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Send,
  AlertCircle,
} from "lucide-react";

export const TestAttempt = () => {
  const {
    activeTest,
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    selectedAnswers,
    markedForReview,
    timeLeft,
    selectOption,
    clearAnswer,
    toggleMarkForReview,
    submitTest,
    isSubmitting,
  } = useAssessment();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    if (!activeTest) {
      navigate("/candidate/tests");
    }
  }, [activeTest, navigate]);

  if (!activeTest || !questions.length) return null;

  const currentQ = questions[currentQuestionIndex];
  const selectedOptionId = selectedAnswers[currentQ?.id];
  const isMarked = markedForReview.has(currentQ?.id);

  const answeredCount = Object.keys(selectedAnswers).length;
  const unansweredCount = questions.length - answeredCount;

  const handleFinalSubmit = async () => {
    const res = await submitTest(user);
    if (res?.id) {
      navigate(`/candidate/results/${res.id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950">
      {/* Top Fixed Examination Bar */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Active Assessment
          </span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
            {activeTest.title}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <Timer secondsLeft={timeLeft} />
          <Button
            variant="primary"
            size="sm"
            icon={Send}
            onClick={() => setShowSubmitModal(true)}
          >
            Submit Test
          </Button>
        </div>
      </header>

      {/* Main Examination Workspace */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Question Area */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm min-h-[550px]">
          <div>
            {/* Question Meta Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <Badge variant="indigo">{currentQ?.category}</Badge>
                <Badge variant="default">+{currentQ?.marks} Marks</Badge>
                {activeTest.negativeMarking && (
                  <Badge variant="danger">-{currentQ?.negativeMarks || 1} Neg</Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleMarkForReview(currentQ.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    isMarked
                      ? "bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-600 dark:text-amber-400"
                      : "border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isMarked ? "fill-amber-500" : ""}`} />
                  <span>{isMarked ? "Marked for Review" : "Mark for Review"}</span>
                </button>
                {selectedOptionId && (
                  <button
                    onClick={() => clearAnswer(currentQ.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-slate-500 hover:text-rose-500 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Clear
                  </button>
                )}
              </div>
            </div>

            {/* Question Prompt */}
            <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
              {currentQ?.text}
            </p>

            {/* Code Snippet (if applicable) */}
            {currentQ?.codeSnippet && (
              <CodeSnippetViewer
                code={currentQ.codeSnippet}
                language={currentQ.category.toLowerCase()}
              />
            )}

            {/* MCQ Options */}
            <div className="space-y-3 mt-6">
              {currentQ?.options?.map((opt, idx) => {
                const isSelected = selectedOptionId === opt.id;
                const letter = String.fromCharCode(65 + idx);

                return (
                  <label
                    key={opt.id}
                    onClick={() => selectOption(currentQ.id, opt.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-100 ring-1 ring-indigo-600"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900"
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-sm sm:text-base leading-relaxed flex-1">
                      {opt.text}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronLeft}
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            >
              Previous
            </Button>
            <span className="text-xs text-slate-400">
              {currentQuestionIndex + 1} of {questions.length}
            </span>
            <Button
              variant="primary"
              size="sm"
              disabled={currentQuestionIndex === questions.length - 1}
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Right Column: Question Navigator Sidebar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Question Palette
          </h3>
          <QuestionNavigator
            questions={questions}
            currentIndex={currentQuestionIndex}
            onSelectIndex={(idx) => setCurrentQuestionIndex(idx)}
            answers={selectedAnswers}
            markedForReview={markedForReview}
          />
        </div>
      </div>

      {/* Double Confirmation Submission Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Assessment?"
      >
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <p>
            Are you sure you want to finish and submit your assessment? Once submitted, answers cannot be edited.
          </p>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800 text-center">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
              <span className="block font-bold text-emerald-600 dark:text-emerald-400 text-base">
                {answeredCount}
              </span>
              <span className="text-[11px] text-slate-400">Answered</span>
            </div>
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <span className="block font-bold text-slate-700 dark:text-slate-300 text-base">
                {unansweredCount}
              </span>
              <span className="text-[11px] text-slate-400">Unanswered</span>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-lg">
              <span className="block font-bold text-amber-600 dark:text-amber-400 text-base">
                {markedForReview.size}
              </span>
              <span className="text-[11px] text-slate-400">Review</span>
            </div>
          </div>

          {unansweredCount > 0 && (
            <div className="flex items-center gap-2 text-rose-500 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>You still have {unansweredCount} unanswered questions!</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowSubmitModal(false)}
              disabled={isSubmitting}
            >
              Resume Test
            </Button>
            <Button
              variant="primary"
              onClick={handleFinalSubmit}
              isLoading={isSubmitting}
            >
              Confirm & Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};