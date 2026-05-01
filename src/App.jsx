import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getMe } from './features/auth/authSlice';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './routes/ProtectedRoute';
import { ROLES, DASHBOARD_ROUTES } from './constants/roles';

import InstitutionManagement from './features/admin/InstitutionManagement';

// Dashboard Components
import AdminDashboard from './features/admin/AdminDashboard';
import PrincipalDashboard from './features/principal/PrincipalDashboard';
import RODashboard from './features/ro/RODashboard';
import CandidateDashboard from './features/candidate/CandidateDashboard';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, role, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getMe());
    }
  }, [dispatch, token]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Redirect base path to correct dashboard based on role */}
        <Route
          index
          element={
            isAuthenticated ? (
              <Navigate to={DASHBOARD_ROUTES[role]} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Admin Routes */}
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="admin/principals" element={<div className="p-8 font-bold">Principals Management UI</div>} />
        <Route path="admin/ros" element={<div className="p-8 font-bold">ROs Management UI</div>} />
        <Route
          path="admin/institutes"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <div className="p-6">
                <InstitutionManagement />
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="admin/ads" element={<div className="p-8 font-bold">Advertisements Management UI</div>} />

        {/* Principal Routes */}
        <Route
          path="principal/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PRINCIPAL]}>
              <PrincipalDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="principal/institute" element={<div className="p-8 font-bold">Institute Profile UI</div>} />
        <Route path="principal/intake" element={<div className="p-8 font-bold">Intake Management UI</div>} />
        <Route path="principal/faculty" element={<div className="p-8 font-bold">Faculty Management UI</div>} />
        <Route path="principal/applications" element={<div className="p-8 font-bold">Applications Review UI</div>} />
        <Route path="principal/interviews" element={<div className="p-8 font-bold">Interview Scheduler UI</div>} />

        {/* RO Routes */}
        <Route
          path="ro/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.RO]}>
              <RODashboard />
            </ProtectedRoute>
          }
        />

        {/* Candidate Routes */}
        <Route
          path="candidate/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="candidate/ads" element={<div className="p-8 font-bold">Browse Job Advertisements</div>} />
        <Route path="candidate/applications" element={<div className="p-8 font-bold">My Applications History</div>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
