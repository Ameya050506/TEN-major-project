import React, { useEffect, useState } from "react";
import { leaderboardService } from "../../services/leaderboardService";
import { testService } from "../../services/testService";
import { useAuth } from "../../context/AuthContext";
import { Select } from "../../components/common/Select";
import { Badge } from "../../components/common/Badge";
import { Avatar } from "../../components/common/Avatar";
import { LoadingState } from "../../components/common/LoadingState";
import { Trophy, Medal, Crown, Clock } from "lucide-react";
import { formatDuration } from "../../utils/formatters";

export const CandidateLeaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTests = async () => {
      const allTests = await testService.getAllTests();
      setTests(allTests);
    };
    loadTests();
  }, []);

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const data = await leaderboardService.getLeaderboard({ testId: selectedTest });
        setLeaderboard(data);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, [selectedTest]);

  const testOptions = [
    { value: "ALL", label: "All Assessments Combined" },
    ...tests.map((t) => ({ value: t.id, label: t.title })),
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Candidate Leaderboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global and assessment-specific rankings sorted by percentage and completion speed
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
        <LoadingState message="Recalculating standings..." />
      ) : (
        <>
          {/* Top 3 Podium Visual Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaderboard.slice(0, 3).map((entry, idx) => {
              const podiumOrder = ["order-2 sm:order-2", "order-1 sm:order-1", "order-3 sm:order-3"];
              const medals = [
                { icon: Crown, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800" },
                { icon: Medal, color: "text-slate-400", bg: "bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700" },
                { icon: Medal, color: "text-amber-700", bg: "bg-amber-900/10 border-amber-700/30" },
              ];
              const medal = medals[idx] || medals[1];
              const Icon = medal.icon;

              return (
                <div
                  key={entry.id || idx}
                  className={`p-6 rounded-2xl border ${medal.bg} text-center flex flex-col items-center justify-center relative shadow-sm`}
                >
                  <div className="absolute top-4 right-4">
                    <Icon className={`w-6 h-6 ${medal.color}`} />
                  </div>
                  <Avatar name={entry.candidateName} size="lg" className="mb-3" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Rank #{idx + 1}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {entry.candidateName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{entry.testTitle}</p>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {entry.percentage}% Accuracy • {formatDuration(entry.timeTakenSeconds)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Tabular Leaderboard */}
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
                {leaderboard.map((row, index) => {
                  const isCurrentUser = row.candidateEmail === user?.email;
                  return (
                    <tr
                      key={row.id || index}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                        isCurrentUser
                          ? "bg-indigo-50/60 dark:bg-indigo-950/40 font-medium"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={row.candidateName} size="sm" />
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                              {row.candidateName}
                              {isCurrentUser && (
                                <span className="ml-2 text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">
                                  You
                                </span>
                              )}
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
                        <Badge
                          variant={row.percentage >= 80 ? "success" : row.percentage >= 50 ? "warning" : "danger"}
                        >
                          {row.percentage}%
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                        {formatDuration(row.timeTakenSeconds)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};