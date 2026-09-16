import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { questionService } from "../../services/questionService";
import { useNotification } from "../../context/NotificationContext";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { CodeSnippetViewer } from "../../components/assessment/CodeSnippetViewer";
import { ArrowLeft, Plus, Trash2, CheckCircle2, Save } from "lucide-react";

export const CreateQuestion = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [text, setText] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [category, setCategory] = useState("Java");
  const [difficulty, setDifficulty] = useState("Medium");
  const [marks, setMarks] = useState(4);
  const [negativeMarks, setNegativeMarks] = useState(1);
  const [explanation, setExplanation] = useState("");

  const [options, setOptions] = useState([
    { id: "opt-1", text: "" },
    { id: "opt-2", text: "" },
    { id: "opt-3", text: "" },
    { id: "opt-4", text: "" },
  ]);
  const [correctOptionId, setCorrectOptionId] = useState("opt-1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionChange = (id, val) => {
    setOptions(options.map((o) => (o.id === id ? { ...o, text: val } : o)));
  };

  const addOption = () => {
    const newId = `opt-${Date.now()}`;
    setOptions([...options, { id: newId, text: "" }]);
  };

  const removeOption = (id) => {
    if (options.length <= 2) {
      showToast("A minimum of 2 options is required for MCQ format", "error");
      return;
    }
    setOptions(options.filter((o) => o.id !== id));
    if (correctOptionId === id) {
      setCorrectOptionId(options[0].id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      showToast("Question prompt text is required", "error");
      return;
    }
    const emptyOpt = options.find((o) => !o.text.trim());
    if (emptyOpt) {
      showToast("All option fields must have non-empty text", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await questionService.createQuestion({
        text,
        codeSnippet: codeSnippet.trim() ? codeSnippet : null,
        category,
        difficulty,
        marks: Number(marks),
        negativeMarks: Number(negativeMarks),
        type: "MCQ",
        options,
        correctOptionId,
        explanation,
      });

      showToast("Question saved to repository successfully", "success");
      navigate("/admin/questions");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/questions")}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Author Question
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create technical assessment problems with optional code blocks and scoring rules
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Question Prompt / Statement *
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="e.g. Which of the following collections classes guarantees insertion order?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>

        {/* Code Snippet input & Live Preview */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Code Snippet (Optional)
          </label>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-950 font-mono text-xs sm:text-sm px-3 py-2 text-emerald-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="// Enter optional Java, SQL, or pseudocode here..."
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
          />
          {codeSnippet && (
            <div className="mt-2">
              <span className="text-[10px] font-mono uppercase text-slate-400">Code Snippet Preview:</span>
              <CodeSnippetViewer code={codeSnippet} language={category.toLowerCase()} />
            </div>
          )}
        </div>

        {/* Classification & Grading */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Select
            label="Domain"
            options={[
              { value: "Java", label: "Java" },
              { value: "SQL", label: "SQL" },
              { value: "OOP", label: "OOP" },
              { value: "DBMS", label: "DBMS" },
              { value: "Data Structures", label: "Data Structures" },
              { value: "Aptitude", label: "Aptitude" },
            ]}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <Select
            label="Difficulty"
            options={[
              { value: "Easy", label: "Easy" },
              { value: "Medium", label: "Medium" },
              { value: "Hard", label: "Hard" },
            ]}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          />

          <Input
            label="Earned Marks"
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            required
          />

          <Input
            label="Penalty Marks"
            type="number"
            value={negativeMarks}
            onChange={(e) => setNegativeMarks(e.target.value)}
            required
          />
        </div>

        {/* MCQ Options with Radio Correct Answer Selector */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Multiple Choice Options (Select the correct radio button) *
            </label>
            <Button variant="ghost" size="sm" icon={Plus} onClick={addOption}>
              Add Option
            </Button>
          </div>

          <div className="space-y-2">
            {options.map((opt, idx) => (
              <div key={opt.id} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctOptionId === opt.id}
                  onChange={() => setCorrectOptionId(opt.id)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  title="Mark as correct answer"
                />
                <span className="text-xs font-mono font-bold text-slate-400 w-4">
                  {String.fromCharCode(65 + idx)}
                </span>
                <input
                  type="text"
                  placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                  className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={opt.text}
                  onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(opt.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Technical Explanation */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Technical Solution & Explanation
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Explain why the marked answer is correct for candidate review..."
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" variant="primary" icon={Save} isLoading={isSubmitting}>
            Save Question to Bank
          </Button>
        </div>
      </form>
    </div>
  );
};