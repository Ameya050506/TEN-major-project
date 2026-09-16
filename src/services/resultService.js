import { getCollection, saveCollection, STORAGE_KEYS } from "./apiClient";

export const resultService = {
  getAllResults: async () => {
    await new Promise((r) => setTimeout(r, 150));
    return getCollection(STORAGE_KEYS.RESULTS);
  },

  getResultById: async (id) => {
    await new Promise((r) => setTimeout(r, 100));
    const results = getCollection(STORAGE_KEYS.RESULTS);
    const result = results.find((r) => r.id === id);
    if (!result) throw new Error("Result record not found");
    return result;
  },

  getResultsByCandidateId: async (candidateId) => {
    await new Promise((r) => setTimeout(r, 150));
    const results = getCollection(STORAGE_KEYS.RESULTS);
    return results.filter((r) => r.candidateId === candidateId);
  },

  submitAssessment: async ({ candidate, test, answers, timeTakenSeconds }) => {
    await new Promise((r) => setTimeout(r, 300));
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

    // Update candidate stats
    const candidates = getCollection(STORAGE_KEYS.CANDIDATES);
    const candIndex = candidates.findIndex((c) => c.id === candidate.id);
    if (candIndex !== -1) {
      candidates[candIndex].testsCompleted = (candidates[candIndex].testsCompleted || 0) + 1;
      saveCollection(STORAGE_KEYS.CANDIDATES, candidates);
    }

    return newResult;
  },
};