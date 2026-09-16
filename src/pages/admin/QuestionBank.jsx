import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { questionService } from "../../services/questionService";
import { useNotification } from "../../context/NotificationContext";
import { DataTable } from "../../components/common/DataTable";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { LoadingState } from "../../components/common/LoadingState";
import { Plus, Search, Trash2, Copy, FileCode } from "lucide-react";

export const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { showToast } = useNotification();

  const loadQuestions = async () => {
    try {
      const data = await questionService.getAllQuestions();
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleDuplicate = async (q) => {
    await questionService.createQuestion({
      ...q,
      text: `${q.text} (Copy)`,
    });
    showToast("Question duplicated in bank", "success");
    loadQuestions();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await questionService.deleteQuestion(deleteTarget.id);
    showToast("Question removed from bank", "success");
    setDeleteTarget(null);
    loadQuestions();
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "ALL" || q.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [questions, searchQuery, categoryFilter]);

  if (loading) return <LoadingState message="Loading question bank..." />;

  const columns = [
    {
      header: "Question Text",
      accessor: (row) => (
        <div className="max-w-md">
          <span className="font-medium text-slate-900 dark:text-slate-100 block line-clamp-2">
            {row.text}
          </span>
          <span className="text-[11px] font-mono text-slate-400">ID: {row.id}</span>
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
          variant={row.difficulty === "Easy" ? "success" : row.difficulty === "Medium" ? "warning" : "danger"}
        >
          {row.difficulty}
        </Badge>
      ),
    },
    {
      header: "Marks",
      accessor: (row) => `+${row.marks} / -${row.negativeMarks || 1}`,
    },
    {
      header: "Actions",
      className: "text-right",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleDuplicate(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Duplicate Question"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Delete Question"
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileCode className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Question Repository
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Standard problem library for technical interviews and coding assessments
          </p>
        </div>

        <Link to="/admin/questions/create">
          <Button variant="primary" icon={Plus}>
            Author Question
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search questions by keyword..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          options={[
            { value: "ALL", label: "All Domains" },
            { value: "Java", label: "Java" },
            { value: "SQL", label: "SQL" },
            { value: "OOP", label: "OOP" },
            { value: "DBMS", label: "DBMS" },
            { value: "Data Structures", label: "Data Structures" },
            { value: "Aptitude", label: "Aptitude" },
          ]}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredQuestions}
        emptyMessage="No questions match the current criteria."
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Question?"
        message="Are you sure you want to delete this question? Assessments using this question will remain intact, but it cannot be added to future tests."
        confirmText="Delete"
      />
    </div>
  );
};