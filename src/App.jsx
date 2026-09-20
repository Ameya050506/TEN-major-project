import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from "./context/AuthContext";
import { AssessmentProvider } from "./context/AssessmentContext";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <AssessmentProvider>
            <Router>
              <AppRoutes />
            </Router>
          </AssessmentProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}