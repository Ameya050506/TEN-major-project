import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { FileQuestion, ArrowLeft } from "lucide-react";

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
        404 - Page Not Found
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
        The assessment or platform resource you requested does not exist or has been archived.
      </p>
      <div className="mt-6">
        <Link to="/">
          <Button variant="primary" icon={ArrowLeft}>
            Return to CodeJudge Home
          </Button>
        </Link>
      </div>
    </div>
  );
};