import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Lock, ArrowRight } from 'lucide-react';
import logo from '../../image/Dewini.png';

export default function DoctorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log('Attempting doctor login with email:', email);
      await login(email, password, true);
      console.log('Login successful, navigating to doctor dashboard');
      navigate('/doctor');
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Erreur de connexion. Veuillez vérifier vos identifiants.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mot de passe
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            disabled={isLoading}
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Se souvenir de moi
          </label>
        </div>
        <Link 
          to="/forgot-password" 
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Mot de passe oublié?
        </Link>
      </div>

      <button
        type="submit"
        className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isLoading 
            ? 'bg-indigo-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        }`}
        disabled={isLoading}
      >
        {isLoading ? 'Connexion...' : 'Se connecter'}
        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
      </button>
    </form>
  );
}