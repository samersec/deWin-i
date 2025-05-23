import React, { useState } from 'react';
import { Brain, List, AlertTriangle, CheckCircle2, ArrowRight, Activity, Thermometer, Heart } from 'lucide-react';
import { analyzeSymptomsWithModel } from '../../api/diagnostic';

export default function DecisionSupport() {
  const [symptoms, setSymptoms] = useState<string>('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;
    
    setIsAnalyzing(true);
    setShowResults(false);
    try {
      const results = await analyzeSymptomsWithModel(symptoms);
      setSuggestions(results.map(result => ({
        ...result,
        recommendations: getRecommendations(result.condition),
        medications: getMedications(result.condition)
      })));
      setShowResults(true);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRecommendations = (condition: string) => {
    const recommendationsMap: { [key: string]: string[] } = {
      'Hypertension': [
        'Mesure régulière de la tension artérielle',
        'Régime pauvre en sel',
        'Exercice physique modéré'
      ],
      'Infection Respiratoire': [
        'Repos',
        'Hydratation importante',
        'Surveillance de la température'
      ],
      'Migraine': [
        'Repos dans un endroit calme et sombre',
        'Éviter les déclencheurs',
        'Gestion du stress'
      ],
      'Pneumonie': [
        'Repos strict',
        'Surveillance de la température',
        'Hydratation importante'
      ]
    };
    return recommendationsMap[condition] || [];
  };

  const getMedications = (condition: string) => {
    const medicationsMap: { [key: string]: string[] } = {
      'Hypertension': ['Inhibiteurs de l\'ECA', 'Diurétiques'],
      'Infection Respiratoire': ['Antibiotiques', 'Antitussifs'],
      'Migraine': ['Triptans', 'Anti-inflammatoires'],
      'Pneumonie': ['Antibiotiques', 'Antipyrétiques']
    };
    return medicationsMap[condition] || [];
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'moderate':
        return <Activity className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Aide à la Décision</h1>

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-6 w-6 text-indigo-600" />
          <h2 className="text-lg font-medium">Analyse des Symptômes</h2>
        </div>

        <div className="mb-4">
          <textarea
            placeholder="Décrivez les symptômes du patient (séparés par des virgules)..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
          <button
            onClick={analyzeSymptoms}
            disabled={isAnalyzing}
            className="mt-2 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isAnalyzing ? 'Analyse en cours...' : 'Analyser les Symptômes'}
          </button>
        </div>

        {/* Analysis Results */}
        {showResults && (
          <div className="mt-6 space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Résultats de l'Analyse
              </h3>
              <p className="text-sm text-gray-600">
                Basé sur les symptômes: <span className="font-medium">{symptoms}</span>
              </p>
            </div>

            {suggestions.length > 0 ? (
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className={`border-l-4 ${getUrgencyColor(suggestion.urgency)} bg-white rounded-lg shadow-sm p-4`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getUrgencyIcon(suggestion.urgency)}
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            {suggestion.condition}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(suggestion.urgency)}`}>
                            Confiance: {suggestion.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-8 space-y-3">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-1">
                          Recommandations:
                        </h5>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {suggestion.recommendations.map((rec: string, idx: number) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-1">
                          Médicaments suggérés:
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {suggestion.medications.map((med: string, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {med}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                <p className="text-gray-600">
                  Aucun diagnostic possible avec les symptômes fournis.
                  Veuillez fournir plus de détails ou consulter directement un médecin.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}