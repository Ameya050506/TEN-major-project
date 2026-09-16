import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { resultService } from "../../services/resultService";
import { DataTable } from "../../components/common/DataTable";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { LoadingState } from "../../components/common/LoadingState";
import { formatDate, formatDuration } from "../../utils/formatters";
import { Trophy, Search, Eye } from "lucide-react";

export const ResultsManagement = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await resultService.getAllResults();
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, []);

  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const matchesSearch =
        r.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.testTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [results, searchQuery, statusFilter]);

  if (loading) return <LoadingState message="Compiling assessment submissions..." />;

  const columns = [
    {
      header: "Candidate",
      accessor: (row) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 block">
            {row.candidateName}
          </span>
          <span className="text-xs text-slate-400">{row.candidateEmail}</span>
        </div>
      ),
    },
    {
      header: "Assessment",
      accessor: (row) => (
        <div>
          <span className="font-medium text-slate-800 dark:text-slate-200 block">
            {row.testTitle}
          </span>
          <Badge variant="indigo">{row.category}</Badge>
        </div>
      ),
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
      header: "Date",
      accessor: (row) => formatDate(row.completedAt),
    },
    {
      header: "Action",
      className: "text-right",
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
            <Trophy className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Evaluation Submissions & Results
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time audit log of all completed candidate tests and automated score verdicts
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search candidate or test..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            options={[
              { value: "ALL", label: "All Statuses" },
              { value: "PASSED", label: "Passed Only" },
              { value: "FAILED", label: "Failed Only" },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredResults}
        emptyMessage="No assessment results recorded."
      />
    </div>
  );
};