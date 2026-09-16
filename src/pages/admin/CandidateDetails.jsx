import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { candidateService } from "../../services/candidateService";
import { resultService } from "../../services/resultService";
import { Avatar } from "../../components/common/Avatar";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { DataTable } from "../../components/common/DataTable";
import { LoadingState } from "../../components/common/LoadingState";
import { formatDate, formatDuration } from "../../utils/formatters";
import { ArrowLeft, Mail, Phone, Building, Briefcase, Eye } from "lucide-react";

export const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const cand = await candidateService.getCandidateById(id);
        setCandidate(cand);
        const candResults = await resultService.getResultsByCandidateId(id);
        setResults(candResults);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <LoadingState message="Loading candidate record..." />;
  if (!candidate) return <div className="p-8 text-center">Candidate record not found.</div>;

  const historyColumns = [
    {
      header: "Assessment",
      accessor: (row) => row.testTitle,
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
      header: "Completed",
      accessor: (row) => formatDate(row.completedAt),
    },
    {
      header: "Action",
      className: "text-right",
      accessor: (row) => (
        <Link to={`/candidate/results/${row.id}`}>
          <Button variant="secondary" size="sm" icon={Eye}>
            Review Result
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/candidates")}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Candidate Details
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">ID: {candidate.id}</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <Avatar name={candidate.fullName} size="xl" />
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {candidate.fullName}
            </h2>
            <Badge variant={candidate.status === "Active" ? "success" : "danger"}>
              {candidate.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
            <span className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {candidate.email}
            </span>
            <span className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> {candidate.phone || "Not specified"}
            </span>
            <span className="flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-slate-400" /> {candidate.organization}
            </span>
            <span className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {candidate.designation}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Assessment History & Performance Audit
        </h3>
        <DataTable
          columns={historyColumns}
          data={results}
          emptyMessage="No assessment attempts registered for this candidate."
        />
      </div>
    </div>
  );
};