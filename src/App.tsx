// app.tsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { NhostProvider } from "@nhost/react";
import { NhostApolloProvider } from "@nhost/react-apollo";
import { useAuthenticationStatus } from "@nhost/react";
import { nhost } from "./lib/nhost";
import { AuthForm } from "./components/AuthForm";
import { Dashboard } from "./components/Dashboard";
import { ChatList } from "./components/ChatList";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const { isAuthenticated } = useAuthenticationStatus();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <div>
        <AuthForm
          mode={mode}
          onToggleMode={() => setMode(mode === "signin" ? "signup" : "signin")}
        />
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:chatId?"
          element={
            <ProtectedRoute>
              <ChatList />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <AppRoutes />
      </NhostApolloProvider>
    </NhostProvider>
  );
}

export default App;
