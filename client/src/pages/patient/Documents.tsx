import React, { useState, useEffect } from 'react';
import { FileText, Upload, Search, Camera, X, Image as ImageIcon } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { useAuth } from '../../contexts/AuthContext';

interface Document {
  _id: string;
  titre: string;
  type: string;
  urlFichier: string;
  dateUpload: string;
  userId: string;
}

export default function Documents() {
  const [scanning, setScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    titre: '',
    type: 'Analyse',
    file: null as File | null,
    dateUpload: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    console.log('Component mounted, user:', user);
    fetchDocuments();
  }, [user]);

  const fetchDocuments = async () => {
    try {
      console.log('Fetching documents for user:', user?.id);
      setLoading(true);
      
      const url = `http://localhost:8081/api/documents/user/${user?.id}`;
      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch documents: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      setDocuments(data);
      setError(null);
    } catch (err) {
      console.error('Error in fetchDocuments:', err);
      setError(err instanceof Error ? err.message : 'Error loading documents');
    } finally {
      setLoading(false);
    }
  };

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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('titre', formData.titre);
    data.append('type', formData.type);
    data.append('dateUpload', formData.dateUpload);
    data.append('userId', user?.id || '');
    if (formData.file) {
      data.append('file', formData.file);
    }

    try {
      const response = await fetch('http://localhost:8081/api/documents/upload', {
        method: 'POST',
        body: data,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload');
      }

      const result = await response.json();
      setDocuments(prev => [...prev, result.document]);
      setIsModalOpen(false);
      setFormData({
        titre: '',
        type: 'Analyse',
        file: null,
        dateUpload: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Upload error:', error);
      setError('Error uploading document');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8081/api/documents/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      setDocuments(prev => prev.filter(doc => doc._id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      setError('Error deleting document');
    }
  };

  const handleDownload = async (documentId: string, titre: string) => {
    try {
      console.log('Attempting to download document:', { documentId, titre });
      
      if (!documentId) {
        throw new Error('Document ID is missing');
      }

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = `http://localhost:8081/api/documents/download/${documentId}`;
      link.download = titre; // Use the document title as the filename
      link.target = '_blank'; // Open in new tab
      link.rel = 'noopener noreferrer';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Download initiated');
    } catch (error) {
      console.error('Download error:', error);
      setError(error instanceof Error ? error.message : 'Error downloading document');
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
          >
            <Upload className="inline-block w-5 h-5 mr-2" />
            Télécharger
          </button>
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">
          <p>Chargement des documents...</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredDocuments.map((doc) => (
              <li key={doc._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-gray-400" />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{doc.titre}</h3>
                      <p className="text-sm text-gray-500">{doc.type}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(doc.dateUpload).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(doc._id, doc.titre)}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Télécharger
                    </button>
                 
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}


      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Ajouter un document</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Titre</label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleFormChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="Analyse">Analyse</option>
                  <option value="Ordonnance">Ordonnance</option>
                  <option value="Imagerie">Imagerie</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <label className="flex items-center space-x-2 cursor-pointer px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <ImageIcon className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm text-gray-600">
                    {formData.file ? formData.file.name : "Choisir une image"}
                  </span>
                  <input
                    type="file"
                    name="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    required
                  />
                </label>
                {formData.file && (
                  <p className="mt-1 text-sm text-gray-500">
                    Fichier sélectionné: {formData.file.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="dateUpload"
                  value={formData.dateUpload}
                  onChange={handleFormChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}