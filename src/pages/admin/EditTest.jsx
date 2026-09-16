import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { testService } from "../../services/testService";
import { useNotification } from "../../context/NotificationContext";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { LoadingState } from "../../components/common/LoadingState";
import { ArrowLeft, Save } from "lucide-react";

export const EditTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const found = await testService.getTestById(id);
        setTest(found);
      } catch (err) {
        showToast("Assessment not found", "error");
        navigate("/admin/tests");
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id, navigate, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await testService.updateTest(id, {
        title: test.title,
        description: test.description,
        category: test.category,
        difficulty: test.difficulty,
        durationMinutes: Number(test.durationMinutes),
        passingScore: Number(test.passingScore),
        status: test.status,
      });
      showToast("Assessment updated successfully", "success");
      navigate("/admin/tests");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingState message="Loading assessment data..." />;
  if (!test) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/tests")}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Edit Assessment
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">ID: {test.id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <Input
          label="Assessment Title"
          value={test.title}
          onChange={(e) => setTest({ ...test, title: e.target.value })}
          required
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={test.description}
            onChange={(e) => setTest({ ...test, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            options={[
              { value: "Java", label: "Java" },
              { value: "SQL", label: "SQL" },
              { value: "OOP", label: "OOP" },
              { value: "Data Structures", label: "Data Structures" },
              { value: "DBMS", label: "DBMS" },
              { value: "Aptitude", label: "Aptitude" },
            ]}
            value={test.category}
            onChange={(e) => setTest({ ...test, category: e.target.value })}
          />

          <Select
            label="Difficulty"
            options={[
              { value: "Easy", label: "Easy" },
              { value: "Medium", label: "Medium" },
              { value: "Hard", label: "Hard" },
            ]}
            value={test.difficulty}
            onChange={(e) => setTest({ ...test, difficulty: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Duration (Minutes)"
            type="number"
            value={test.durationMinutes}
            onChange={(e) => setTest({ ...test, durationMinutes: e.target.value })}
            required
          />
          <Input
            label="Passing Marks"
            type="number"
            value={test.passingScore}
            onChange={(e) => setTest({ ...test, passingScore: e.target.value })}
            required
          />
        </div>

        <Select
          label="Status"
          options={[
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
          ]}
          value={test.status}
          onChange={(e) => setTest({ ...test, status: e.target.value })}
        />

        <div className="pt-4 flex justify-end">
          <Button type="submit" variant="primary" icon={Save} isLoading={isSaving}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};