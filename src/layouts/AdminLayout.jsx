import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { MobileNav } from "../components/layout/MobileNav";
import { ToastContainer } from "../components/common/Toast";
import { LoadingState } from "../components/common/LoadingState";

export const AdminLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState message="Authenticating administrative session..." />;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar role="admin" />
      <div className="flex-1 flex">
        <Sidebar role="admin" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 lg:pb-8">
          <Outlet />
        </main>
      </div>
      <MobileNav role="admin" />
      <ToastContainer />
    </div>
  );
};