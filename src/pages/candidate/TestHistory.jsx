import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { resultService } from "../../services/resultService";
import { DataTable } from "../../components/common/DataTable";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { LoadingState } from "../../components/common/LoadingState";
import { formatDate, formatDuration } from "../../utils/formatters";
import { Search, History, Eye } from "lucide-react";

export const TestHistory = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await resultService.getResultsByCandidateId(user?.id || "cand-001");
        setResults(data);
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const filteredResults = useMemo(() => {
    return results.filter((r) =>
      r.testTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [results, searchQuery]);

  if (loading) return <LoadingState message="Loading your historical performance..." />;

  const columns = [
    {
      header: "Assessment Name",
      accessor: (row) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 block">
            {row.testTitle}
          </span>
          <span className="text-xs text-slate-400">{row.testId}</span>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: (row) => <Badge variant="indigo">{row.category}</Badge>,
    },
    {
      header: "Date",
      accessor: (row) => formatDate(row.completedAt),
    },
    {
      header: "Score",
      accessor: (row) => `${row.score} / ${row.totalMarks} (${row.percentage}%)`,
    },
    {
      header: "Status",
      accessor: (row) => (
        <Badge variant={row.status === "PASSED" ? "success" : "danger"}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Time Taken",
      accessor: (row) => formatDuration(row.timeTakenSeconds),
    },
    {
      header: "Action",
      accessor: (row) => (
        <Link to={`/candidate/results/${row.id}`}>
          <Button variant="secondary" size="sm" icon={Eye}>
            Review
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Assessment History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete record of your proctored evaluations, grades, and review breakdowns
          </p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search history..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredResults}
        emptyMessage="No assessment history found for your account."
      />
    </div>
  );
};