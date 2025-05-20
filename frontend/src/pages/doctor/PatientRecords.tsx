import React, { useState } from 'react';
import { FolderOpen, ChevronDown, ChevronRight, Search, UserPlus, FileText, X } from 'lucide-react';

export default function PatientRecords() {
  const [openFolders, setOpenFolders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; content: string } | null>(null);

  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const patients = [
    {
      id: 'p1',
      name: 'Ahmed Ben Salem',
      dateOfBirth: '1985-03-15',
      ficheDePassation: {
        id: 'PAT123456',
        bloodGroup: 'A+',
        currentIllnesses: ['Hypertension', 'Diabète de type 2'],
        ongoingTreatments: ['Médicament A', 'Médicament B']
      },
      folders: [
        {
          id: 'f1',
          name: 'Dossier Médical',
          documents: [
            { id: 'd1', name: 'Historique Médical', date: '2024-02-20', content: 'Détails complets de l\'historique médical du patient.' },
            { id: 'd2', name: 'Analyses Sanguines', date: '2024-02-15', content: 'Résultats des analyses sanguines récentes.' },
          ],
          subfolders: [
            {
              id: 'f2',
              name: 'Ordonnances',
              documents: [
                { id: 'd3', name: 'Ordonnance - Fév 2024', date: '2024-02-20', content: 'Ordonnance détaillée pour février 2024.' },
                { id: 'd4', name: 'Ordonnance - Jan 2024', date: '2024-01-15', content: 'Ordonnance détaillée pour janvier 2024.' },
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'p2',
      name: 'Sarah Mansour',
      dateOfBirth: '1990-07-22',
      ficheDePassation: {
        id: 'PAT123456',
        bloodGroup: 'O-',
        currentIllnesses: ['Asthme'],
        ongoingTreatments: ['Médicament C']
      },
      folders: [
        {
          id: 'f3',
          name: 'Dossier Médical',
          documents: [
            { id: 'd5', name: 'Historique Médical', date: '2024-02-18', content: 'Détails complets de l\'historique médical du patient.' },
            { id: 'd6', name: 'Radiographie', date: '2024-02-10', content: 'Résultats de la radiographie récente.' },
          ],
          subfolders: [
            {
              id: 'f4',
              name: 'Ordonnances',
              documents: [
                { id: 'd7', name: 'Ordonnance - Fév 2024', date: '2024-02-18', content: 'Ordonnance détaillée pour février 2024.' },
              ]
            }
          ]
        }
      ]
    }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDocumentClick = (document: { name: string; content: string }) => {
    setSelectedDocument(document);
  };

  const closeDocumentModal = () => {
    setSelectedDocument(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dossiers Patients</h1>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher un patient..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <UserPlus className="h-5 w-5" />
          Nouveau Patient
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="bg-white rounded-lg shadow">
            <button
              onClick={() => toggleFolder(patient.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FolderOpen className="h-6 w-6 text-indigo-600" />
                <div className="text-left">
                  <h2 className="text-lg font-medium text-gray-900">{patient.name}</h2>
                  <p className="text-sm text-gray-500">Né(e) le: {patient.dateOfBirth}</p>
                </div>
              </div>
              {openFolders.includes(patient.id) ? (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {openFolders.includes(patient.id) && (
              <div className="px-6 pb-4">
                <div className="mt-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Fiche de Passation</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Groupe Sanguin</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Maladies Actuelles</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Traitements en Cours</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="px-4 py-2 text-sm text-gray-900">{patient.ficheDePassation.id}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{patient.ficheDePassation.bloodGroup}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{patient.ficheDePassation.currentIllnesses.join(', ')}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{patient.ficheDePassation.ongoingTreatments.join(', ')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {patient.folders.map((folder) => (
                  <div key={folder.id} className="mt-4">
                    <button
                      onClick={() => toggleFolder(folder.id)}
                      className="w-full flex items-center justify-between mb-2"
                    >
                      <h3 className="text-md font-medium text-gray-900">{folder.name}</h3>
                      {openFolders.includes(folder.id) ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    {openFolders.includes(folder.id) && (
                      <div className="space-y-2">
                        {folder.documents.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => handleDocumentClick({ name: doc.name, content: doc.content })}
                            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                <p className="text-xs text-gray-500">{doc.date}</p>
                              </div>
                            </div>
                            <span className="text-sm text-indigo-600 hover:text-indigo-800">
                              Ouvrir
                            </span>
                          </button>
                        ))}

                        {folder.subfolders?.map((subfolder) => (
                          <div key={subfolder.id} className="mt-4">
                            <button
                              onClick={() => toggleFolder(subfolder.id)}
                              className="w-full flex items-center justify-between mb-2"
                            >
                              <h3 className="text-md font-medium text-gray-900">{subfolder.name}</h3>
                              {openFolders.includes(subfolder.id) ? (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              )}
                            </button>

                            {openFolders.includes(subfolder.id) && (
                              <div className="space-y-2">
                                {subfolder.documents.map((doc) => (
                                  <button
                                    key={doc.id}
                                    onClick={() => handleDocumentClick({ name: doc.name, content: doc.content })}
                                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <FileText className="h-5 w-5 text-gray-400" />
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                        <p className="text-xs text-gray-500">{doc.date}</p>
                                      </div>
                                    </div>
                                    <span className="text-sm text-indigo-600 hover:text-indigo-800">
                                      Ouvrir
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for displaying document details */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{selectedDocument.name}</h2>
              <button onClick={closeDocumentModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="text-gray-700">
              <p>{selectedDocument.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}