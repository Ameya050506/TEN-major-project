import { getCollection, saveCollection, STORAGE_KEYS } from "./apiClient";
import { setDataSourceMode } from "./dataSource";
import { normalizeCandidate } from "./apiNormalize";

const API_URL = "/api/candidates";

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

export const candidateService = {
  getAllCandidates: async () => {
    try {
      const data = await apiFetch(API_URL);
      setDataSourceMode("api");
      return data.map(normalizeCandidate);
    } catch {
      setDataSourceMode("local");
      return getCollection(STORAGE_KEYS.CANDIDATES).map(normalizeCandidate);
    }
  },

  getCandidateById: async (id) => {
    try {
      const data = await apiFetch(`${API_URL}/${id}`);
      setDataSourceMode("api");
      return normalizeCandidate(data);
    } catch {
      setDataSourceMode("local");
      const candidate = getCollection(STORAGE_KEYS.CANDIDATES).find((c) => c.id === id);
      if (!candidate) throw new Error("Candidate not found");
      return normalizeCandidate(candidate);
    }
  },

  updateCandidateStatus: async (id, status) => {
    try {
      const existing = await apiFetch(`${API_URL}/${id}`);
      const updated = await apiFetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...existing, status }),
      });
      setDataSourceMode("api");
      return normalizeCandidate(updated);
    } catch {
      const candidates = getCollection(STORAGE_KEYS.CANDIDATES);
      const index = candidates.findIndex((c) => c.id === id);
      if (index === -1) throw new Error("Candidate not found");
      candidates[index].status = status;
      saveCollection(STORAGE_KEYS.CANDIDATES, candidates);
      setDataSourceMode("local");
      return normalizeCandidate(candidates[index]);
    }
  },
};
