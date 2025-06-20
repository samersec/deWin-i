import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, isDoctorLogin: boolean) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);



export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load user from localStorage on first mount
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, isDoctorLogin: boolean) => {
    try {
      setError(null);
      console.log('Attempting login for:', email, 'as', isDoctorLogin ? 'doctor' : 'patient');
      
      const response = await fetch('http://localhost:8081/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      
      const responseData = await response.json();
      console.log('Login response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Erreur d\'authentification');
      }

      if (!responseData.user || typeof responseData.user !== 'object') {
        console.error('Invalid response format:', responseData);
        throw new Error('Format de réponse invalide');
      }

      const userData = responseData.user;

      if (!userData.role) {
        console.error('No role found in user data:', userData);
        throw new Error('Rôle utilisateur manquant');
      }

      // Check login role
      const userRole = userData.role.toLowerCase();
      console.log('User role:', userRole, 'Expected role:', isDoctorLogin ? 'medecin' : 'patient');
      
      if ((isDoctorLogin && userRole !== 'medecin') || (!isDoctorLogin && userRole !== 'patient')) {
        throw new Error('Veuillez utiliser la page de connexion appropriée');
      }

      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));

      // Navigate to the correct dashboard
      if (userRole === 'medecin') {
        navigate('/doctor');
      } else if (userRole === 'patient') {
        navigate('/patient');
      } else {
        throw new Error('Rôle non reconnu');
      }
    } catch (error: any) {
      console.error('Login error details:', error);
      const errorMessage = error.message || 'Erreur de connexion';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('authUser');
    navigate('/login/patient');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};
