import { Heart, Activity, Thermometer, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

export default function RemoteMonitoring() {
  const patients = [
    {
      id: 1,
      name: 'Ahmed Ben Salem',
      vitals: {
        heartRate: { value: 72, trend: 'stable' },
        bloodPressure: { value: '120/80', trend: 'up' },
        temperature: { value: 37.2, trend: 'stable' },
        lastUpdate: '2 min ago'
      },
      alerts: []
    },
    {
      id: 2,
      name: 'Sarah Mansour',
      vitals: {
        heartRate: { value: 88, trend: 'up' },
        bloodPressure: { value: '140/90', trend: 'up' },
        temperature: { value: 38.5, trend: 'up' },
        lastUpdate: '5 min ago'
      },
      alerts: ['Température élevée', 'Tension artérielle élevée']
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-green-500 transform rotate-180" />;
      default:
        return <TrendingUp className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Suivi à Distance</h1>

      <div className="grid grid-cols-1 gap-6">
        {patients.map((patient) => (
          <div key={patient.id} className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-medium text-gray-900">{patient.name}</h2>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{patient.vitals.lastUpdate}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span className="text-sm font-medium text-gray-700">Fréquence Cardiaque</span>
                    </div>
                    {getTrendIcon(patient.vitals.heartRate.trend)}
                  </div>
                  <p className="text-2xl font-semibold mt-2">{patient.vitals.heartRate.value} bpm</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-indigo-500" />
                      <span className="text-sm font-medium text-gray-700">Tension Artérielle</span>
                    </div>
                    {getTrendIcon(patient.vitals.bloodPressure.trend)}
                  </div>
                  <p className="text-2xl font-semibold mt-2">{patient.vitals.bloodPressure.value} mmHg</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-5 w-5 text-orange-500" />
                      <span className="text-sm font-medium text-gray-700">Température</span>
                    </div>
                    {getTrendIcon(patient.vitals.temperature.trend)}
                  </div>
                  <p className="text-2xl font-semibold mt-2">{patient.vitals.temperature.value}°C</p>
                </div>
              </div>

              {patient.alerts.length > 0 && (
                <div className="mt-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-red-800">Alertes</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      {patient.alerts.map((alert, index) => (
                        <li key={index} className="text-sm text-red-700">{alert}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}