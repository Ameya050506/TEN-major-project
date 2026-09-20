import React from "react";
import { Code2 } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-slate-100">
              Code<span className="text-indigo-600 dark:text-indigo-400">Judge</span>
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Standard developer assessment and interview platform designed for enterprise and academic technical screenings.
          </p>
        </div>
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
            Product
          </h5>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li>Assessment Engine</li>
            <li>Question Bank</li>
            <li>Automatic Evaluation</li>
            <li>Performance Analytics</li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
            Categories
          </h5>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li>Java & OOP</li>
            <li>SQL & Relational DBMS</li>
            <li>Data Structures & Algorithms</li>
            <li>Quantitative Aptitude</li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
            Legal & Support
          </h5>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li>Documentation</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Security Standard</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/60 text-center text-xs text-slate-400">
        © 2026 CodeJudge. Assess. Analyze. Improve.
      </div>
    </footer>
  );
};