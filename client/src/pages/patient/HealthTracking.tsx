import { useAuth } from '../../contexts/AuthContext';
import { User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PatientData {
  nom: string;
  prenom: string;
}

export default function HealthTracking() {
  const { user } = useAuth();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/users/patient/${user?.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }
        const data = await response.json();
        setPatientData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPatientData();
    }
  }, [user?.id]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Suivi de Santé</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
            <User className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {patientData?.prenom} {patientData?.nom}
            </h2>
            <p className="text-sm text-gray-500">ID Patient: {user?.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}