import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { teamsAPI } from '../services/api';

export const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const response = await teamsAPI.getAll();
      setTeams(response.data);
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Teams</h1>

      {loading ? (
        <p className="text-gray-600">Loading teams...</p>
      ) : teams.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">No teams yet</h3>
          <p className="text-gray-600">Teams will appear here once they're added to divisions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team: any) => (
            <div key={team.id} className="card">
              <h3 className="font-bold text-gray-900 text-lg">{team.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{team.clubName || 'No club name'}</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Division: {team.division?.name || 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
