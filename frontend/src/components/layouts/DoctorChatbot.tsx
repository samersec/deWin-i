import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, MapPin, History } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface DoctorRecommendation {
  name: string;
  specialty: string;
  location: string;
  distance: string;
  rating: number;
  matchScore: number;
  availableSlot: string;
}

export default function DoctorChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Bonjour! Je peux vous aider à trouver un médecin adapté à vos besoins. Quels sont vos symptômes?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recommendations, setRecommendations] = useState<DoctorRecommendation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate AI response based on user input
  const generateRecommendations = async (_inputValue?: string) => {
    setIsTyping(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock recommendations based on symptoms
    const mockRecommendations: DoctorRecommendation[] = [
      {
        name: 'Dr. Sarah Ben Ali',
        specialty: 'Médecin Généraliste',
        location: 'Centre Médical Ariana',
        distance: '2.5 km',
        rating: 4.8,
        matchScore: 95,
        availableSlot: 'Aujourd\'hui 14:30'
      },
      {
        name: 'Dr. Mohamed Karray',
        specialty: 'Médecin Interniste',
        location: 'Clinique Les Oliviers',
        distance: '3.8 km',
        rating: 4.6,
        matchScore: 88,
        availableSlot: 'Demain 10:15'
      }
    ];

    setRecommendations(mockRecommendations);
    
    const response = `D'après vos symptômes et votre historique médical, voici les médecins que je recommande. Ces recommandations prennent en compte votre localisation et vos préférences.`;
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date()
    }]);

    setIsTyping(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Generate AI response
    await generateRecommendations(inputValue);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-indigo-600" />
          <h2 className="text-lg font-medium text-gray-900">Assistant Médical</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
          <span>Tunis, Tunisie</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-75">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {recommendations.length > 0 && (
          <div className="space-y-4 mt-4">
            {recommendations.map((doc, index) => (
              <div key={index} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-gray-500">{doc.specialty}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-indigo-600">
                      {doc.matchScore}% match
                    </span>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {doc.location} • {doc.distance}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <History className="h-4 w-4 mr-1" />
                    Disponible: {doc.availableSlot}
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors">
                    Prendre RDV
                  </button>
                  <button className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md text-sm hover:bg-indigo-50 transition-colors">
                    Voir profil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Décrivez vos symptômes..."
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}