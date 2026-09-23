import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { testService } from "../../services/testService";
import { useNotification } from "../../context/NotificationContext";
import { DataTable } from "../../components/common/DataTable";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { LoadingState } from "../../components/common/LoadingState";
import { EmptyState } from "../../components/common/EmptyState";
import { formatDate } from "../../utils/formatters";
import { TestDetailDrawer } from "../../components/admin/TestDetailDrawer";
import { Plus, Search, Edit2, Copy, Trash2, Power, FileQuestion, Eye } from "lucide-react";

const CATEGORY_OPTIONS = [
  { value: "ALL", label: "All categories" },
  { value: "Java", label: "Java" },
  { value: "SQL", label: "SQL" },
  { value: "OOP", label: "OOP" },
  { value: "Data Structures", label: "Data Structures" },
  { value: "DBMS", label: "DBMS" },
  { value: "Aptitude", label: "Aptitude" },
];

const STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const DIFFICULTY_OPTIONS = [
  { value: "ALL", label: "All difficulties" },
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
];

export const TestManagement = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [detailTestId, setDetailTestId] = useState(null);

  const { showToast } = useNotification();

  const loadTests = async () => {
    setLoadError(null);
    try {
      const data = await testService.getAllTests();
      setTests(data);
    } catch (err) {
      console.error(err);
      setLoadError(err.message || "Failed to load assessments");
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, []);

  const handleToggleStatus = async (test) => {
    try {
      const updatedStatus = test.status === "Active" ? "Inactive" : "Active";
      await testService.updateTest(test.id, { status: updatedStatus });
      showToast(`Test set to ${updatedStatus}`, "info");
      loadTests();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDuplicate = async (test) => {
    try {
      const { id, questions, ...rest } = test;
      await testService.createTest({
        ...rest,
        title: `${test.title} (Copy)`,
        questionIds: test.questionIds || [],
      });
      showToast("Assessment duplicated successfully", "success");
      loadTests();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await testService.deleteTest(deleteTarget.id);
      showToast("Assessment deleted", "success");
      setDeleteTarget(null);
      loadTests();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
      const matchesCategory = categoryFilter === "ALL" || t.category === categoryFilter;
      const matchesDifficulty =
        difficultyFilter === "ALL" || t.difficulty === difficultyFilter;
      return matchesSearch && matchesStatus && matchesCategory && matchesDifficulty;
    });
  }, [tests, searchQuery, statusFilter, categoryFilter, difficultyFilter]);

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
      header: "Difficulty",
      accessor: (row) => (
        <Badge
          variant={
            row.difficulty === "Easy"
              ? "success"
              : row.difficulty === "Medium"
                ? "warning"
                : "danger"
          }
        >
          {row.difficulty}
        </Badge>
      ),
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
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <Link to={`/admin/tests/${row.id}/preview`}>
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Preview as candidate"
            >
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <button
            type="button"
            onClick={() => handleToggleStatus(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={
              row.status === "Active"
                ? "Deactivate — hide from candidates"
                : "Activate — show to candidates"
            }
            aria-label={
              row.status === "Active" ? "Set assessment inactive" : "Set assessment active"
            }
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

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search assessments..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-40">
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-44">
          <Select
            label="Category"
            options={CATEGORY_OPTIONS}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-44">
          <Select
            label="Difficulty"
            options={DIFFICULTY_OPTIONS}
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          />
        </div>
      </div>

      {loadError && (
        <EmptyState
          icon={FileQuestion}
          title="Could not load assessments"
          description={loadError}
          actionLabel="Retry"
          onAction={loadTests}
        />
      )}

      {!loadError && (
        <DataTable
          columns={columns}
          data={filteredTests}
          emptyMessage="No assessments match your filters."
          onRowClick={(row) => setDetailTestId(row.id)}
        />
      )}

      <TestDetailDrawer testId={detailTestId} onClose={() => setDetailTestId(null)} />

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
