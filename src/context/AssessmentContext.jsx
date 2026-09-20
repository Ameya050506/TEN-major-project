import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { resultService } from "../services/resultService";
import { useNotification } from "./NotificationContext";

const AssessmentContext = createContext();

export const AssessmentProvider = ({ children }) => {
  const [activeTest, setActiveTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const timerRef = useRef(null);
  const warned10Min = useRef(false);
  const warned5Min = useRef(false);
  const warned1Min = useRef(false);

  const { showToast } = useNotification();

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleAutoSubmit = useCallback(async () => {
    if (isSubmitting) return;
    showToast("Time expired! Automatically submitting your assessment...", "warning");
    await submitTest();
  }, [isSubmitting]);

  // Assessment countdown ticker
  useEffect(() => {
    if (!activeTest || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }

        // Time threshold alerts
        if (prev === 600 && !warned10Min.current) {
          showToast("Warning: 10 minutes remaining in this assessment!", "warning");
          warned10Min.current = true;
        } else if (prev === 300 && !warned5Min.current) {
          showToast("Warning: 5 minutes remaining!", "warning");
          warned5Min.current = true;
        } else if (prev === 60 && !warned1Min.current) {
          showToast("Final Notice: 1 minute remaining!", "error");
          warned1Min.current = true;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [activeTest, handleAutoSubmit, showToast]);

  const startAssessment = (test, loadedQuestions) => {
    setActiveTest(test);
    setQuestions(loadedQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setMarkedForReview(new Set());
    setTimeLeft((test.durationMinutes || 30) * 60);
    setTestResult(null);

    warned10Min.current = false;
    warned5Min.current = false;
    warned1Min.current = false;
  };

  const selectOption = (questionId, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const clearAnswer = (questionId) => {
    setSelectedAnswers((prev) => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  };

  const toggleMarkForReview = (questionId) => {
    setMarkedForReview((prev) => {
      const updated = new Set(prev);
      if (updated.has(questionId)) {
        updated.delete(questionId);
      } else {
        updated.add(questionId);
      }
      return updated;
    });
  };

  const submitTest = async (candidateUser) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const totalSeconds = (activeTest.durationMinutes || 30) * 60;
    const timeTaken = Math.max(1, totalSeconds - timeLeft);

    try {
      const result = await resultService.submitAssessment({
        candidate: candidateUser || {
          id: "cand-001",
          fullName: "Ameya Inamdar",
          email: "ameya.inamdar@vesit.edu.in",
        },
        test: activeTest,
        answers: selectedAnswers,
        timeTakenSeconds: timeTaken,
      });

      setTestResult(result);
      setIsSubmitting(false);
      return result;
    } catch (err) {
      setIsSubmitting(false);
      showToast("Submission failed: " + err.message, "error");
      throw err;
    }
  };

  return (
    <AssessmentContext.Provider
      value={{
        activeTest,
        questions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        selectedAnswers,
        markedForReview,
        timeLeft,
        isSubmitting,
        testResult,
        startAssessment,
        selectOption,
        clearAnswer,
        toggleMarkForReview,
        submitTest,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => useContext(AssessmentContext);