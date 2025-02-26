import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EvaluationForm from './components/EvaluationForm';
import TestConsole from './components/TestConsole';
import NotFound from './components/NotFound';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/experiments" replace />} />
        <Route path="/experiments" element={<Dashboard />} />
        <Route path="/experiments/:experimentId" element={<Dashboard />} />
        <Route path="/new-evaluation" element={<EvaluationForm />} />
        <Route path="/console" element={<TestConsole />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
