import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { ShieldAlert, Mail, Lock, ShieldCheck } from "lucide-react";

export const AdminLogin = () => {
  const [email, setEmail] = useState("admin@codejudge.io");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await loginAdmin(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Invalid administrative credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const fillAdminDefaults = () => {
    setEmail("admin@codejudge.io");
    setPassword("admin123");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600" />

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Administrative Console
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Restricted access for examiners, trainers, and administrators
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <Input
            label="Admin Identifier"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Secret Key / Password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading} icon={ShieldCheck}>
            Authorize Admin Session
          </Button>

          {/* Quick Demo Pre-fill */}
          <button
            type="button"
            onClick={fillAdminDefaults}
            className="w-full py-2 border border-dashed border-indigo-300 dark:border-indigo-800/80 rounded-lg text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
          >
            Autofill Default Admin (admin@codejudge.io)
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          Looking for the candidate test portal?{" "}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Candidate Login
          </Link>
        </div>
      </div>
    </div>
  );
};