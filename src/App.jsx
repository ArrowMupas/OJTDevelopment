import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./utils/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./utils/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";
import PublicLayout from "./layouts/PublicLayout";

// Public
import HomePage from "./pages/public/HomePage";
import Dashboard from "./pages/public/Dashboard";
import SurveyPage from "./pages/public/SurveyPage";
import ContactPage from "./pages/public/ContactPage";
import NotFoundPage from "./pages/public/NotFoundPage";
import AboutPage from "./pages/public/AboutPage";
import RequestVehiclePage from "./pages/public/RequestVehiclePage";
import RequestInputPage from "./pages/public/RequestInput";
import SurveyInput from "./pages/public/SurveyInput";
import CompleteRequest from "./pages/management/CompleteRequest";
import LoginPage from "./pages/public/LoginPage";
import TrackingPage from "./pages/TrackingPage";
import PublicTrackPage from "./pages/PublicTrackPage";
import PublicTrackRelease from "./pages/PublicTrackRelease";
import TrackingRelease from "./pages/TrackingRelease";
import StaffPage from "./pages/public/StaffPage";
import EntryExitHistory from "./pages/public/EntryExitHistory";

// Management
import AdminDashboard from "./pages/management/AdminDashboard";
import Staffs from "./pages/management/Staffs";
import InquiryPage from "./pages/management/InquiryPage";
import ManageRequestsPage from "./pages/management/ManageRequestPage";
import SurveyResult from "./pages/management/Surveyresult";
import EntryExitMonitoring from "./pages/management/EntryExitMonitoring";

// Vehicles
import VehiclePage from "./pages/vehicles/Vehicles";
import HistoryPage from "./pages/vehicles/HistoryPage";
import Battery from "./pages/vehicles/Battery";
import Tires from "./pages/vehicles/Tires";
import PMS from "./pages/vehicles/PMS";
import UnoperationalVehicles from "./pages/vehicles/UnoperationalVehicles";
import VehicleHistory from "./pages/vehicles/VehicleHistory";
import TrackingHistory from "./pages/TrackingHistory";

import TransactionsPage from "./pages/TransactionsPage";
import DriverMonitoringPage from "./pages/DriverMonitoringPage";
import TripTicketPage from "./pages/TripTicketPage";

function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontWeight: "bold",
            fontSize: "16px",
            padding: "16px 24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            textAlign: "center",
          },
          duration: 5000,
        }}
      />
      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* // Uncomment to activate google login (For later) */}

          {/* <Route element={<MainLayout />}> */}
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/vehicle-requests" element={<ManageRequestsPage />} />
          <Route
            path="/vehicle-requests/completed"
            element={<CompleteRequest />}
          />

          <Route path="/vehicles" element={<VehiclePage />} />
          <Route
            path="/vehicles/unoperational"
            element={<UnoperationalVehicles />}
          />
          <Route
            path="/vehicles/vehicle-history"
            element={<VehicleHistory />}
          />

          <Route path="/drivermonitoring" element={<DriverMonitoringPage />} />

          <Route path="/track" element={<TrackingPage />} />
          <Route path="/track-release" element={<TrackingRelease />} />
          <Route path="/tracking-history" element={<TrackingHistory />} />

          <Route path="/pms" element={<PMS />} />
          <Route path="/battery" element={<Battery />} />
          <Route path="/tires" element={<Tires />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/staff-management" element={<Staffs />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/inquiries" element={<InquiryPage />} />
          <Route path="/ticket" element={<TripTicketPage />} />
          <Route path="/survey-results" element={<SurveyResult />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/staff" element={<StaffPage />} />

          <Route path="/public-track" element={<PublicTrackPage />} />
          <Route
            path="/public-track-release"
            element={<PublicTrackRelease />}
          />
          <Route path="/request-vehicle" element={<RequestVehiclePage />} />
          <Route
            path="/request-vehicle/finish/:id"
            element={<RequestInputPage />}
          />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/survey/finish/:id" element={<SurveyInput />} />
          <Route
            path="/entry-exit-monitoring"
            element={<EntryExitMonitoring />}
          />
          <Route path="/entry-exit-history" element={<EntryExitHistory />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
