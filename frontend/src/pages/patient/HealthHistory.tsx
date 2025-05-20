import  { useState } from 'react';
import { Calendar, Clock, AlertCircle, FolderOpen, ChevronDown, ChevronRight } from 'lucide-react';

export default function HealthHistory() {
  const [openFolders, setOpenFolders] = useState<string[]>(['common']);

  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const medicalFolders = [
    {
      id: 'common',
      name: 'Maladies ordinaires',
      records: [
        {
          id: 1,
          date: '2024-02-15',
          title: 'Grippe saisonnière',
          doctor: 'Dr. Sarah Ben Ali',
          symptoms: ['Fièvre', 'Toux', 'Fatigue'],
          treatment: 'Paracétamol, repos',
          duration: '5 jours'
        },
        {
          id: 2,
          date: '2024-01-20',
          title: 'Gastro-entérite',
          doctor: 'Dr. Mohamed Karray',
          symptoms: ['Nausées', 'Douleurs abdominales'],
          treatment: 'Régime alimentaire, hydratation',
          duration: '3 jours'
        }
      ]
    },
    {
      id: 'chronic',
      name: 'Maladies chroniques',
      records: [
        {
          id: 3,
          date: '2023-12-10',
          title: 'Suivi Diabète Type 2',
          doctor: 'Dr. Leila Mansour',
          measurements: 'Glycémie: 6.8 mmol/L',
          treatment: 'Metformine 1000mg',
          nextAppointment: '2024-03-10'
        }
      ]
    },
    {
      id: 'surgical',
      name: 'Interventions chirurgicales',
      records: [
        {
          id: 4,
          date: '2023-08-15',
          title: 'Appendicectomie',
          surgeon: 'Dr. Karim Benali',
          hospital: 'Clinique Les Oliviers',
          followUp: 'Cicatrisation normale',
          documents: ['Compte rendu opératoire', 'Radiographie post-op']
        }
      ]
    },
    {
      id: 'intensive',
      name: 'Traitement lourd',
      records: [
        {
          id: 5,
          date: '2023-06-01',
          title: 'Traitement Physiothérapie',
          therapist: 'Dr. Amira Slim',
          condition: 'Rééducation post-accident',
          sessions: '12 séances',
          progress: 'Amélioration mobilité 70%'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Historique Médical</h1>

      <div className="grid grid-cols-1 gap-6">
        {medicalFolders.map((folder) => (
          <div key={folder.id} className="bg-white rounded-lg shadow">
            <button
              onClick={() => toggleFolder(folder.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FolderOpen className="h-6 w-6 text-indigo-600" />
                <h2 className="text-lg font-medium text-gray-900">{folder.name}</h2>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {folder.records.length}
                </span>
              </div>
              {openFolders.includes(folder.id) ? (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {openFolders.includes(folder.id) && (
              <div className="px-6 pb-4 space-y-4">
                {folder.records.map((record) => (
                  <div key={record.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{record.title}</h3>
                        <p className="text-sm text-gray-500">Date: {record.date}</p>
                      </div>
                      <button className="text-sm text-indigo-600 hover:text-indigo-800">
                        Voir détails
                      </button>
                    </div>

                    <div className="mt-2 space-y-2">
                      {/* Common Illnesses */}
                      {'symptoms' in record && (
                        <>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Symptômes:</span>{' '}
                            {record.symptoms.join(', ')}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Traitement:</span> {record.treatment}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Durée:</span> {record.duration}
                          </p>
                        </>
                      )}

                      {/* Chronic Diseases */}
                      {'measurements' in record && (
                        <>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Mesures:</span> {record.measurements}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Traitement:</span> {record.treatment}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Prochain RDV:</span> {record.nextAppointment}
                          </p>
                        </>
                      )}

                      {/* Surgical Interventions */}
                      {'surgeon' in record && (
                        <>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Chirurgien:</span> {record.surgeon}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Hôpital:</span> {record.hospital}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Suivi:</span> {record.followUp}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {record.documents.map((doc, index) => (
                              <button
                                key={index}
                                className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-100"
                              >
                                {doc}
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      {/* Intensive Treatments */}
                      {'therapist' in record && (
                        <>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Thérapeute:</span> {record.therapist}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Condition:</span> {record.condition}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Sessions:</span> {record.sessions}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Progrès:</span> {record.progress}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}