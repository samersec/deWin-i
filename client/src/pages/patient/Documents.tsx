import React, { useState } from 'react';
import { FileText, Upload, Search, Camera } from 'lucide-react';
import Tesseract from 'tesseract.js';

export default function Documents() {
  const [scanning, setScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const documents = [
    { id: 1, name: 'Résultats Analyses Sang', date: '2024-02-15', type: 'Analyse' },
    { id: 2, name: 'Ordonnance Antibiotiques', date: '2024-02-10', type: 'Ordonnance' },
    { id: 3, name: 'Radiographie Thorax', date: '2024-02-01', type: 'Imagerie' },
  ];

  const handleScan = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setScanning(true);
    try {
      const result = await Tesseract.recognize(file, 'fra');
      console.log('Scanned text:', result.data.text);
      // Handle the scanned text
    } catch (error) {
      console.error('Scanning error:', error);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Documents de Santé</h1>
        <div className="flex space-x-4">
          <label className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer">
            <input type="file" className="hidden" onChange={handleScan} accept="image/*" />
            <Camera className="inline-block w-5 h-5 mr-2" />
            Scanner
          </label>
          <label className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer">
            <input type="file" className="hidden" />
            <Upload className="inline-block w-5 h-5 mr-2" />
            Télécharger
          </label>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher un document..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {documents.map((doc) => (
            <li key={doc.id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-indigo-600" />
                    <div className="ml-4">
                      <p className="font-medium text-indigo-600 truncate">{doc.name}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {doc.type} • {doc.date}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0">
                  <button className="text-indigo-600 hover:text-indigo-900">
                    Télécharger
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {scanning && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p className="text-lg font-medium">Scan en cours...</p>
          </div>
        </div>
      )}
    </div>
  );
}