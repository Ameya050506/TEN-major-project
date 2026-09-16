import { getCollection, saveCollection, STORAGE_KEYS } from "./apiClient";

export const testService = {
  getAllTests: async () => {
    await new Promise((r) => setTimeout(r, 200));
    return getCollection(STORAGE_KEYS.TESTS);
  },

  getTestById: async (id) => {
    await new Promise((r) => setTimeout(r, 150));
    const tests = getCollection(STORAGE_KEYS.TESTS);
    const test = tests.find((t) => t.id === id);
    if (!test) throw new Error("Assessment not found");
    return test;
  },

  createTest: async (testData) => {
    await new Promise((r) => setTimeout(r, 300));
    const tests = getCollection(STORAGE_KEYS.TESTS);
    const newTest = {
      ...testData,
      id: `test-${Date.now()}`,
      totalAttempts: 0,
      createdAt: new Date().toISOString().split("T")[0],
      status: testData.status || "Active",
    };
    tests.unshift(newTest);
    saveCollection(STORAGE_KEYS.TESTS, tests);
    return newTest;
  },

  updateTest: async (id, updatedFields) => {
    await new Promise((r) => setTimeout(r, 250));
    const tests = getCollection(STORAGE_KEYS.TESTS);
    const index = tests.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Assessment not found");

    tests[index] = { ...tests[index], ...updatedFields };
    saveCollection(STORAGE_KEYS.TESTS, tests);
    return tests[index];
  },

  deleteTest: async (id) => {
    await new Promise((r) => setTimeout(r, 200));
    const tests = getCollection(STORAGE_KEYS.TESTS);
    const filtered = tests.filter((t) => t.id !== id);
    saveCollection(STORAGE_KEYS.TESTS, filtered);
    return true;
  },
};