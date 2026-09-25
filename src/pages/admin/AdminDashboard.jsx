import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { testService } from "../../services/testService";
import { candidateService } from "../../services/candidateService";
import { questionService } from "../../services/questionService";
import { resultService } from "../../services/resultService";
import { StatCard } from "../../components/common/StatCard";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { LoadingState } from "../../components/common/LoadingState";
import {
  FileCheck2,
  Users,
  FileCode,
  Trophy,
  CheckCircle2,
  Percent,
  Plus,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { formatDate } from "../../utils/formatters";

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTests, setRecentTests] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminOverview = async () => {
      try {
        const [tests, candidates, questions, results] = await Promise.all([
          testService.getAllTests(),
          candidateService.getAllCandidates(),
          questionService.getAllQuestions(),
          resultService.getAllResults(),
        ]);

        const passCount = results.filter((r) => r.status === "PASSED").length;
        const passRate = results.length ? Math.round((passCount / results.length) * 100) : 0;
        const avgScore = results.length
          ? Math.round(results.reduce((acc, curr) => acc + curr.percentage, 0) / results.length)
          : 0;

        setStats({
          totalTests: tests.length,
          activeTests: tests.filter((t) => t.status === "Active").length,
          totalCandidates: candidates.length,
          totalQuestions: questions.length,
          testsCompleted: results.length,
          passRate,
          avgScore,
        });

        setRecentTests(tests.slice(0, 4));
        setRecentResults(results.slice(0, 4));
      } catch (err) {
        console.error("Admin overview fetch failed:", err);
        setStats({
          totalTests: 0,
          activeTests: 0,
          totalCandidates: 0,
          totalQuestions: 0,
          testsCompleted: 0,
          passRate: 0,
          avgScore: 0,
        });
        setRecentTests([]);
        setRecentResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminOverview();
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchAdminOverview();
    };
    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (loading) return <LoadingState message="Loading administrative overview..." />;

  return (
    <div className="space-y-8">
      {/* Admin Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Administrative Master Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            System Overview & Operations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time assessment pipeline metrics, candidate volume, and evaluation distribution
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/admin/questions/create">
            <Button variant="secondary" size="sm" icon={Plus}>
              Add Question
            </Button>
          </Link>
          <Link to="/admin/tests/create">
            <Button variant="primary" size="sm" icon={Plus}>
              Create Assessment
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Assessments"
          value={stats.totalTests}
          subtitle={`${stats.activeTests} currently active`}
          icon={FileCheck2}
          color="indigo"
        />
        <StatCard
          title="Registered Candidates"
          value={stats.totalCandidates}
          subtitle="Enrolled accounts"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Question Bank Volume"
          value={stats.totalQuestions}
          subtitle="Across all categories"
          icon={FileCode}
          color="amber"
        />
        <StatCard
          title="Average Pass Rate"
          value={`${stats.passRate}%`}
          subtitle={`Avg Score: ${stats.avgScore}%`}
          icon={Percent}
          color="rose"
        />
      </div>

      {/* Dual Section Grid: Recent Assessments & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Tests Overview */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Active Assessments
            </h3>
            <Link
              to="/admin/tests"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Manage all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentTests.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {t.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="indigo">{t.category}</Badge>
                    <span className="text-[11px] text-slate-400">{t.durationMinutes} mins</span>
                    <span className="text-[11px] text-slate-400">•</span>
                    <span className="text-[11px] text-slate-400">{t.totalMarks} Marks</span>
                  </div>
                </div>
                <Badge variant={t.status === "Active" ? "success" : "default"}>
                  {t.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Live Evaluated Results Feed */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Recent Submissions
            </h3>
            <Link
              to="/admin/results"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              All submissions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentResults.map((r) => (
              <div key={r.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {r.candidateName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {r.testTitle} • {formatDate(r.completedAt)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 block">
                    {r.score} / {r.totalMarks} ({r.percentage}%)
                  </span>
                  <Badge variant={r.status === "PASSED" ? "success" : "danger"}>
                    {r.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};