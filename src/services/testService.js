import { getCollection, saveCollection, STORAGE_KEYS } from "./apiClient";
import { setDataSourceMode } from "./dataSource";

const API_URL = "/api/tests";

const normalizeTest = (test) => ({
  ...test,
  questionIds:
    test.questionIds ||
    test.questions?.map((question) => question.id) ||
    [],
});

const toApiPayload = (test) => {
  const { questions, questionIds, ...rest } = test;
  return rest;
};

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

const localGetAll = () =>
  getCollection(STORAGE_KEYS.TESTS).map((t) => normalizeTest(t));

const localGetById = (id) => {
  const test = getCollection(STORAGE_KEYS.TESTS).find((t) => t.id === id);
  if (!test) throw new Error("Assessment not found");
  return normalizeTest(test);
};

const localSaveAll = (tests) => {
  saveCollection(STORAGE_KEYS.TESTS, tests);
};

export const testService = {
  getAllTests: async () => {
    try {
      const tests = await apiFetch(API_URL);
      setDataSourceMode("api");
      return tests.map(normalizeTest);
    } catch {
      setDataSourceMode("local");
      return localGetAll();
    }
  },

  getTestById: async (id) => {
    try {
      const test = await apiFetch(`${API_URL}/${id}`);
      setDataSourceMode("api");
      return normalizeTest(test);
    } catch {
      setDataSourceMode("local");
      return localGetById(id);
    }
  },

  attachQuestions: async (testId, questionIds) => {
    try {
      const test = await apiFetch(`${API_URL}/${testId}/questions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionIds),
      });
      setDataSourceMode("api");
      return normalizeTest(test);
    } catch {
      const tests = getCollection(STORAGE_KEYS.TESTS);
      const index = tests.findIndex((t) => t.id === testId);
      if (index === -1) throw new Error("Assessment not found");
      tests[index] = { ...tests[index], questionIds };
      localSaveAll(tests);
      setDataSourceMode("local");
      return normalizeTest(tests[index]);
    }
  },

  createTest: async (testData) => {
    const questionIds = testData.questionIds || [];
    const { questionIds: _q, questions: _qs, id: _id, ...fields } = testData;
    const payload = toApiPayload(fields);

    try {
      let created = normalizeTest(
        await apiFetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      );
      if (questionIds.length > 0) {
        created = await testService.attachQuestions(created.id, questionIds);
      }
      setDataSourceMode("api");
      return created;
    } catch {
      const tests = getCollection(STORAGE_KEYS.TESTS);
      const newTest = normalizeTest({
        ...payload,
        id: `test-${Date.now()}`,
        questionIds,
        totalAttempts: payload.totalAttempts ?? 0,
        createdAt: new Date().toISOString().split("T")[0],
        status: payload.status || "Active",
      });
      tests.push(newTest);
      localSaveAll(tests);
      setDataSourceMode("local");
      return newTest;
    }
  },

  updateTest: async (id, updatedFields) => {
    const questionIds = updatedFields.questionIds;

    try {
      const existing = await apiFetch(`${API_URL}/${id}`);
      const merged = {
        ...toApiPayload(existing),
        ...toApiPayload(updatedFields),
        id,
      };
      let result = normalizeTest(
        await apiFetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(merged),
        })
      );
      if (questionIds) {
        result = await testService.attachQuestions(id, questionIds);
      }
      setDataSourceMode("api");
      return result;
    } catch {
      const tests = getCollection(STORAGE_KEYS.TESTS);
      const index = tests.findIndex((t) => t.id === id);
      if (index === -1) throw new Error("Assessment not found");
      const merged = { ...tests[index], ...updatedFields };
      tests[index] = merged;
      localSaveAll(tests);
      setDataSourceMode("local");
      return normalizeTest(merged);
    }
  },

  deleteTest: async (id) => {
    try {
      await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
      setDataSourceMode("api");
      return true;
    } catch {
      const tests = getCollection(STORAGE_KEYS.TESTS).filter((t) => t.id !== id);
      if (tests.length === getCollection(STORAGE_KEYS.TESTS).length) {
        throw new Error("Assessment not found");
      }
      localSaveAll(tests);
      setDataSourceMode("local");
      return true;
    }
  },
};
