import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import SurveyPage from "./pages/SurveyPage"
import ContactPage from "./pages/ContactPage";
import VehiclePage from "./pages/Vehicles";
import TransactionsPage from "./pages/TransactionsPage";
import InquiryPage from "./pages/InquiryPage";
import RequestVehiclePage from "./pages/RequestVehiclePage";
import NotFoundPage from "./pages/NotFoundPage";
import MainLayout from "./layouts/MainLayout";
import Drivers from "./pages/Drivers";
import DriverMonitoringPage from "./pages/DriverMonitoringPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/inquiry" element={<InquiryPage />} />
          <Route path="/request-vehicle" element={<RequestVehiclePage />} />
          <Route path="/vehicles" element={<VehiclePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/drivermonitoring" element={<DriverMonitoringPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
