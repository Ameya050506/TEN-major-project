import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { candidateService } from "../../services/candidateService";
import { useNotification } from "../../context/NotificationContext";
import { DataTable } from "../../components/common/DataTable";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Avatar } from "../../components/common/Avatar";
import { LoadingState } from "../../components/common/LoadingState";
import { formatDate } from "../../utils/formatters";
import { Users, Search, Eye, Power } from "lucide-react";

export const CandidateManagement = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { showToast } = useNotification();

  const loadCandidates = async () => {
    try {
      const data = await candidateService.getAllCandidates();
      setCandidates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const handleToggleStatus = async (cand) => {
    const updatedStatus = cand.status === "Active" ? "Suspended" : "Active";
    await candidateService.updateCandidateStatus(cand.id, updatedStatus);
    showToast(`Candidate account marked as ${updatedStatus}`, "info");
    loadCandidates();
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter(
      (c) =>
        c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.organization.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [candidates, searchQuery]);

  if (loading) return <LoadingState message="Loading candidates..." />;

  const columns = [
    {
      header: "Candidate Name",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.fullName} size="sm" />
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100 block">
              {row.fullName}
            </span>
            <span className="text-xs text-slate-400">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "College / Org",
      accessor: (row) => (
        <div>
          <span className="text-slate-800 dark:text-slate-200 block">{row.organization}</span>
          <span className="text-[11px] text-slate-400">{row.designation}</span>
        </div>
      ),
    },
    {
      header: "Tests Completed",
      accessor: (row) => `${row.testsCompleted || 0} attempts`,
    },
    {
      header: "Status",
      accessor: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "danger"}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Registered",
      accessor: (row) => formatDate(row.registeredAt),
    },
    {
      header: "Actions",
      className: "text-right",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleToggleStatus(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Status"
          >
            <Power className="w-4 h-4" />
          </button>
          <Link to={`/admin/candidates/${row.id}`}>
            <Button variant="secondary" size="sm" icon={Eye}>
              Details
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Candidate Roster & Access Control
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage candidate authentication states, verify student credentials, and inspect submissions
          </p>
        </div>

        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by name, email, or org..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredCandidates}
        emptyMessage="No registered candidates found."
      />
    </div>
  );
};