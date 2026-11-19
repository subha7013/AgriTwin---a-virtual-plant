
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Plants from "./pages/Plants";
import PlantDetails from "./pages/PlantDetails";
import DigitalTwin from "./pages/DigitalTwin";
import LiveMonitoring from "./pages/LiveMonitoring";
import DiseaseDetection from "./pages/DiseaseDetection";
import RiskPrediction from "./pages/RiskPrediction";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/plants" element={<Plants />} />

          <Route path="/plant-details" element={<PlantDetails />} />

          <Route path="/digital-twin" element={<DigitalTwin />} />

          <Route path="/live-monitoring" element={<LiveMonitoring />} />

          <Route path="/disease-detection" element={<DiseaseDetection />} />

          <Route path="/risk-prediction" element={<RiskPrediction />} />

          <Route path="/analytics" element={<Analytics />} />

          <Route path="/alerts" element={<Alerts />} />

          <Route path="/settings" element={<Settings />} />

        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
