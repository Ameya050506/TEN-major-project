export const validateTestForm = ({
  title,
  durationMinutes,
  passingScore,
  totalMarks,
  selectedQuestionIds,
}) => {
  const errors = [];

  if (!title?.trim()) {
    errors.push("Assessment title is required");
  }
  if (!selectedQuestionIds?.length) {
    errors.push("Select at least one question from the bank");
  }
  const duration = Number(durationMinutes);
  if (!Number.isFinite(duration) || duration <= 0) {
    errors.push("Duration must be greater than 0 minutes");
  }
  const passing = Number(passingScore);
  const total = Number(totalMarks);
  if (Number.isFinite(passing) && Number.isFinite(total) && passing > total) {
    errors.push("Passing score cannot exceed total marks");
  }

  return errors;
};
