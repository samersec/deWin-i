import { useAuth } from '../../contexts/AuthContext';
import { User, Pill, HeartPulse, ClipboardList } from 'lucide-react';

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
          <img
            src={patientData.avatar}
            alt="Patient Avatar"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{patientData.name}</h2>
            <p className="text-sm text-gray-500">ID Patient: {patientData.patientId}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <HeartPulse className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-medium text-gray-900">Groupe Sanguin</h3>
            </div>
            <p className="mt-2 text-sm text-gray-700">{patientData.bloodType}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <ClipboardList className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-medium text-gray-900">Maladies Actuelles</h3>
            </div>
            <ul className="mt-2 space-y-1">
              {patientData.currentIllnesses.map((illness, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {illness}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Pill className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-medium text-gray-900">Traitements en Cours</h3>
            </div>
            <ul className="mt-2 space-y-1">
              {patientData.ongoingTreatments.map((treatment, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {treatment}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Rappels de Médicaments</h3>
        <div className="space-y-4">
          {patientData.medicationReminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={reminder.completed}
                  onChange={() => toggleMedicationReminder(reminder.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <div>
                  <p className="font-medium text-gray-900">{reminder.medication}</p>
                  <p className="text-sm text-gray-500">{reminder.time}</p>
                </div>
              </div>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Modifier
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}