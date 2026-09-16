import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { testService } from "../../services/testService";
import { useNotification } from "../../context/NotificationContext";
import { DataTable } from "../../components/common/DataTable";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { LoadingState } from "../../components/common/LoadingState";
import { formatDate } from "../../utils/formatters";
import { Plus, Search, Edit2, Copy, Trash2, Power } from "lucide-react";

export const TestManagement = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useNotification();

  const loadTests = async () => {
    try {
      const data = await testService.getAllTests();
      setTests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, []);

  const handleToggleStatus = async (test) => {
    const updatedStatus = test.status === "Active" ? "Inactive" : "Active";
    await testService.updateTest(test.id, { status: updatedStatus });
    showToast(`Test set to ${updatedStatus}`, "info");
    loadTests();
  };

  const handleDuplicate = async (test) => {
    await testService.createTest({
      ...test,
      title: `${test.title} (Copy)`,
    });
    showToast("Assessment duplicated successfully", "success");
    loadTests();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await testService.deleteTest(deleteTarget.id);
    showToast("Assessment deleted from database", "success");
    setIsDeleting(false);
    setDeleteTarget(null);
    loadTests();
  };

  const filteredTests = useMemo(() => {
    return tests.filter((t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tests, searchQuery]);

  if (loading) return <LoadingState message="Loading assessments..." />;

  const columns = [
    {
      header: "Assessment Name",
      accessor: (row) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 block">
            {row.title}
          </span>
          <span className="text-[11px] text-slate-400">ID: {row.id}</span>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: (row) => <Badge variant="indigo">{row.category}</Badge>,
    },
    {
      header: "Questions",
      accessor: (row) => `${row.questionIds?.length || 0} Qs`,
    },
    {
      header: "Duration",
      accessor: (row) => `${row.durationMinutes} mins`,
    },
    {
      header: "Total Marks",
      accessor: (row) => `${row.totalMarks} (Pass: ${row.passingScore})`,
    },
    {
      header: "Status",
      accessor: (row) => (
        <Badge variant={row.status === "Active" ? "success" : "default"}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Created",
      accessor: (row) => formatDate(row.createdAt),
    },
    {
      header: "Actions",
      className: "text-right",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleToggleStatus(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Status"
          >
            <Power className="w-4 h-4" />
          </button>
          <Link to={`/admin/tests/${row.id}/edit`}>
            <button
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Assessment"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </Link>
          <button
            onClick={() => handleDuplicate(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Duplicate Test"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Delete Test"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Assessment Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Author, publish, configure grading logic, and audit candidate tests
          </p>
        </div>

        <Link to="/admin/tests/create">
          <Button variant="primary" icon={Plus}>
            Create New Assessment
          </Button>
        </Link>
      </div>

      <div className="w-full sm:w-80">
        <Input
          placeholder="Search assessments..."
          icon={Search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredTests}
        emptyMessage="No assessments found in database."
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Assessment?"
        message={`Are you sure you want to permanently remove "${deleteTarget?.title}"? This cannot be undone.`}
        confirmText="Delete Assessment"
        isLoading={isDeleting}
      />
    </div>
  );
};