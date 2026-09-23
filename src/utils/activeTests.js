/** Candidate-facing catalog: only published assessments. */
export const isActiveTest = (test) => test?.status === "Active";

export const filterActiveTests = (tests) =>
  (tests || []).filter(isActiveTest);
