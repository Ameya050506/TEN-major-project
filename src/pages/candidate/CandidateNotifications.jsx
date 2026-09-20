import React, { useState } from "react";
import { getCollection, saveCollection, STORAGE_KEYS } from "../../services/apiClient";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Bell, CheckCheck, Trash2, Info, CheckCircle2, Calendar } from "lucide-react";
import { formatDate } from "../../utils/formatters";

export const CandidateNotifications = () => {
  const [notifications, setNotifications] = useState(() =>
    getCollection(STORAGE_KEYS.NOTIFICATIONS)
  );

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    saveCollection(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  const clearAll = () => {
    setNotifications([]);
    saveCollection(STORAGE_KEYS.NOTIFICATIONS, []);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Notification Feed
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            System announcements, test assignments, and scored evaluation updates
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={CheckCheck} onClick={markAllRead}>
              Mark all read
            </Button>
            <Button variant="ghost" size="sm" icon={Trash2} onClick={clearAll}>
              Clear
            </Button>
          </div>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border transition-colors flex items-start gap-4 ${
                notif.isRead
                  ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  : "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/80"
              }`}
            >
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                {notif.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Info className="w-5 h-5 text-indigo-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {notif.title}
                  </h4>
                  {!notif.isRead && <Badge variant="indigo">New</Badge>}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {notif.message}
                </p>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-2">
                  <Calendar className="w-3 h-3" /> {formatDate(notif.date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
          No notifications found. All clear!
        </div>
      )}
    </div>
  );
};