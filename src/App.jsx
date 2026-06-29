import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Reports from './pages/Reports';
import About from './pages/About';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <div className="min-h-screen bg-bg-light transition-colors duration-300">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/dashboard" element={<ProtectedRoute><><Navbar /><Dashboard /></></ProtectedRoute>} />
              <Route path="/analysis" element={<ProtectedRoute><><Navbar /><Analysis /></></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><><Navbar /><Reports /></></ProtectedRoute>} />
              <Route path="/about" element={<ProtectedRoute><><Navbar /><About /></></ProtectedRoute>} />
              <Route path="/home" element={<ProtectedRoute><><Navbar /><Home /></></ProtectedRoute>} />
            </Routes>
          </div>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
