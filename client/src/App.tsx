import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PatientDashboard from './pages/patient/Dashboard';
import DoctorDashboard from './pages/doctor/Dashboard';
import PatientLogin from './pages/auth/PatientLogin';
import DoctorLogin from './pages/auth/DoctorLogin';
import PatientSignup from './pages/auth/PatientSignup';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login/patient" element={<PatientLogin />} />
          <Route path="/login/medecin" element={<DoctorLogin />} />
          <Route path="/signup/patient" element={<PatientSignup />} />
          <Route 
            path="/patient/*" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/*" 
            element={
              <ProtectedRoute allowedRoles={['medecin']}>
                <DoctorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/login/patient" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;


