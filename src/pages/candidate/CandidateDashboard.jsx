import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { testService } from "../../services/testService";
import { resultService } from "../../services/resultService";
import { StatCard } from "../../components/common/StatCard";
import { AssessmentCard } from "../../components/assessment/AssessmentCard";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { LoadingState } from "../../components/common/LoadingState";
import {
  FileCheck2,
  CheckCircle2,
  Trophy,
  BarChart3,
  ArrowRight,
  Sparkles,
  Calendar,
} from "lucide-react";
import { formatDate } from "../../utils/formatters";

export const CandidateDashboard = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [allTests, userResults] = await Promise.all([
          testService.getAllTests(),
          resultService.getResultsByCandidateId(user?.id || "cand-001"),
        ]);
        setTests(allTests);
        setResults(userResults);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (loading) return <LoadingState message="Loading candidate metrics..." />;

  const completedCount = results.length;
  const avgScore = completedCount
    ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / completedCount)
    : 0;
  const bestScore = completedCount
    ? Math.max(...results.map((r) => r.percentage))
    : 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white border border-indigo-800 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-800/60 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Candidate Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.fullName || "Candidate"}!
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1">
            You have {tests.length} active assessments ready for skill verification.
          </p>
        </div>
        <Link to="/candidate/tests">
          <Button variant="primary" icon={ArrowRight}>
            Explore Assessments
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tests Available"
          value={tests.length}
          subtitle="Ready to attempt"
          icon={FileCheck2}
          color="indigo"
        />
        <StatCard
          title="Tests Completed"
          value={completedCount}
          subtitle="Evaluated submissions"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Average Score"
          value={`${avgScore}%`}
          subtitle="Overall accuracy"
          icon={BarChart3}
          color="amber"
        />
        <StatCard
          title="Best Score"
          value={`${bestScore}%`}
          subtitle="Peak assessment performance"
          icon={Trophy}
          color="rose"
        />
      </div>

      {/* Active Assessments Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Featured Assessments
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assigned technical challenges tailored for software engineering profiles
            </p>
          </div>
          <Link
            to="/candidate/tests"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            View all ({tests.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.slice(0, 3).map((test) => (
            <AssessmentCard key={test.id} test={test} />
          ))}
        </div>
      </div>

      {/* Recent Activity Table Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Recent Submissions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recently concluded and scored coding tests
            </p>
          </div>
          <Link
            to="/candidate/history"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            Full history <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {results.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {results.slice(0, 3).map((res) => (
                <div
                  key={res.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                        {res.testTitle}
                      </span>
                      <Badge variant="indigo">{res.category}</Badge>
                      <Badge variant={res.status === "PASSED" ? "success" : "danger"}>
                        {res.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {formatDate(res.completedAt)}
                      </span>
                      <span>•</span>
                      <span>Score: {res.score} / {res.totalMarks} ({res.percentage}%)</span>
                    </div>
                  </div>
                  <Link to={`/candidate/results/${res.id}`}>
                    <Button variant="secondary" size="sm">
                      View Results
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            No completed assessments yet. Pick a test above to start your first evaluation.
          </div>
        )}
      </div>
    </div>
  );
};