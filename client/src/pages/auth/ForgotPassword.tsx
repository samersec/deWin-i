import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import logo from '../../image/Dewini.png';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          text: 'Un email de réinitialisation a été envoyé à votre adresse email.',
          type: 'success',
        });
      } else {
        setMessage({
          text: data.message || 'Une erreur est survenue.',
          type: 'error',
        });
      }
    } catch (error) {
      setMessage({
        text: 'Erreur de connexion au serveur.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo" className="h-50 w-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Réinitialisation du mot de passe</h2>
          <p className="text-gray-600 mt-2 text-center">
            Entrez votre adresse email pour recevoir un lien de réinitialisation
          </p>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-md text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                required
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/login/patient"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  );
} 