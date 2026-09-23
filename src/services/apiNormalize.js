export const normalizeResult = (result) => {
  if (!result) return result;
  if (result.candidateName && result.testTitle) {
    return result;
  }
  const candidate = result.candidate || {};
  const test = result.test || {};
  return {
    ...result,
    candidateId: result.candidateId || candidate.id,
    candidateName: result.candidateName || candidate.fullName,
    candidateEmail: result.candidateEmail || candidate.email,
    testId: result.testId || test.id,
    testTitle: result.testTitle || test.title,
    category: result.category || test.category,
    percentage:
      result.percentage != null ? Math.round(Number(result.percentage)) : result.percentage,
    completedAt:
      typeof result.completedAt === "string"
        ? result.completedAt.split("T")[0]
        : result.completedAt,
  };
};

export const normalizeCandidate = (candidate) => ({
  ...candidate,
  testsCompleted: candidate.testsCompleted ?? 0,
  avgScore: candidate.avgScore ?? 0,
});
