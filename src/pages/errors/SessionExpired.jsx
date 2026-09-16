import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { Clock, ArrowRight } from "lucide-react";

export const SessionExpired = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
        <Clock className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
        Session Expired
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
        Your test or administrative session has timed out. Please sign in again to continue.
      </p>
      <div className="mt-6">
        <Link to="/login">
          <Button variant="primary" icon={ArrowRight}>
            Re-authenticate
          </Button>
        </Link>
      </div>
    </div>
  );
};