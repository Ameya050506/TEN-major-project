// Database storage keys simulating SQL tables
const STORAGE_KEYS = {
  QUESTIONS: "codejudge_questions",
  TESTS: "codejudge_tests",
  CANDIDATES: "codejudge_candidates",
  RESULTS: "codejudge_results",
  NOTIFICATIONS: "codejudge_notifications",
  AUTH_USER: "codejudge_auth_user",
};

import {
  INITIAL_QUESTIONS,
  INITIAL_TESTS,
  INITIAL_CANDIDATES,
  INITIAL_RESULTS,
  INITIAL_NOTIFICATIONS,
} from "./mock/mockData";

// Initialize mock database tables on first load
export const initLocalStorageDB = () => {
  if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TESTS)) {
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(INITIAL_TESTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CANDIDATES)) {
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(INITIAL_CANDIDATES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESULTS)) {
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(INITIAL_RESULTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
};

export const getCollection = (key) => {
  initLocalStorageDB();
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveCollection = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export { STORAGE_KEYS };