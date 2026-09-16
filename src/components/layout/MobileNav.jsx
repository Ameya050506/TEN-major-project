import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileCheck2, Trophy, BarChart3, Settings } from "lucide-react";

export const MobileNav = ({ role = "candidate" }) => {
  const links =
    role === "admin"
      ? [
          { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
          { label: "Tests", to: "/admin/tests", icon: FileCheck2 },
          { label: "Results", to: "/admin/results", icon: Trophy },
          { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
          { label: "Settings", to: "/admin/settings", icon: Settings },
        ]
      : [
          { label: "Dashboard", to: "/candidate/dashboard", icon: LayoutDashboard },
          { label: "Tests", to: "/candidate/tests", icon: FileCheck2 },
          { label: "Leaderboard", to: "/candidate/leaderboard", icon: Trophy },
          { label: "Analytics", to: "/candidate/analytics", icon: BarChart3 },
          { label: "Settings", to: "/candidate/settings", icon: Settings },
        ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1 flex justify-around">
      {links.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-slate-500 dark:text-slate-400"
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};