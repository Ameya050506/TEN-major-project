import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import { PublicLayout } from "../layouts/PublicLayout";
import { CandidateLayout } from "../layouts/CandidateLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { AssessmentLayout } from "../layouts/AssessmentLayout";

// Public & Auth Pages
import { LandingPage } from "../pages/public/LandingPage";
import { CandidateRegister } from "../pages/auth/CandidateRegister";
import { CandidateLogin } from "../pages/auth/CandidateLogin";
import { AdminLogin } from "../pages/auth/AdminLogin";
import { ForgotPassword } from "../pages/auth/ForgotPassword";

// Candidate Pages
import { CandidateDashboard } from "../pages/candidate/CandidateDashboard";
import { AvailableTests } from "../pages/candidate/AvailableTests";
import { TestInstructions } from "../pages/candidate/TestInstructions";
import { TestAttempt } from "../pages/candidate/TestAttempt";
import { TestResult } from "../pages/candidate/TestResult";
import { TestHistory } from "../pages/candidate/TestHistory";
import { CandidateAnalytics } from "../pages/candidate/CandidateAnalytics";
import { CandidateLeaderboard } from "../pages/candidate/CandidateLeaderboard";
import { CandidateProfile } from "../pages/candidate/CandidateProfile";
import { CandidateSettings } from "../pages/candidate/CandidateSettings";
import { CandidateNotifications } from "../pages/candidate/CandidateNotifications";

// Admin Pages
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { TestManagement } from "../pages/admin/TestManagement";
import { CreateTest } from "../pages/admin/CreateTest";
import { EditTest } from "../pages/admin/EditTest";
import { AdminTestPreview } from "../pages/admin/AdminTestPreview";
import { QuestionBank } from "../pages/admin/QuestionBank";
import { CreateQuestion } from "../pages/admin/CreateQuestion";
import { CandidateManagement } from "../pages/admin/CandidateManagement";
import { CandidateDetails } from "../pages/admin/CandidateDetails";
import { ResultsManagement } from "../pages/admin/ResultsManagement";
import { AdminAnalytics } from "../pages/admin/AdminAnalytics";
import { AdminLeaderboard } from "../pages/admin/AdminLeaderboard";
import { ReportExport } from "../pages/admin/ReportExport";
import { AdminSettings } from "../pages/admin/AdminSettings";

// Error Pages
import { NotFound } from "../pages/errors/NotFound";
import { Unauthorized } from "../pages/errors/Unauthorized";
import { SessionExpired } from "../pages/errors/SessionExpired";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<CandidateRegister />} />
        <Route path="/login" element={<CandidateLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/session-expired" element={<SessionExpired />} />
      </Route>

      {/* Candidate Protected Flow */}
      <Route path="/candidate" element={<CandidateLayout />}>
        <Route index element={<Navigate to="/candidate/dashboard" replace />} />
        <Route path="dashboard" element={<CandidateDashboard />} />
        <Route path="tests" element={<AvailableTests />} />
        <Route path="tests/:id/instructions" element={<TestInstructions />} />
        <Route path="results/:id" element={<TestResult />} />
        <Route path="history" element={<TestHistory />} />
        <Route path="leaderboard" element={<CandidateLeaderboard />} />
        <Route path="analytics" element={<CandidateAnalytics />} />
        <Route path="profile" element={<CandidateProfile />} />
        <Route path="settings" element={<CandidateSettings />} />
        <Route path="notifications" element={<CandidateNotifications />} />
      </Route>

      {/* Candidate Focused Assessment Layout (No sidebar distraction) */}
      <Route path="/candidate/tests/:id/attempt" element={<AssessmentLayout />}>
        <Route index element={<TestAttempt />} />
      </Route>

      {/* Admin Protected Console */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="tests" element={<TestManagement />} />
        <Route path="tests/create" element={<CreateTest />} />
        <Route path="tests/:id/edit" element={<EditTest />} />
        <Route path="tests/:id/preview" element={<AdminTestPreview />} />
        <Route path="questions" element={<QuestionBank />} />
        <Route path="questions/create" element={<CreateQuestion />} />
        <Route path="candidates" element={<CandidateManagement />} />
        <Route path="candidates/:id" element={<CandidateDetails />} />
        <Route path="results" element={<ResultsManagement />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="leaderboard" element={<AdminLeaderboard />} />
        <Route path="reports" element={<ReportExport />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* 404 Fallback Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};