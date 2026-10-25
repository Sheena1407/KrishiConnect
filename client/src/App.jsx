import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import KrishiMarket from './pages/KrishiMarket';
import CartPage from './pages/CartPage';
import KrishiCommunity from './pages/KrishiCommunity';

// Protected Farmer Pages
import FarmerDashboard from './pages/FarmerDashboard';
import FarmManagement from './pages/FarmManagement';
import CropManagement from './pages/CropManagement';
import CropAdvisor from './pages/CropAdvisor';
import SoilHealth from './pages/SoilHealth';
import WeatherIntelligence from './pages/WeatherIntelligence';
import MandiPrices from './pages/MandiPrices';
import CropDoctor from './pages/CropDoctor';
import PestAlerts from './pages/PestAlerts';
import FarmPlanner from './pages/FarmPlanner';
import MyOrders from './pages/MyOrders';
import ExpertConsultation from './pages/ExpertConsultation';
import KrishiAssistant from './pages/KrishiAssistant';
import FarmAnalytics from './pages/FarmAnalytics';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';

// Protected Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminExperts from './pages/admin/AdminExperts';
import AdminPests from './pages/admin/AdminPests';
import AdminReports from './pages/admin/AdminReports';

import LoadingSpinner from './components/common/LoadingSpinner';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Verifying security credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Pages in MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/market" element={<KrishiMarket />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/community" element={<KrishiCommunity />} />
      </Route>

      {/* Protected Dashboard Pages */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<FarmerDashboard />} />
        <Route path="/farms" element={<FarmManagement />} />
        <Route path="/crops" element={<CropManagement />} />
        <Route path="/crop-advisor" element={<CropAdvisor />} />
        <Route path="/soil-health" element={<SoilHealth />} />
        <Route path="/weather" element={<WeatherIntelligence />} />
        <Route path="/mandi-prices" element={<MandiPrices />} />
        <Route path="/crop-doctor" element={<CropDoctor />} />
        <Route path="/pest-alerts" element={<PestAlerts />} />
        <Route path="/planner" element={<FarmPlanner />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/experts" element={<ExpertConsultation />} />
        <Route path="/assistant" element={<KrishiAssistant />} />
        <Route path="/analytics" element={<FarmAnalytics />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin Only Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/farms"
          element={
            <ProtectedRoute adminOnly={true}>
              <FarmManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/crops"
          element={
            <ProtectedRoute adminOnly={true}>
              <CropManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/experts"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminExperts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pests"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminPests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/soil-reports"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute adminOnly={true}>
              <FarmAnalytics />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
