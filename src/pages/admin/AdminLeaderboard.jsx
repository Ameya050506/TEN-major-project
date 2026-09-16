import React, { useEffect, useState } from "react";
import { leaderboardService } from "../../services/leaderboardService";
import { testService } from "../../services/testService";
import { Select } from "../../components/common/Select";
import { Badge } from "../../components/common/Badge";
import { Avatar } from "../../components/common/Avatar";
import { LoadingState } from "../../components/common/LoadingState";
import { formatDuration } from "../../utils/formatters";
import { Trophy } from "lucide-react";

export const AdminLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const allTests = await testService.getAllTests();
      setTests(allTests);
    };
    init();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await leaderboardService.getLeaderboard({ testId: selectedTest });
        setLeaderboard(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedTest]);

  const testOptions = [
    { value: "ALL", label: "All Assessments Combined" },
    ...tests.map((t) => ({ value: t.id, label: t.title })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Admin Global Leaderboard Audit
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Inspect top percentile performers across colleges and organizations
          </p>
        </div>

        <div className="w-full sm:w-80">
          <Select
            options={testOptions}
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingState message="Compiling leaderboard..." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Assessment</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Accuracy</th>
                <th className="px-6 py-4">Time Taken</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaderboard.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={row.candidateName} size="sm" />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                          {row.candidateName}
                        </span>
                        <span className="text-xs text-slate-400">{row.candidateEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300">
                    {row.testTitle}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                    {row.score} / {row.totalMarks}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={row.percentage >= 80 ? "success" : row.percentage >= 50 ? "warning" : "danger"}>
                      {row.percentage}%
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                    {formatDuration(row.timeTakenSeconds)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};