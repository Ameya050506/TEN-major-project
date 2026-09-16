import { getCollection, saveCollection, STORAGE_KEYS } from "./apiClient";

export const questionService = {
  getAllQuestions: async () => {
    await new Promise((r) => setTimeout(r, 150));
    return getCollection(STORAGE_KEYS.QUESTIONS);
  },

  getQuestionsByIds: async (ids) => {
    await new Promise((r) => setTimeout(r, 150));
    const questions = getCollection(STORAGE_KEYS.QUESTIONS);
    return questions.filter((q) => ids.includes(q.id));
  },

  createQuestion: async (questionData) => {
    await new Promise((r) => setTimeout(r, 250));
    const questions = getCollection(STORAGE_KEYS.QUESTIONS);
    const newQuestion = {
      ...questionData,
      id: `q-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    questions.unshift(newQuestion);
    saveCollection(STORAGE_KEYS.QUESTIONS, questions);
    return newQuestion;
  },

  updateQuestion: async (id, updatedFields) => {
    await new Promise((r) => setTimeout(r, 200));
    const questions = getCollection(STORAGE_KEYS.QUESTIONS);
    const index = questions.findIndex((q) => q.id === id);
    if (index === -1) throw new Error("Question not found");

    questions[index] = { ...questions[index], ...updatedFields };
    saveCollection(STORAGE_KEYS.QUESTIONS, questions);
    return questions[index];
  },

  deleteQuestion: async (id) => {
    await new Promise((r) => setTimeout(r, 150));
    const questions = getCollection(STORAGE_KEYS.QUESTIONS);
    const filtered = questions.filter((q) => q.id !== id);
    saveCollection(STORAGE_KEYS.QUESTIONS, filtered);
    return true;
  },
};