import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recovery Email Sent</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              If an account exists for <span className="font-semibold text-slate-700 dark:text-slate-200">{email}</span>, we have dispatched a password recovery token link.
            </p>
            <div className="mt-6">
              <Link to="/login">
                <Button variant="secondary" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Reset Password
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your registered candidate email address to receive reset instructions
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-4">
              <Input
                label="Registered Email"
                type="email"
                placeholder="name@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                Send Recovery Instructions
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};