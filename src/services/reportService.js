import { getCollection, STORAGE_KEYS } from "./apiClient";

export const reportService = {
  generateAnalyticsSummary: async () => {
    await new Promise((r) => setTimeout(r, 200));
    const tests = getCollection(STORAGE_KEYS.TESTS);
    const candidates = getCollection(STORAGE_KEYS.CANDIDATES);
    const results = getCollection(STORAGE_KEYS.RESULTS);
    const questions = getCollection(STORAGE_KEYS.QUESTIONS);

    const totalTests = tests.length;
    const activeTests = tests.filter((t) => t.status === "Active").length;
    const totalCandidates = candidates.length;
    const totalQuestions = questions.length;
    const testsCompleted = results.length;

    const avgScore = results.length
      ? Math.round(results.reduce((acc, curr) => acc + curr.percentage, 0) / results.length)
      : 0;

    const passedCount = results.filter((r) => r.status === "PASSED").length;
    const passRate = results.length ? Math.round((passedCount / results.length) * 100) : 0;

    return {
      totalTests,
      activeTests,
      totalCandidates,
      totalQuestions,
      testsCompleted,
      avgScore,
      passRate,
    };
  },
};