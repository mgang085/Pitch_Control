import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { divisionsAPI, standingsAPI } from '../services/api';

export const Standings = () => {
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDivisions();
  }, []);

  useEffect(() => {
    if (selectedDivision) {
      loadStandings(selectedDivision);
    }
  }, [selectedDivision]);

  const loadDivisions = async () => {
    try {
      const response = await divisionsAPI.getAll();
      setDivisions(response.data);
      if (response.data.length > 0) {
        setSelectedDivision(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to load divisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStandings = async (divisionId: string) => {
    try {
      const response = await standingsAPI.get(divisionId);
      setStandings(response.data);
    } catch (error) {
      console.error('Failed to load standings:', error);
      setStandings([]);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">League Standings</h1>

      {loading ? (
        <p className="text-gray-600">Loading standings...</p>
      ) : divisions.length === 0 ? (
        <div className="card text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">No divisions available</h3>
        </div>
      ) : (
        <>
          {/* Division Selector */}
          <div className="card">
            <label className="label">Select Division</label>
            <select
              className="input"
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
            >
              {divisions.map((division: any) => (
                <option key={division.id} value={division.id}>
                  {division.league?.name} - {division.name}
                </option>
              ))}
            </select>
          </div>

          {/* Standings Table */}
          {standings.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600">No standings data available for this division yet.</p>
            </div>
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Pos</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Team</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">P</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">W</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">D</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">L</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">PF</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">PA</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">PD</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((standing: any, index: number) => (
                    <tr key={standing.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 text-center font-bold text-gray-700">{index + 1}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {standing.team?.name}
                      </td>
                      <td className="py-3 px-2 text-center text-gray-700">{standing.played}</td>
                      <td className="py-3 px-2 text-center text-green-600 font-medium">{standing.won}</td>
                      <td className="py-3 px-2 text-center text-gray-700">{standing.drawn}</td>
                      <td className="py-3 px-2 text-center text-red-600 font-medium">{standing.lost}</td>
                      <td className="py-3 px-2 text-center text-gray-700">{standing.pointsFor}</td>
                      <td className="py-3 px-2 text-center text-gray-700">{standing.pointsAgainst}</td>
                      <td className="py-3 px-2 text-center text-gray-700">
                        {standing.pointsDifference > 0 ? '+' : ''}
                        {standing.pointsDifference}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-primary-600">
                        {standing.totalPoints}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 text-xs text-gray-600">
                <p>P = Played, W = Won, D = Drawn, L = Lost, PF = Points For, PA = Points Against, PD = Points Difference, Pts = Total Points</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
