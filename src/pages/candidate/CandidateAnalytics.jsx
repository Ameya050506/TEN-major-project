import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { resultService } from "../../services/resultService";
import { StatCard } from "../../components/common/StatCard";
import { LoadingState } from "../../components/common/LoadingState";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { BarChart3, TrendingUp, Award, Target, Lightbulb } from "lucide-react";

export const CandidateAnalytics = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await resultService.getResultsByCandidateId(user?.id || "cand-001");
        setResults(data);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <LoadingState message="Aggregating performance analytics..." />;

  // Transform results for timeline progression chart
  const timelineData = results.map((r, i) => ({
    name: `Attempt ${i + 1}`,
    score: r.percentage,
    title: r.testTitle,
  }));

  // Category distribution data
  const categoryMap = {};
  results.forEach((r) => {
    if (r.categoryBreakdown) {
      Object.entries(r.categoryBreakdown).forEach(([cat, val]) => {
        if (!categoryMap[cat]) categoryMap[cat] = [];
        categoryMap[cat].push(val);
      });
    }
  });

  const categoryChartData = Object.entries(categoryMap).map(([cat, vals]) => ({
    category: cat,
    average: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
  }));

  const avgScore = results.length
    ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Candidate Performance Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Historical score trajectories, domain proficiency, and evaluation insights
        </p>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average Proficiency"
          value={`${avgScore}%`}
          subtitle="Across all attempts"
          icon={Target}
          color="indigo"
        />
        <StatCard
          title="Assessments Taken"
          value={results.length}
          subtitle="Completed evaluations"
          icon={Award}
          color="emerald"
        />
        <StatCard
          title="Growth Index"
          value="+14%"
          subtitle="Progress vs last month"
          icon={TrendingUp}
          color="amber"
        />
        <StatCard
          title="Strongest Domain"
          value={categoryChartData[0]?.category || "Java"}
          subtitle="Highest percentile"
          icon={Award}
          color="rose"
        />
      </div>

      {/* AI Performance Insight Callout */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 leading-relaxed">
          <span className="font-bold">Evaluation Insight:</span> Your Java and OOP concept scores show consistently high accuracy (&gt;85%). We recommend practicing DBMS Indexing and Complex SQL Joins to balance your full-stack percentile.
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Progression Line Chart */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
            Score Progression Over Time (%)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#6366f1" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Proficiency Bar Chart */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
            Domain Accuracy Distribution (%)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="average" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};