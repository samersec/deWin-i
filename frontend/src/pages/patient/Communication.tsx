import React, { useState } from 'react';
import { MessageSquare, Video, Send } from 'lucide-react';

export default function Communication() {
  const [message, setMessage] = useState('');

  const conversations = [
    {
      id: 1,
      doctor: 'Dr. Sarah Ben Ali',
      lastMessage: 'Comment vous sentez-vous aujourd\'hui ?',
      time: '10:30',
      unread: true,
    },
    {
      id: 2,
      doctor: 'Dr. Mohamed Karray',
      lastMessage: 'Vos résultats d\'analyse sont normaux.',
      time: 'Hier',
      unread: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Communication</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          <Video className="inline-block w-5 h-5 mr-2" />
          Nouvelle Consultation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Conversations</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{conv.doctor}</p>
                    <p className="text-sm text-gray-500">{conv.time}</p>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread && (
                  <span className="ml-3 flex-shrink-0 h-2 w-2 rounded-full bg-indigo-600"></span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Dr. Sarah Ben Ali</h2>
                <p className="text-sm text-gray-500">Médecin Généraliste</p>
              </div>
              <button className="px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-md">
                <Video className="inline-block w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="flex items-end">
              <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-md">
                <p className="text-sm text-gray-900">Comment vous sentez-vous aujourd'hui ?</p>
                <p className="text-xs text-gray-500 mt-1">10:30</p>
              </div>
            </div>

            <div className="flex items-end justify-end">
              <div className="bg-indigo-600 text-white rounded-lg px-4 py-2 max-w-md">
                <p className="text-sm">Je me sens beaucoup mieux, merci docteur.</p>
                <p className="text-xs opacity-75 mt-1">10:35</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}