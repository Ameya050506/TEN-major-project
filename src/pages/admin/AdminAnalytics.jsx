import React, { useEffect, useState } from "react";
import { reportService } from "../../services/reportService";
import { resultService } from "../../services/resultService";
import { StatCard } from "../../components/common/StatCard";
import { LoadingState } from "../../components/common/LoadingState";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BarChart3, Users, Award, Percent } from "lucide-react";

export const AdminAnalytics = () => {
  const [summary, setSummary] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [sum, res] = await Promise.all([
          reportService.generateAnalyticsSummary(),
          resultService.getAllResults(),
        ]);
        setSummary(sum);
        setResults(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading) return <LoadingState message="Aggregating system telemetry..." />;

  const passed = results.filter((r) => r.status === "PASSED").length;
  const failed = results.length - passed;
  const pieData = [
    { name: "Passed", value: passed },
    { name: "Failed", value: failed },
  ];
  const PIE_COLORS = ["#10b981", "#f43f5e"];

  // Category counts
  const categoryCount = {};
  results.forEach((r) => {
    categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
  });
  const barData = Object.entries(categoryCount).map(([category, count]) => ({
    category,
    attempts: count,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Enterprise Assessment Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          System-wide candidate performance, domain popularity, and pass/fail distributions
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Submissions"
          value={summary.testsCompleted}
          subtitle="Processed tests"
          icon={Award}
          color="indigo"
        />
        <StatCard
          title="Average Score"
          value={`${summary.avgScore}%`}
          subtitle="Cohort mean"
          icon={BarChart3}
          color="amber"
        />
        <StatCard
          title="Pass Percentage"
          value={`${summary.passRate}%`}
          subtitle="Evaluation success"
          icon={Percent}
          color="emerald"
        />
        <StatCard
          title="Total Questions"
          value={summary.totalQuestions}
          subtitle="In database"
          icon={Users}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pass/Fail Distribution Pie */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
            Pass / Fail Outcome Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assessment Category Popularity */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
            Candidate Submissions by Technical Track
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} />
                <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="attempts" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};