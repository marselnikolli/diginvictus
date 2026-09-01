import React, { createContext, useContext, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { getToken, setToken, clearToken } from "./api.js";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SectionEditor from "./pages/SectionEditor.jsx";
import ClientsManager from "./pages/ClientsManager.jsx";
import TestimonialsManager from "./pages/TestimonialsManager.jsx";
import Layout from "./components/Layout.jsx";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export default function App() {
  const [token, setTokenState] = useState(getToken());
  const navigate = useNavigate();

  const value = {
    token,
    login: (t) => {
      setToken(t);
      setTokenState(t);
    },
    logout: () => {
      clearToken();
      setTokenState(null);
      navigate("/login");
    },
  };

  return (
    <AuthContext.Provider value={value}>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          element={token ? <Layout /> : <Navigate to="/login" replace />}
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/section/:name" element={<SectionEditor />} />
          <Route path="/clients" element={<ClientsManager />} />
          <Route path="/testimonials" element={<TestimonialsManager />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthContext.Provider>
  );
}
