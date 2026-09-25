import { resultService } from "./resultService";

export const leaderboardService = {
  getLeaderboard: async ({ testId, category } = {}) => {
    let results = await resultService.getAllResults();

    if (testId && testId !== "ALL") {
      results = results.filter((r) => r.testId === testId);
    }
    if (category && category !== "ALL") {
      results = results.filter((r) => r.category === category);
    }

    results.sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      return (a.timeTakenSeconds || 0) - (b.timeTakenSeconds || 0);
    });

    return results.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  },
};
