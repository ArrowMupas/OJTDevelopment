import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import DashboardPage from "./pages/home/DashboardPage";
import ContactPage from "./pages/ContactPage";
import MaintenancePage from "./pages/MaintenancePage";
import TransactionsPage from "./pages/TransactionsPage";
import NotFoundPage from "./pages/NotFoundPage";
import MainLayout from "./layouts/MainLayout";
import Drivers from "./pages/Drivers";
import DriverMonitoringPage from "./pages/home/DriverMonitoringPage";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
         <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
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
