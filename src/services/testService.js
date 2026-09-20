const API_URL = "/api/tests";

const normalizeTest = (test) => ({
  ...test,
  questionIds:
    test.questionIds ||
    test.questions?.map((question) => question.id) ||
    [],
});

export const testService = {
  getAllTests: async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch tests");
    }

    const tests = await response.json();

    return tests.map(normalizeTest);
  },

  getTestById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error("Assessment not found");
    }

    const test = await response.json();

    return normalizeTest(test);
  },

  createTest: async (testData) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      throw new Error("Failed to create assessment");
    }

    return normalizeTest(await response.json());
  },

  updateTest: async (id, updatedFields) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFields),
    });

    if (!response.ok) {
      throw new Error("Failed to update assessment");
    }

    return normalizeTest(await response.json());
  },

  deleteTest: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete assessment");
    }

    return true;
  },
};