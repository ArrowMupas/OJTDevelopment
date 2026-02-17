import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />{" "}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
