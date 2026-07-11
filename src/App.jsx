import React, { Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
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
const PincodeExplorer = lazy(() => import('./pages/PincodeExplorer'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const DistrictManagement = lazy(() => import('./pages/admin/DistrictManagement'));
const AreaManagement = lazy(() => import('./pages/admin/AreaManagement'));
const BusinessCategoryManagement = lazy(() => import('./pages/admin/BusinessCategoryManagement'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const SharePage = lazy(() => import('./pages/SharePage'));

function AppContent() {
  const { isDarkMode } = useTheme();
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <Suspense fallback={<LoadingSpinner size="large" text="Loading page..." />}>
        <Routes>
        <Route path="/" element={<ErrorBoundary><Landing /></ErrorBoundary>} />
        <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
        <Route path="/admin-login" element={<ErrorBoundary><AdminLogin /></ErrorBoundary>} />
        <Route path="/signup" element={<ErrorBoundary><Signup /></ErrorBoundary>} />
        <Route path="/forgot-password" element={<ErrorBoundary><ForgotPassword /></ErrorBoundary>} />
        <Route path="/reset-password/:token" element={<ErrorBoundary><ResetPassword /></ErrorBoundary>} />
        <Route path="/dashboard" element={<ProtectedRoute><ErrorBoundary><><Navbar /><Dashboard /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/analysis" element={<ProtectedRoute><ErrorBoundary><><Navbar /><Analysis /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ErrorBoundary><><Navbar /><Reports /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><ErrorBoundary><><Navbar /><About /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><ErrorBoundary><><Navbar /><Home /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/area-overview/:pincode" element={<ProtectedRoute><ErrorBoundary><><Navbar /><AreaOverview /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/business-overview/:pincode" element={<ProtectedRoute><ErrorBoundary><><Navbar /><BusinessOverview /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/ai-recommendations" element={<ProtectedRoute><ErrorBoundary><><Navbar /><AIRecommendations /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/forecast" element={<ProtectedRoute><ErrorBoundary><><Navbar /><Forecast /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/comparison" element={<ProtectedRoute><ErrorBoundary><><Navbar /><Comparison /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><ErrorBoundary><><Navbar /><Notifications /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/workspace" element={<ProtectedRoute><ErrorBoundary><><Navbar /><Workspace /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><ErrorBoundary><><Navbar /><AnalyticsDashboard /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ErrorBoundary><><Navbar /><Profile /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/category-explorer" element={<ProtectedRoute><ErrorBoundary><><Navbar /><CategoryExplorer /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><ErrorBoundary><><Navbar /><AreaLeaderboard /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/matrix" element={<ProtectedRoute><ErrorBoundary><><Navbar /><CategoryPincodeMatrix /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/investment-estimator" element={<ProtectedRoute><ErrorBoundary><><Navbar /><InvestmentEstimator /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/pincode-explorer" element={<ProtectedRoute><ErrorBoundary><><Navbar /><PincodeExplorer /></></ErrorBoundary></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><ErrorBoundary><AdminDashboard /></ErrorBoundary></AdminRoute>} />
        <Route path="/admin/districts" element={<AdminRoute><ErrorBoundary><DistrictManagement /></ErrorBoundary></AdminRoute>} />
        <Route path="/admin/areas" element={<AdminRoute><ErrorBoundary><AreaManagement /></ErrorBoundary></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><ErrorBoundary><BusinessCategoryManagement /></ErrorBoundary></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><ErrorBoundary><UserManagement /></ErrorBoundary></AdminRoute>} />
        <Route path="/share/:token" element={<ErrorBoundary><SharePage /></ErrorBoundary>} />
        <Route path="*" element={
          <ErrorBoundary>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4">404</h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">Page not found</p>
              <Link to="/" className="px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                Go Home
              </Link>
            </div>
          </div>
          </ErrorBoundary>
        } />
      </Routes>
      </Suspense>
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
