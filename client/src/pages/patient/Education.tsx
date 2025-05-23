import React from 'react';
import { BookOpen, Play, ThumbsUp } from 'lucide-react';

export default function Education() {
  const articles = [
    {
      id: 1,
      title: 'Comprendre le Diabète de Type 2',
      category: 'Maladies Chroniques',
      readTime: '5 min',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=500',
    },
    {
      id: 2,
      title: 'Alimentation Équilibrée en Tunisie',
      category: 'Nutrition',
      readTime: '8 min',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=500',
    },
  ];

  const videos = [
    {
      id: 1,
      title: 'Exercices pour le Dos',
      duration: '12 min',
      thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=500',
    },
    {
      id: 2,
      title: 'Techniques de Respiration',
      duration: '8 min',
      thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=500',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Éducation Santé</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Articles Recommandés</h2>
            <BookOpen className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="group cursor-pointer">
                <div className="aspect-w-16 aspect-h-9 mb-2">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="rounded-lg object-cover w-full h-48"
                  />
                </div>
                <div>
                  <span className="text-sm text-indigo-600">{article.category}</span>
                  <h3 className="mt-1 text-lg font-medium text-gray-900 group-hover:text-indigo-600">
                    {article.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">Temps de lecture: {article.readTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Vidéos Éducatives</h2>
            <Play className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {videos.map((video) => (
              <div key={video.id} className="group cursor-pointer">
                <div className="relative aspect-w-16 aspect-h-9 mb-2">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="rounded-lg object-cover w-full h-48"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 rounded-full p-3">
                      <Play className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">Durée: {video.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Ressources Populaires</h2>
          <ThumbsUp className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Guide du Diabète', type: 'PDF', downloads: '1.2k' },
            { title: 'Recettes Santé', type: 'Livre', downloads: '890' },
            { title: 'Exercices Quotidiens', type: 'Programme', downloads: '2.1k' },
          ].map((resource, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">{resource.title}</h3>
              <p className="text-sm text-gray-500 mt-1">Type: {resource.type}</p>
              <p className="text-sm text-gray-500">Téléchargements: {resource.downloads}</p>
              <button className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                Télécharger
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}