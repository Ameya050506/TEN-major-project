import { getCollection, saveCollection, STORAGE_KEYS } from "./apiClient";

export const candidateService = {
  getAllCandidates: async () => {
    await new Promise((r) => setTimeout(r, 200));
    return getCollection(STORAGE_KEYS.CANDIDATES);
  },

  getCandidateById: async (id) => {
    await new Promise((r) => setTimeout(r, 150));
    const candidates = getCollection(STORAGE_KEYS.CANDIDATES);
    const candidate = candidates.find((c) => c.id === id);
    if (!candidate) throw new Error("Candidate not found");
    return candidate;
  },

  updateCandidateStatus: async (id, status) => {
    await new Promise((r) => setTimeout(r, 200));
    const candidates = getCollection(STORAGE_KEYS.CANDIDATES);
    const index = candidates.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Candidate not found");
    candidates[index].status = status;
    saveCollection(STORAGE_KEYS.CANDIDATES, candidates);
    return candidates[index];
  },
};