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
      const response = await fetch('http://localhost:8081/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || 'Invalid credentials');
      }

      const userData = await response.json();

      // Check login role
      const userRole = userData.role.toLowerCase();
      if ((isDoctorLogin && userRole !== 'medecin') || (!isDoctorLogin && userRole !== 'patient')) {
        throw new Error('Veuillez utiliser la page de connexion appropriée');
      }

      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData)); // Save to localStorage

      // Navigate to the correct dashboard
      if (userRole === 'medecin') {
        navigate('/doctor');
      } else if (userRole === 'patient') {
        navigate('/patient');
      } else {
        setError('Rôle non reconnu');
      }
    } catch (error: any) {
      setError(error.message || 'Erreur de connexion');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('authUser'); // Remove from localStorage
    navigate('/login/patient');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};
