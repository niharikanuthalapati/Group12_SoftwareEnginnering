import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useUser } from './UserContext';
import Login from "./components/Login";
import Register from "./components/Register";
import Main from "./components/Main";
import Dashboard from "./components/Dashboard";
import DataImport from "./components/DataImport";
import Visualization from "./components/Visualization";
import Feedback from "./components/Feedback";
import ReportGeneration from "./components/ReportGeneration";
import Compare from "./components/Compare";
import VisualizationCompare from "./components/VisualizationCompare";


function PrivateRoute({ children }) {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return children;
}

function PublicRoute({ children }) {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicRoute><Main /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/import" element={<PrivateRoute><DataImport /></PrivateRoute>} />
        <Route path="/compare" element={<PrivateRoute><Compare /></PrivateRoute>} />
        <Route path="/VisualizationCompare" element={<PrivateRoute><VisualizationCompare /></PrivateRoute>} />
        <Route path="/visualization" element={<PrivateRoute><Visualization /></PrivateRoute>} />
        <Route path="/feedback" element={<PrivateRoute><Feedback /></PrivateRoute>} />
        <Route path="/report" element={<PrivateRoute><ReportGeneration /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
