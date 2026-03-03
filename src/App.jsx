import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MainLayout from "./layouts/MainLayout";
import PublicLayout from "./layouts/PublicLayout";

import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import SurveyPage from "./pages/SurveyPage";
import ContactPage from "./pages/ContactPage";
import VehiclePage from "./pages/Vehicles";
import TransactionsPage from "./pages/TransactionsPage";
import InquiryPage from "./pages/InquiryPage";
import RequestVehiclePage from "./pages/RequestVehiclePage";
import NotFoundPage from "./pages/NotFoundPage";
import Drivers from "./pages/Drivers";
import RequestInputPage from "./pages/RequestInput";
import DriverMonitoringPage from "./pages/DriverMonitoringPage";
import VehicleMonitoringPage from "./pages/VehicleMonitoringPage";
import VehicleStatusPage from "./pages/VehicleStatusPage";
import MoreInfoPage from "./pages/MoreInfoPage";
import ManageRequestsPage from "./pages/ManageRequestPage";
import AdminDashboard from "./pages/AdminDashboard";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/inquiry" element={<InquiryPage />} />
          <Route path="/vehicles" element={<VehiclePage />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/drivermonitoring" element={<DriverMonitoringPage />} />
          <Route
            path="/vehiclemonitoring"
            element={<VehicleMonitoringPage />}
          />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/vehiclestatusqueue" element={<VehicleStatusPage />} />
          <Route path="/manage-requests" element={<ManageRequestsPage />} />
          <Route path="/moreinfo/:id" element={<MoreInfoPage />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/requestinput" element={<RequestInputPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/request-vehicle" element={<RequestVehiclePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
