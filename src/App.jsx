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
import DriverMonitoringPage from "./pages/DriverMonitoringPage";
import VehicleMonitoringPage from "./pages/VehicleMonitoringPage";
import VehicleStatusPage from "./pages/VehicleStatusPage";
function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/inquiry" element={<InquiryPage />} />
          <Route path="/vehicles" element={<VehiclePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/drivermonitoring" element={<DriverMonitoringPage />} />
          <Route path="/vehiclemonitoring" element={<VehicleMonitoringPage />}  />
          <Route path="/vehiclestatusqueue" element={<VehicleStatusPage />} />
          <Route path="/" element={<HomePage />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/request-vehicle" element={<RequestVehiclePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
