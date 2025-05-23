import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PatientDashboard from './pages/patient/Dashboard';
import DoctorDashboard from './pages/doctor/Dashboard';
import PatientLogin from './pages/auth/PatientLogin';
import DoctorLogin from './pages/auth/DoctorLogin';
import PatientSignup from './pages/auth/PatientSignup';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login/patient" element={<PatientLogin />} />
          <Route path="/login/medecin" element={<DoctorLogin />} />
          <Route path="/signup/patient" element={<PatientSignup />} />
          <Route path="/patient/*" element={<PatientDashboard />} />
          <Route path="/doctor/*" element={<DoctorDashboard />} />
          <Route path="/" element={<Navigate to="/login/patient" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;