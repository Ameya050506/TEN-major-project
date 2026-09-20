const API_URL = "/api/questions";

export const questionService = {
  getAllQuestions: async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    return await response.json();
  },

  getQuestionsByIds: async (ids) => {
    const response = await fetch(
      `${API_URL}?ids=${ids.join(",")}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    return await response.json();
  },

  createQuestion: async (questionData) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questionData),
    });

    if (!response.ok) {
      throw new Error("Failed to create question");
    }

    return await response.json();
  },

  updateQuestion: async (id, updatedFields) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFields),
    });

    if (!response.ok) {
      throw new Error("Failed to update question");
    }

    return await response.json();
  },

  deleteQuestion: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete question");
    }

    return true;
  },
};