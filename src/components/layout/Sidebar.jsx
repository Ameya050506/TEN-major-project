import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileCheck2,
  FileCode,
  Users,
  Trophy,
  BarChart3,
  FileSpreadsheet,
  Settings,
  History,
  HelpCircle,
} from "lucide-react";

export const Sidebar = ({ role = "candidate" }) => {
  const candidateLinks = [
    { label: "Dashboard", to: "/candidate/dashboard", icon: LayoutDashboard },
    { label: "Available Tests", to: "/candidate/tests", icon: FileCheck2 },
    { label: "Test History", to: "/candidate/history", icon: History },
    { label: "Leaderboard", to: "/candidate/leaderboard", icon: Trophy },
    { label: "Analytics", to: "/candidate/analytics", icon: BarChart3 },
    { label: "Settings", to: "/candidate/settings", icon: Settings },
  ];

  const adminLinks = [
    { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Test Management", to: "/admin/tests", icon: FileCheck2 },
    { label: "Question Bank", to: "/admin/questions", icon: FileCode },
    { label: "Candidates", to: "/admin/candidates", icon: Users },
    { label: "Results & Submissions", to: "/admin/results", icon: Trophy },
    { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
    { label: "Leaderboard", to: "/admin/leaderboard", icon: Trophy },
    { label: "Report Export", to: "/admin/reports", icon: FileSpreadsheet },
    { label: "Platform Settings", to: "/admin/settings", icon: Settings },
  ];

  const links = role === "admin" ? adminLinks : candidateLinks;

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-[calc(100vh-4rem)] sticky top-16 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-3">
        {role === "admin" ? "Admin Controls" : "Candidate Menu"}
      </div>
      <nav className="space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};