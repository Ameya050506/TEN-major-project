import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, LogOut, Code2, Bell, Shield, User } from "lucide-react";
import { Avatar } from "../common/Avatar";

export const Navbar = ({ role = "public" }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-slate-100">
              Code<span className="text-indigo-600 dark:text-indigo-400">Judge</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              ASSESS • ANALYZE
            </span>
          </div>
        </Link>

        {/* Public Navigation */}
        {role === "public" && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Home
            </Link>
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              How It Works
            </a>
            <a href="#categories" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Categories
            </a>
          </nav>
        )}

        {/* Right utility icons & auth state */}
        <div className="flex items-center gap-3">
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-3">
              {role === "candidate" && (
                <Link
                  to="/candidate/notifications"
                  className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-2 right-2 ring-2 ring-white dark:ring-slate-900" />
                </Link>
              )}
              <div className="flex items-center gap-2">
                <Avatar name={user.fullName || "User"} size="sm" />
                <span className="hidden md:inline-block text-xs font-medium text-slate-700 dark:text-slate-300">
                  {user.fullName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-rose-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
              >
                Register
              </Link>
              <Link
                to="/admin/login"
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ml-1"
                title="Admin Portal"
              >
                <Shield className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};