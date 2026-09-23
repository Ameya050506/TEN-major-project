import { getCollection, saveCollection, STORAGE_KEYS } from "./apiClient";
import { setDataSourceMode } from "./dataSource";

const API_URL = "/api/questions";

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

export const questionService = {
  getAllQuestions: async () => {
    try {
      const data = await apiFetch(API_URL);
      setDataSourceMode("api");
      return data;
    } catch {
      setDataSourceMode("local");
      return getCollection(STORAGE_KEYS.QUESTIONS);
    }
  },

  getQuestionsByIds: async (ids) => {
    if (!ids?.length) return [];
    try {
      const data = await apiFetch(`${API_URL}?ids=${ids.join(",")}`);
      setDataSourceMode("api");
      return data;
    } catch {
      setDataSourceMode("local");
      const all = getCollection(STORAGE_KEYS.QUESTIONS);
      return all.filter((q) => ids.includes(q.id));
    }
  },

  createQuestion: async (questionData) => {
    try {
      const data = await apiFetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionData),
      });
      setDataSourceMode("api");
      return data;
    } catch {
      const questions = getCollection(STORAGE_KEYS.QUESTIONS);
      const id = questionData.id || `q-${Date.now()}`;
      const newQuestion = { ...questionData, id };
      questions.push(newQuestion);
      saveCollection(STORAGE_KEYS.QUESTIONS, questions);
      setDataSourceMode("local");
      return newQuestion;
    }
  },

  updateQuestion: async (id, updatedFields) => {
    try {
      const data = await apiFetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      setDataSourceMode("api");
      return data;
    } catch {
      const questions = getCollection(STORAGE_KEYS.QUESTIONS);
      const index = questions.findIndex((q) => q.id === id);
      if (index === -1) throw new Error("Question not found");
      questions[index] = { ...questions[index], ...updatedFields };
      saveCollection(STORAGE_KEYS.QUESTIONS, questions);
      setDataSourceMode("local");
      return questions[index];
    }
  },

  deleteQuestion: async (id) => {
    try {
      await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
      setDataSourceMode("api");
      return true;
    } catch {
      const questions = getCollection(STORAGE_KEYS.QUESTIONS).filter((q) => q.id !== id);
      if (questions.length === getCollection(STORAGE_KEYS.QUESTIONS).length) {
        throw new Error("Question not found");
      }
      saveCollection(STORAGE_KEYS.QUESTIONS, questions);
      setDataSourceMode("local");
      return true;
    }
  },
};
