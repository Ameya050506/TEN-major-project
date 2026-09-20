import { getCollection, saveCollection, STORAGE_KEYS } from "./apiClient";

export const authService = {
  candidateLogin: async (email, password) => {
    // Simulated network latency
    await new Promise((resolve) => setTimeout(resolve, 300));
    const candidates = getCollection(STORAGE_KEYS.CANDIDATES);
    const candidate = candidates.find((c) => c.email.toLowerCase() === email.toLowerCase());

    if (!candidate) {
      throw new Error("Invalid candidate credentials");
    }

    const authPayload = { ...candidate, role: "candidate", token: "mock-candidate-jwt-token" };
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(authPayload));
    return authPayload;
  },

  adminLogin: async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Hardcoded production-like admin credential for development
    if (email === "admin@codejudge.io" && password === "admin123") {
      const adminPayload = {
        id: "admin-master",
        fullName: "System Administrator",
        email: "admin@codejudge.io",
        role: "admin",
        token: "mock-admin-jwt-token",
      };
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(adminPayload));
      return adminPayload;
    }
    throw new Error("Invalid admin credentials");
  },

  registerCandidate: async (candidateData) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const candidates = getCollection(STORAGE_KEYS.CANDIDATES);
    const existing = candidates.find((c) => c.email.toLowerCase() === candidateData.email.toLowerCase());

    if (existing) {
      throw new Error("An account with this email address already exists.");
    }

    const newCandidate = {
      id: `cand-${Date.now()}`,
      fullName: candidateData.fullName,
      email: candidateData.email,
      role: "candidate",
      organization: candidateData.organization || "Independent",
      designation: candidateData.designation || "Developer",
      phone: candidateData.phone || "",
      status: "Active",
      testsCompleted: 0,
      avgScore: 0,
      registeredAt: new Date().toISOString().split("T")[0],
    };

    candidates.push(newCandidate);
    saveCollection(STORAGE_KEYS.CANDIDATES, candidates);

    const authPayload = { ...newCandidate, token: "mock-candidate-jwt-token" };
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(authPayload));
    return authPayload;
  },

  getCurrentUser: () => {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return raw ? JSON.parse(raw) : null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  },
};