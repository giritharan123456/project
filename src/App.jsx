import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Reports from './pages/Reports';
import About from './pages/About';
import Home from './pages/Home';
import AreaOverview from './pages/AreaOverview';
import BusinessOverview from './pages/BusinessOverview';
import AIRecommendations from './pages/AIRecommendations';
import Forecast from './pages/Forecast';
import Comparison from './pages/Comparison';
import Notifications from './pages/Notifications';
import Workspace from './pages/Workspace';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <div className="min-h-screen bg-[#f8fafc] transition-colors duration-300">
            <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><><Navbar /><Dashboard /></></ProtectedRoute>} />
            <Route path="/analysis" element={<ProtectedRoute><><Navbar /><Analysis /></></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><><Navbar /><Reports /></></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><><Navbar /><About /></></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute><><Navbar /><Home /></></ProtectedRoute>} />
            <Route path="/area-overview/:pincode" element={<ProtectedRoute><><Navbar /><AreaOverview /></></ProtectedRoute>} />
            <Route path="/business-overview/:pincode" element={<ProtectedRoute><><Navbar /><BusinessOverview /></></ProtectedRoute>} />
            <Route path="/ai-recommendations" element={<ProtectedRoute><><Navbar /><AIRecommendations /></></ProtectedRoute>} />
            <Route path="/forecast" element={<ProtectedRoute><><Navbar /><Forecast /></></ProtectedRoute>} />
            <Route path="/comparison" element={<ProtectedRoute><><Navbar /><Comparison /></></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><><Navbar /><Notifications /></></ProtectedRoute>} />
            <Route path="/workspace" element={<ProtectedRoute><><Navbar /><Workspace /></></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><><Navbar /><AnalyticsDashboard /></></ProtectedRoute>} />
          </Routes>
        </div>
      </ToastProvider>
    </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
