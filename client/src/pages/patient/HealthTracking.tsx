import { useAuth } from '../../contexts/AuthContext';
import { User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PatientData {
  nom: string;
  prenom: string;
}

export default function HealthTracking() {
  const { user } = useAuth(); // Get the logged-in user data

  // Mock data for the patient's health information
  const patientData = {
    avatar: 'https://cdn-icons-png.flaticon.com/512/1430/1430453.png', // Placeholder for avatar URL
    name: `${user?.prenom} ${user?.nom}`, // Use the logged-in user's name
    patientId: 'PAT123456',
    bloodType: 'A+',
    currentIllnesses: ['Hypertension', 'Diabète de type 2'],
    ongoingTreatments: ['Métoprolol 50mg', 'Metformine 500mg'],
    medicationReminders: [
      { id: 1, medication: 'Métoprolol 50mg', time: '08:00', completed: false },
      { id: 2, medication: 'Metformine 500mg', time: '12:00', completed: false },
      { id: 3, medication: 'Métoprolol 50mg', time: '20:00', completed: false },
    ],
  };

  const toggleMedicationReminder = (id: number) => {
    // Logic to toggle the completion status of a medication reminder
    console.log(`Toggled medication reminder with ID: ${id}`);
  };

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