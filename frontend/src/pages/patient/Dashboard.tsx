import { Routes, Route } from 'react-router-dom';
import PatientLayout from '../../components/layouts/PatientLayout';
import Documents from './Documents';
import HealthHistory from './HealthHistory';
import HealthTracking from './HealthTracking';
import Communication from './Communication';
import Education from './Education';
import DoctorChatbot from '../../components/layouts/DoctorChatbot';

export default function PatientDashboard() {
  return (
    <PatientLayout>
      <Routes>
        <Route path="/" element={<HealthTracking />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/history" element={<HealthHistory />} />
        <Route path="/communication" element={<Communication />} />
        <Route path="/education" element={<Education />} />
        <Route path="/find-doctor" element={<DoctorChatbot />} />
      </Routes>
    </PatientLayout>
  );
}