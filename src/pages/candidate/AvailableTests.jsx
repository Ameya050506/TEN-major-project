import React, { useEffect, useState, useMemo } from "react";
import { testService } from "../../services/testService";
import { AssessmentCard } from "../../components/assessment/AssessmentCard";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { LoadingState } from "../../components/common/LoadingState";
import { EmptyState } from "../../components/common/EmptyState";
import { filterActiveTests } from "../../utils/activeTests";
import { Search, FileQuestion } from "lucide-react";

export const AvailableTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const loadTests = async () => {
      try {
        const data = await testService.getAllTests();
        setTests(filterActiveTests(data));
      } catch (err) {
        console.error("Failed to load assessments:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTests();
  }, []);

  const categories = useMemo(() => {
    const list = Array.from(new Set(tests.map((t) => t.category)));
    return [{ value: "ALL", label: "All Categories" }, ...list.map((c) => ({ value: c, label: c }))];
  }, [tests]);

  const filteredTests = useMemo(() => {
    return tests
      .filter((test) => {
        const matchesSearch =
          test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          test.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === "ALL" || test.category === selectedCategory;
        const matchesDifficulty =
          selectedDifficulty === "ALL" || test.difficulty === selectedDifficulty;
        return matchesSearch && matchesCategory && matchesDifficulty;
      })
      .sort((a, b) => {
        if (sortBy === "duration-asc") return a.durationMinutes - b.durationMinutes;
        if (sortBy === "duration-desc") return b.durationMinutes - a.durationMinutes;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [tests, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  if (loading) return <LoadingState message="Fetching assessment catalog..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Available Assessments
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Explore technical challenges, timed quizzes, and coding assessments
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Input
          placeholder="Search assessments..."
          icon={Search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          options={categories}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        />
        <Select
          options={[
            { value: "ALL", label: "All Difficulties" },
            { value: "Easy", label: "Easy" },
            { value: "Medium", label: "Medium" },
            { value: "Hard", label: "Hard" },
          ]}
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        />
        <Select
          options={[
            { value: "newest", label: "Sort: Newest First" },
            { value: "duration-asc", label: "Sort: Shortest Duration" },
            { value: "duration-desc", label: "Sort: Longest Duration" },
          ]}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        />
      </div>

      {/* Grid Results */}
      {filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <AssessmentCard key={test.id} test={test} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileQuestion}
          title="No assessments match your criteria"
          description="Try resetting your filters or search keywords to view available tests."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery("");
            setSelectedCategory("ALL");
            setSelectedDifficulty("ALL");
          }}
        />
      )}
    </div>
  );
};