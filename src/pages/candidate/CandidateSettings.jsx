import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useNotification } from "../../context/NotificationContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Settings, Lock, Bell, Moon, Sun, Save } from "lucide-react";

export const CandidateSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useNotification();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast("Password must contain at least 6 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Password updated successfully", "success");
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Candidate Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure security credentials, theme preferences, and notifications
        </p>
      </div>

      {/* Theme Preference */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {theme === "dark" ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            Interface Theme
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Current visual theme: <span className="font-semibold uppercase">{theme}</span>
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={toggleTheme}>
          Switch to {theme === "dark" ? "Light" : "Dark"} Mode
        </Button>
      </div>

      {/* Notifications */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-500" /> Notification Dispatch
        </h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={emailAlerts}
            onChange={(e) => {
              setEmailAlerts(e.target.checked);
              showToast("Notification preferences updated", "info");
            }}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            Receive automated email confirmations whenever new assessments are published or evaluations complete.
          </span>
        </label>
      </div>

      {/* Security & Password */}
      <form onSubmit={handlePasswordUpdate} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Lock className="w-4 h-4 text-indigo-500" /> Update Password
        </h3>

        <Input
          label="Current Password"
          type="password"
          icon={Lock}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="New Password"
            type="password"
            icon={Lock}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="primary" icon={Save} isLoading={isUpdating}>
            Save New Password
          </Button>
        </div>
      </form>
    </div>
  );
};