import React, { useState } from "react";
import { resultService } from "../../services/resultService";
import { candidateService } from "../../services/candidateService";
import { questionService } from "../../services/questionService";
import { useNotification } from "../../context/NotificationContext";
import { exportToCSV } from "../../utils/csvExporter";
import { Button } from "../../components/common/Button";
import { Select } from "../../components/common/Select";
import { FileSpreadsheet, Download } from "lucide-react";

export const ReportExport = () => {
  const [reportType, setReportType] = useState("RESULTS");
  const [isExporting, setIsExporting] = useState(false);
  const { showToast } = useNotification();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (reportType === "RESULTS") {
        const results = await resultService.getAllResults();
        const exportData = results.map((r) => ({
          ResultID: r.id,
          CandidateName: r.candidateName,
          CandidateEmail: r.candidateEmail,
          Assessment: r.testTitle,
          Category: r.category,
          Score: r.score,
          TotalMarks: r.totalMarks,
          Percentage: `${r.percentage}%`,
          Status: r.status,
          TimeSeconds: r.timeTakenSeconds,
          Date: r.completedAt,
        }));
        exportToCSV(exportData, "codejudge-assessment-results.csv");
      } else if (reportType === "CANDIDATES") {
        const candidates = await candidateService.getAllCandidates();
        const exportData = candidates.map((c) => ({
          CandidateID: c.id,
          FullName: c.fullName,
          Email: c.email,
          Organization: c.organization,
          Designation: c.designation,
          TestsCompleted: c.testsCompleted || 0,
          Status: c.status,
          RegisteredAt: c.registeredAt,
        }));
        exportToCSV(exportData, "codejudge-candidates-roster.csv");
      } else if (reportType === "QUESTIONS") {
        const questions = await questionService.getAllQuestions();
        const exportData = questions.map((q) => ({
          QuestionID: q.id,
          Statement: q.text,
          Category: q.category,
          Difficulty: q.difficulty,
          Marks: q.marks,
          NegativeMarks: q.negativeMarks || 1,
        }));
        exportToCSV(exportData, "codejudge-question-bank.csv");
      }
      showToast("CSV report generated and download initiated", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Audit & Report Generator
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Export institutional assessments, candidate rosters, and grading sheets to CSV
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Select Data Stream to Export
        </h3>

        <Select
          label="Report Type"
          options={[
            { value: "RESULTS", label: "Candidate Assessment Submissions & Results (.csv)" },
            { value: "CANDIDATES", label: "Full Candidate Enrollment Roster (.csv)" },
            { value: "QUESTIONS", label: "Active Question Bank Repository (.csv)" },
          ]}
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        />

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Reports are formatted with standardized UTF-8 CSV headers suitable for direct import into Microsoft Excel, Google Sheets, or institutional Student Information Systems (SIS).
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            variant="primary"
            icon={Download}
            onClick={handleExport}
            isLoading={isExporting}
          >
            Export Selected Report
          </Button>
        </div>
      </div>
    </div>
  );
};