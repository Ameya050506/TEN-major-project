import { getCollection, saveCollection, STORAGE_KEYS } from "./apiClient";
import { setDataSourceMode } from "./dataSource";
import { normalizeResult } from "./apiNormalize";

const API_URL = "/api/results";

const apiFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

const scoreAssessmentLocally = ({ candidate, test, answers, timeTakenSeconds }) => {
  const questions = getCollection(STORAGE_KEYS.QUESTIONS);
  const testQuestions = questions.filter((q) => test.questionIds.includes(q.id));

  let score = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  const categoryStats = {};

  testQuestions.forEach((q) => {
    const selected = answers[q.id];
    if (!categoryStats[q.category]) {
      categoryStats[q.category] = { totalMarks: 0, earnedMarks: 0 };
    }
    categoryStats[q.category].totalMarks += q.marks;

    if (!selected) {
      unansweredCount++;
    } else if (selected === q.correctOptionId) {
      correctCount++;
      score += q.marks;
      categoryStats[q.category].earnedMarks += q.marks;
    } else {
      incorrectCount++;
      if (test.negativeMarking) {
        score = Math.max(0, score - (q.negativeMarks || 1));
      }
    }
  });

  const percentage = Math.round((score / (test.totalMarks || 1)) * 100);
  const isPassed = score >= test.passingScore;

  const categoryBreakdown = {};
  Object.keys(categoryStats).forEach((cat) => {
    const { earnedMarks, totalMarks } = categoryStats[cat];
    categoryBreakdown[cat] = Math.round((earnedMarks / (totalMarks || 1)) * 100);
  });

  const results = getCollection(STORAGE_KEYS.RESULTS);
  const newResult = {
    id: `res-${Date.now()}`,
    candidateId: candidate.id,
    candidateName: candidate.fullName,
    candidateEmail: candidate.email,
    testId: test.id,
    testTitle: test.title,
    category: test.category,
    score,
    totalMarks: test.totalMarks,
    percentage,
    status: isPassed ? "PASSED" : "FAILED",
    correctCount,
    incorrectCount,
    unansweredCount,
    timeTakenSeconds,
    completedAt: new Date().toISOString().split("T")[0],
    rank: Math.floor(Math.random() * 5) + 1,
    answers,
    categoryBreakdown,
  };

  results.unshift(newResult);
  saveCollection(STORAGE_KEYS.RESULTS, results);

  const candidates = getCollection(STORAGE_KEYS.CANDIDATES);
  const candIndex = candidates.findIndex((c) => c.id === candidate.id);
  if (candIndex !== -1) {
    candidates[candIndex].testsCompleted = (candidates[candIndex].testsCompleted || 0) + 1;
    saveCollection(STORAGE_KEYS.CANDIDATES, candidates);
  }

  return newResult;
};

export const resultService = {
  getAllResults: async () => {
    try {
      const data = await apiFetch(API_URL);
      setDataSourceMode("api");
      return data.map(normalizeResult);
    } catch {
      setDataSourceMode("local");
      return getCollection(STORAGE_KEYS.RESULTS).map(normalizeResult);
    }
  },

  getResultById: async (id) => {
    try {
      const data = await apiFetch(`${API_URL}/${id}`);
      setDataSourceMode("api");
      return normalizeResult(data);
    } catch {
      setDataSourceMode("local");
      const result = getCollection(STORAGE_KEYS.RESULTS).find((r) => r.id === id);
      if (!result) throw new Error("Result record not found");
      return normalizeResult(result);
    }
  },

  getResultsByCandidateId: async (candidateId) => {
    try {
      const data = await apiFetch(`${API_URL}/candidate/${candidateId}`);
      setDataSourceMode("api");
      return data.map(normalizeResult);
    } catch {
      setDataSourceMode("local");
      return getCollection(STORAGE_KEYS.RESULTS)
        .filter((r) => r.candidateId === candidateId)
        .map(normalizeResult);
    }
  },

  getResultsByTestId: async (testId) => {
    try {
      const data = await apiFetch(`${API_URL}/test/${testId}`);
      setDataSourceMode("api");
      return data.map(normalizeResult);
    } catch {
      setDataSourceMode("local");
      return getCollection(STORAGE_KEYS.RESULTS)
        .filter((r) => r.testId === testId)
        .map(normalizeResult);
    }
  },

  submitAssessment: async ({ candidate, test, answers, timeTakenSeconds }) => {
    const answerPayload = Object.entries(answers || {}).map(([questionId, selectedOptionId]) => ({
      questionId,
      selectedOptionId: selectedOptionId || null,
    }));

    try {
      const data = await apiFetch(`${API_URL}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: candidate.id,
          testId: test.id,
          timeTakenSeconds,
          answers: answerPayload,
        }),
      });
      setDataSourceMode("api");
      return normalizeResult(data);
    } catch {
      setDataSourceMode("local");
      return scoreAssessmentLocally({ candidate, test, answers, timeTakenSeconds });
    }
  },
};
