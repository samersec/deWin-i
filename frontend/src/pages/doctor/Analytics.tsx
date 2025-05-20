import { BarChart, Calendar, Users, TrendingUp, PieChart } from 'lucide-react';

export default function Analytics() {
  const statistics = {
    consultations: {
      total: 245,
      trend: '+12%',
      period: 'ce mois'
    },
    patients: {
      total: 180,
      trend: '+5%',
      period: 'ce mois'
    },
    satisfaction: {
      score: 4.8,
      responses: 150,
      period: 'ce mois'
    }
  };

  const trends = [
    { name: 'Consultations', data: [30, 40, 35, 50, 49, 60, 70, 91, 125] },
    { name: 'Nouveaux Patients', data: [20, 25, 30, 35, 25, 40, 50, 60, 75] }
  ];

  const patientDistribution = [
    { age: '0-18', percentage: 15 },
    { age: '19-30', percentage: 25 },
    { age: '31-50', percentage: 35 },
    { age: '51+', percentage: 25 }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Analyses</h1>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-indigo-600" />
              <h3 className="text-lg font-medium text-gray-900">Consultations</h3>
            </div>
            <span className="text-sm text-green-600">{statistics.consultations.trend}</span>
          </div>
          <p className="mt-2 text-3xl font-semibold">{statistics.consultations.total}</p>
          <p className="text-sm text-gray-500">{statistics.consultations.period}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-indigo-600" />
              <h3 className="text-lg font-medium text-gray-900">Patients Actifs</h3>
            </div>
            <span className="text-sm text-green-600">{statistics.patients.trend}</span>
          </div>
          <p className="mt-2 text-3xl font-semibold">{statistics.patients.total}</p>
          <p className="text-sm text-gray-500">{statistics.patients.period}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
              <h3 className="text-lg font-medium text-gray-900">Satisfaction</h3>
            </div>
          </div>
          <p className="mt-2 text-3xl font-semibold">{statistics.satisfaction.score}/5</p>
          <p className="text-sm text-gray-500">{statistics.satisfaction.responses} réponses</p>
        </div>
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart className="h-6 w-6 text-indigo-600" />
            <h2 className="text-lg font-medium">Tendances</h2>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg p-4">
            {/* Placeholder for chart */}
            <div className="h-full flex items-center justify-center text-gray-500">
              Graphique des tendances
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="h-6 w-6 text-indigo-600" />
            <h2 className="text-lg font-medium">Distribution des Patients</h2>
          </div>
          <div className="space-y-4">
            {patientDistribution.map((group, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{group.age} ans</span>
                  <span>{group.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${group.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}