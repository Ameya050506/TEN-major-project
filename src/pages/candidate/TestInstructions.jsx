import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { testService } from "../../services/testService";
import { questionService } from "../../services/questionService";
import { useAssessment } from "../../context/AssessmentContext";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { LoadingState } from "../../components/common/LoadingState";
import { isActiveTest } from "../../utils/activeTests";
import {
  Clock,
  HelpCircle,
  Award,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

export const TestInstructions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startAssessment } = useAssessment();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const foundTest = await testService.getTestById(id);
        if (!isActiveTest(foundTest)) {
          setTest(null);
          return;
        }
        setTest(foundTest);
        const testQuestions = await questionService.getQuestionsByIds(foundTest.questionIds);
        setQuestions(testQuestions);
      } catch (err) {
        console.error("Instruction load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  if (loading) return <LoadingState message="Loading assessment parameters..." />;
  if (!test) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This assessment is not available. It may be inactive or removed.
        </p>
        <Link to="/candidate/tests">
          <Button variant="secondary">Back to assessments</Button>
        </Link>
      </div>
    );
  }

  const handleStart = () => {
    startAssessment(test, questions);
    navigate(`/candidate/tests/${test.id}/attempt`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Test Header */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="indigo">{test.category}</Badge>
          <Badge variant={test.difficulty === "Easy" ? "success" : test.difficulty === "Medium" ? "warning" : "danger"}>
            {test.difficulty}
          </Badge>
          <span className="text-xs text-slate-400">ID: {test.id}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          {test.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          {test.description}
        </p>

        {/* Vital stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Duration</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {test.durationMinutes} Minutes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Questions</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {questions.length} Items
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Marks</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {test.totalMarks} Marks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Passing Mark</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {test.passingScore} Marks
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rules and Guidelines */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Assessment Protocol & Regulations
        </h3>
        <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
            <span>
              <strong>Countdown Timer:</strong> The timer activates immediately when you press <em>Start Assessment</em>. The test will automatically submit upon countdown expiration.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
            <span>
              <strong>Continuous Auto-Save:</strong> Selected answers are saved in local session memory in real-time.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
            <span>
              <strong>Mark for Review:</strong> Flag ambiguous questions to quickly jump back to them via the Question Navigator palette.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
            <span>
              <strong>Negative Marking:</strong> {test.negativeMarking ? "Active. Incorrect answers will incur penalties according to question weight." : "Inactive. No marks deducted for wrong answers."}
            </span>
          </li>
        </ul>
      </div>

      {/* Start Button Area */}
      <div className="flex items-center justify-between">
        <Link to="/candidate/tests">
          <Button variant="secondary">Cancel & Return</Button>
        </Link>
        <Button variant="primary" size="lg" icon={ArrowRight} onClick={() => setShowConfirmModal(true)}>
          Proceed to Assessment
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="Begin Assessment?">
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2 text-amber-700 dark:text-amber-300">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Once started, the assessment cannot be paused. Ensure you have a stable environment.</span>
          </div>
          <p>
            You are initiating <strong>{test.title}</strong> with a time limit of <strong>{test.durationMinutes} minutes</strong>.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleStart}>
              Yes, Start Now
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};