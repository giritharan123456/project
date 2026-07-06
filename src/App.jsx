import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { DistrictProvider } from './contexts/DistrictContext';
import { PincodeProvider } from './contexts/PincodeContext';
import Navbar from './components/Navbar';
import ProtectedRoute, { AdminRoute } from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analysis = lazy(() => import('./pages/Analysis'));
const Reports = lazy(() => import('./pages/Reports'));
const About = lazy(() => import('./pages/About'));
const Home = lazy(() => import('./pages/Home'));
const AreaOverview = lazy(() => import('./pages/AreaOverview'));
const BusinessOverview = lazy(() => import('./pages/BusinessOverview'));
const AIRecommendations = lazy(() => import('./pages/AIRecommendations'));
const Forecast = lazy(() => import('./pages/Forecast'));
const Comparison = lazy(() => import('./pages/Comparison'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Workspace = lazy(() => import('./pages/Workspace'));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const CategoryExplorer = lazy(() => import('./pages/CategoryExplorer'));
const AreaLeaderboard = lazy(() => import('./pages/AreaLeaderboard'));
const CategoryPincodeMatrix = lazy(() => import('./pages/CategoryPincodeMatrix'));
const InvestmentEstimator = lazy(() => import('./pages/InvestmentEstimator'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const DistrictManagement = lazy(() => import('./pages/admin/DistrictManagement'));
const AreaManagement = lazy(() => import('./pages/admin/AreaManagement'));
const BusinessCategoryManagement = lazy(() => import('./pages/admin/BusinessCategoryManagement'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));

function AppContent() {
  const { isDarkMode } = useTheme();
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner size="large" text="Loading page..." />}>
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
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
        <Route path="/profile" element={<ProtectedRoute><><Navbar /><Profile /></></ProtectedRoute>} />
        <Route path="/category-explorer" element={<ProtectedRoute><><Navbar /><CategoryExplorer /></></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><><Navbar /><AreaLeaderboard /></></ProtectedRoute>} />
        <Route path="/matrix" element={<ProtectedRoute><><Navbar /><CategoryPincodeMatrix /></></ProtectedRoute>} />
        <Route path="/investment-estimator" element={<ProtectedRoute><><Navbar /><InvestmentEstimator /></></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/districts" element={<AdminRoute><DistrictManagement /></AdminRoute>} />
        <Route path="/admin/areas" element={<AdminRoute><AreaManagement /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><BusinessCategoryManagement /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
      </Routes>
      </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DistrictProvider>
          <PincodeProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </PincodeProvider>
        </DistrictProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
