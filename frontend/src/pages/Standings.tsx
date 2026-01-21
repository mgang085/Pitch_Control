import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { divisionsAPI, standingsAPI, unionsAPI } from '../services/api';

export const Standings = () => {
  const [unions, setUnions] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [filteredDivisions, setFilteredDivisions] = useState<any[]>([]);
  const [selectedUnion, setSelectedUnion] = useState<string>('');
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Filter divisions when union changes
    if (selectedUnion) {
      const filtered = divisions.filter((div: any) => div.leagueId === selectedUnion);
      setFilteredDivisions(filtered);

      // Auto-select first division if available
      if (filtered.length > 0 && !selectedDivision) {
        setSelectedDivision(filtered[0].id);
      } else if (selectedDivision) {
        // Clear division selection if it's not from the selected union
        const divisionValid = filtered.some((div: any) => div.id === selectedDivision);
        if (!divisionValid) {
          setSelectedDivision(filtered.length > 0 ? filtered[0].id : '');
        }
      }
    } else {
      setFilteredDivisions([]);
      setSelectedDivision('');
    }
  }, [selectedUnion, divisions]);

  useEffect(() => {
    if (selectedDivision) {
      loadStandings(selectedDivision);
    } else {
      setStandings([]);
    }
  }, [selectedDivision]);

  const loadData = async () => {
    try {
      const [unionsRes, divisionsRes] = await Promise.all([
        unionsAPI.getAll(),
        divisionsAPI.getAll(),
      ]);

      setUnions(unionsRes.data);
      setDivisions(divisionsRes.data);

      // Auto-select first union if available
      if (unionsRes.data.length > 0) {
        setSelectedUnion(unionsRes.data[0].id);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
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

  const selectedUnionData = unions.find((u: any) => u.id === selectedUnion);
  const selectedDivisionData = filteredDivisions.find((d: any) => d.id === selectedDivision);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BarChart3 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Union Standings</h1>
      </div>

      {loading ? (
        <div className="card">
          <p className="text-gray-600 dark:text-gray-300">Loading standings...</p>
        </div>
      ) : unions.length === 0 ? (
        <div className="card text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No unions available</h3>
          <p className="text-gray-600 dark:text-gray-300">Create a union and division first to view standings.</p>
        </div>
      ) : (
        <>
          {/* Union and Division Selectors */}
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Select Union</label>
                <select
                  className="input"
                  value={selectedUnion}
                  onChange={(e) => setSelectedUnion(e.target.value)}
                >
                  <option value="">Select a union</option>
                  {unions.map((union: any) => (
                    <option key={union.id} value={union.id}>
                      {union.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Select Division</label>
                <select
                  className="input"
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  disabled={!selectedUnion || filteredDivisions.length === 0}
                >
                  <option value="">
                    {!selectedUnion
                      ? 'Select a union first'
                      : filteredDivisions.length === 0
                      ? 'No divisions in this union'
                      : 'Select a division'}
                  </option>
                  {filteredDivisions.map((division: any) => (
                    <option key={division.id} value={division.id}>
                      {division.name} {division.type && `(${division.type})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedUnionData && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Point Settings for {selectedUnionData.name}</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Win:</span>{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedUnionData.winPoints} pts</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Draw:</span>{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedUnionData.drawPoints} pts</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Loss:</span>{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedUnionData.lossPoints} pts</span>
                  </div>
                  <div className="col-span-3 mt-2">
                    <span className="text-gray-600 dark:text-gray-400">Bonus Points:</span>{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedUnionData.bonusPointsForTries} pt for {selectedUnionData.minimumTriesForBonus}+ tries
                    </span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedUnionData.bonusPointsForLosingMargin} pt for losing by ≤{selectedUnionData.maximumLosingMarginForBonus} points
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Standings Table */}
          {!selectedDivision ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">Select a union and division to view standings.</p>
            </div>
          ) : standings.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">
                No standings data available for {selectedDivisionData?.name} yet.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Standings will appear once matches have been completed.
              </p>
            </div>
          ) : (
            <div className="card overflow-x-auto">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedDivisionData?.name} {selectedDivisionData?.type && `(${selectedDivisionData.type})`}
              </h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300 dark:border-slate-600">
                    <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Pos</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Team</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">P</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">W</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">D</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">L</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">PF</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">PA</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">PD</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">BP</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((standing: any, index: number) => (
                    <tr
                      key={standing.id}
                      className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      <td className="py-3 px-2 text-center font-bold text-gray-700 dark:text-gray-300">{index + 1}</td>
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {standing.team?.name}
                      </td>
                      <td className="py-3 px-2 text-center text-gray-700 dark:text-gray-300">{standing.played}</td>
                      <td className="py-3 px-2 text-center text-green-600 dark:text-green-400 font-medium">{standing.won}</td>
                      <td className="py-3 px-2 text-center text-gray-700 dark:text-gray-300">{standing.drawn}</td>
                      <td className="py-3 px-2 text-center text-red-600 dark:text-red-400 font-medium">{standing.lost}</td>
                      <td className="py-3 px-2 text-center text-gray-700 dark:text-gray-300">{standing.pointsFor}</td>
                      <td className="py-3 px-2 text-center text-gray-700 dark:text-gray-300">{standing.pointsAgainst}</td>
                      <td className="py-3 px-2 text-center text-gray-700 dark:text-gray-300">
                        {standing.pointsDifference > 0 ? '+' : ''}
                        {standing.pointsDifference}
                      </td>
                      <td className="py-3 px-2 text-center text-blue-600 dark:text-blue-400 font-medium">
                        {standing.bonusPoints}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-primary-600 dark:text-primary-400">
                        {standing.totalPoints}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p className="font-semibold">Legend:</p>
                <p>P = Played, W = Won, D = Drawn, L = Lost</p>
                <p>PF = Points For, PA = Points Against, PD = Points Difference</p>
                <p>BP = Bonus Points, Pts = Total Points</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
