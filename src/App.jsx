import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getMe } from './features/auth/authSlice';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './routes/ProtectedRoute';
import { ROLES, DASHBOARD_ROUTES } from './constants/roles';
import { Toaster } from 'react-hot-toast';

import InstitutionManagement from './features/admin/InstitutionManagement';
import CourseManagement from './features/admin/CourseManagement';
import NormsIntakeManagement from './features/admin/NormsIntakeManagement';

// Dashboard Components
import AdminDashboard from './features/admin/AdminDashboard';
import UserManagement from './features/admin/UserManagement';
import AddUser from './features/admin/AddUser';
import PrincipalDashboard from './features/principal/PrincipalDashboard';
import FacultyManagement from './features/principal/FacultyManagement';
import RODashboard from './features/ro/RODashboard';
import CandidateDashboard from './features/candidate/CandidateDashboard';
import AIQueryAssistant from './features/admin/AIQueryAssistant';
import VacancyManagement from './features/principal/VacancyManagement';
import AdGenerationDashboard from './features/admin/AdGenerationDashboard';
import SelectionManagement from './features/principal/SelectionManagement';
import PublicAdView from './pages/PublicAdView';
import LecturerDashboard from './features/faculty/LecturerDashboard';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, role, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      console.log('App: Token found, verifying session...');
      dispatch(getMe());
    } else {
      console.log('App: No token found, user is guest');
    }
  }, [dispatch, token]);

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/ads/public/:token" element={<PublicAdView />} />

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
              <Navigate to={DASHBOARD_ROUTES[role?.toUpperCase()] || "/"} replace />
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
        <Route
          path="admin/users"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users/add"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AddUser />
            </ProtectedRoute>
          }
        />
        <Route path="admin/principals" element={<div className="p-8 font-bold">Principals Management UI</div>} />
        <Route 
          path="admin/courses" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <div className="p-6">
                <CourseManagement />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="admin/ads" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <div className="p-6">
                <AdGenerationDashboard />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="admin/ai-assistant" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <div className="p-6">
                <AIQueryAssistant />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="admin/ro" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <div className="p-8 font-bold">Region Office Management UI</div>
            </ProtectedRoute>
          } 
        />


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
        <Route 
          path="principal/faculty" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.PRINCIPAL]}>
              <div className="p-6">
                <FacultyManagement />
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="principal/vacancies" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.PRINCIPAL]}>
              <div className="p-6">
                <VacancyManagement />
              </div>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="principal/selection" 
          element={
            <ProtectedRoute allowedRoles={[ROLES.PRINCIPAL]}>
              <div className="p-6">
                <SelectionManagement />
              </div>
            </ProtectedRoute>
          } 
        />

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
        
        {/* Faculty / Lecturer Routes */}
        <Route
          path="faculty/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
              <LecturerDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
