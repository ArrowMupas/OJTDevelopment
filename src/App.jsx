import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Suspense, lazy } from "react";
import ScrollToTop from "./utils/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./utils/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";
import PublicLayout from "./layouts/PublicLayout";

// Public (Lazy)
const HomePage = lazy(() => import("./pages/public/HomePage"));
const Dashboard = lazy(() => import("./pages/public/Dashboard"));
const SurveyPage = lazy(() => import("./pages/public/SurveyPage"));
const ContactPage = lazy(() => import("./pages/public/ContactPage"));
const NotFoundPage = lazy(() => import("./pages/public/NotFoundPage"));
const AboutPage = lazy(() => import("./pages/public/AboutPage"));
const RequestVehiclePage = lazy(
  () => import("./pages/public/RequestVehiclePage"),
);
const RequestInputPage = lazy(() => import("./pages/public/RequestInput"));
const SurveyInput = lazy(() => import("./pages/public/SurveyInput"));
const CompleteRequest = lazy(
  () => import("./pages/management/CompleteRequest"),
);
const LoginPage = lazy(() => import("./pages/public/LoginPage"));
const PublicTrackPage = lazy(() => import("./pages/public/PublicTrackPage"));
const PublicTrackRelease = lazy(
  () => import("./pages/public/PublicTrackRelease"),
);
const StaffPage = lazy(() => import("./pages/public/StaffPage"));
const EntryExitMonitoring = lazy(
  () => import("./pages/public/EntryExitMonitoring"),
);
const EntryExitHistory = lazy(() => import("./pages/public/EntryExitHistory"));

// Management (Lazy)
const AdminDashboard = lazy(() => import("./pages/management/AdminDashboard"));
const Staffs = lazy(() => import("./pages/management/Staffs"));
const InquiryPage = lazy(() => import("./pages/management/InquiryPage"));
const ManageRequestsPage = lazy(
  () => import("./pages/management/ManageRequestPage"),
);
const SurveyResult = lazy(() => import("./pages/management/Surveyresult"));
const GuardPage = lazy(() => import("./pages/management/GuardPage"));
const TripTicketPage = lazy(() => import("./pages/management/TripTicketPage"));
const TransactionsPage = lazy(
  () => import("./pages/management/TransactionsPage"),
);
const Inventory = lazy(() => import("./pages/management/Inventory"));

// Vehicles (Lazy)
const VehiclePage = lazy(() => import("./pages/vehicles/Vehicles"));
const HistoryPage = lazy(() => import("./pages/vehicles/HistoryPage"));
const Battery = lazy(() => import("./pages/vehicles/Battery"));
const Tires = lazy(() => import("./pages/vehicles/Tires"));
const PMS = lazy(() => import("./pages/vehicles/PMS"));
const UnoperationalVehicles = lazy(
  () => import("./pages/vehicles/UnoperationalVehicles"),
);
const VehicleHistory = lazy(() => import("./pages/vehicles/VehicleHistory"));

// Others (Lazy)
const TrackingHistory = lazy(() => import("./pages/TrackingHistory"));
const PaymentList = lazy(() => import("./pages/PaymentList"));
const DriverMonitoringPage = lazy(() => import("./pages/DriverMonitoringPage"));
const TrackingPage = lazy(() => import("./pages/TrackingPage"));
const TrackingRelease = lazy(() => import("./pages/TrackingRelease"));

function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Toaster
        position="bottom-right"
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

      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <p>Loading page...</p>
          </div>
        }
      >
        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
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

            <Route
              path="/drivermonitoring"
              element={<DriverMonitoringPage />}
            />

            <Route path="/track" element={<TrackingPage />} />
            <Route path="/track-release" element={<TrackingRelease />} />
            <Route path="/tracking-history" element={<TrackingHistory />} />

            <Route path="/pms" element={<PMS />} />
            <Route path="/battery" element={<Battery />} />
            <Route path="/tires" element={<Tires />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/staff-management" element={<Staffs />} />
            <Route path="/guards" element={<GuardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/inquiries" element={<InquiryPage />} />
            <Route path="/trip-ticket" element={<TripTicketPage />} />
            <Route path="/survey-results" element={<SurveyResult />} />
            <Route path="/payment-list" element={<PaymentList />} />
            <Route path="/inventory" element={<Inventory />} />
          </Route>

          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/staff" element={<StaffPage />} />

            <Route path="/repairs" element={<PublicTrackPage />} />
            <Route path="/repairs/completed" element={<PublicTrackRelease />} />
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
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
