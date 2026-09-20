import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const Unauthorized = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
        403 - Access Denied
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
        You do not possess the administrative privileges required to access this console.
      </p>
      <div className="mt-6">
        <Link to="/login">
          <Button variant="primary" icon={ArrowLeft}>
            Return to Candidate Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
};