import { Routes, Route } from 'react-router-dom';
import DoctorLayout from '../../components/layouts/DoctorLayout';
import PatientRecords from './PatientRecords';
import Appointments from './Appointments';
import DecisionSupport from './DecisionSupport';
import RemoteMonitoring from './RemoteMonitoring';
import Analytics from './Analytics';

export default function DoctorDashboard() {
  return (
    <DoctorLayout>
      <Routes>
        <Route path="/" element={< Analytics />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/decision-support" element={<DecisionSupport />} />
        <Route path="/remote-monitoring" element={<RemoteMonitoring />} />
        <Route path="/patientrecords" element={<PatientRecords />} />
      </Routes>
    </DoctorLayout>
  );
}