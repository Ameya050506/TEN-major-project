import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Mail, Lock, Code2, ArrowRight } from "lucide-react";

export const CandidateLogin = () => {
  const [email, setEmail] = useState("ameya.inamdar@vesit.edu.in");
  const [password, setPassword] = useState("candidate123");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { loginCandidate } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await loginCandidate(email, password);
      navigate("/candidate/dashboard");
    } catch (err) {
      setError(err.message || "Invalid login credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail("ameya.inamdar@vesit.edu.in");
    setPassword("candidate123");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <Code2 className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Candidate Sign In
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access your technical assessments, scores, and rankings
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Candidate Email"
            type="email"
            placeholder="candidate@example.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading} icon={ArrowRight}>
            Sign In to Assessment Portal
          </Button>

          {/* Quick Demo Pre-fill Button */}
          <button
            type="button"
            onClick={handleDemoFill}
            className="w-full py-2 border border-dashed border-indigo-300 dark:border-indigo-800/80 rounded-lg text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
          >
            Demo Autocomplete (Ameya Inamdar)
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
          Not registered yet?{" "}
          <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};