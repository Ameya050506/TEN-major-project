import { getCollection, STORAGE_KEYS } from "./apiClient";

export const leaderboardService = {
  getLeaderboard: async ({ testId, category } = {}) => {
    await new Promise((r) => setTimeout(r, 150));
    let results = getCollection(STORAGE_KEYS.RESULTS);

    if (testId && testId !== "ALL") {
      results = results.filter((r) => r.testId === testId);
    }
    if (category && category !== "ALL") {
      results = results.filter((r) => r.category === category);
    }

    // Sort by percentage descending, then by time taken ascending
    results.sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      return a.timeTakenSeconds - b.timeTakenSeconds;
    });

    return results.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  },
};