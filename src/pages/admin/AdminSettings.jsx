import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useNotification } from "../../context/NotificationContext";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Settings, Shield, Moon, Sun, Save } from "lucide-react";

export const AdminSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useNotification();

  const [orgName, setOrgName] = useState("CodeJudge Assessment System");
  const [defaultDuration, setDefaultDuration] = useState(30);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Administrative configuration saved", "success");
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Administrative Platform Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure institutional defaults, evaluation thresholds, and system theme
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {theme === "dark" ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            Admin Console Appearance
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Current visual mode: <span className="font-semibold uppercase">{theme}</span>
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={toggleTheme}>
          Switch to {theme === "dark" ? "Light" : "Dark"} Mode
        </Button>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-500" /> Platform Defaults
        </h3>

        <Input
          label="Organization / Institute Title"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />

        <Input
          label="Default Assessment Duration (Minutes)"
          type="number"
          value={defaultDuration}
          onChange={(e) => setDefaultDuration(e.target.value)}
        />

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="primary" icon={Save} isLoading={isSaving}>
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};