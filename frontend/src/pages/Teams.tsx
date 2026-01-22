import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Edit, Settings, Filter } from 'lucide-react';
import { teamsAPI, unionsAPI, divisionsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const Teams = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [unions, setUnions] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedUnion, setSelectedUnion] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedUnion) {
      loadDivisions(selectedUnion);
    } else {
      setDivisions([]);
      setSelectedDivision('');
    }
  }, [selectedUnion]);

  useEffect(() => {
    loadTeams();
  }, [selectedDivision]);

  const loadInitialData = async () => {
    try {
      const [teamsRes, unionsRes] = await Promise.all([
        teamsAPI.getAll(),
        unionsAPI.getAll(),
      ]);
      setTeams(teamsRes.data);
      setUnions(unionsRes.data);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDivisions = async (unionId: string) => {
    try {
      const response = await divisionsAPI.getAll(unionId);
      setDivisions(response.data);
    } catch (error) {
      console.error('Failed to load divisions:', error);
    }
  };

  const loadTeams = async () => {
    try {
      const response = await teamsAPI.getAll(selectedDivision || undefined);
      setTeams(response.data);
    } catch (error) {
      console.error('Failed to load teams:', error);
    }
  };

  const handleUnionChange = (unionId: string) => {
    setSelectedUnion(unionId);
    setSelectedDivision('');
  };

  const handleClearFilters = () => {
    setSelectedUnion('');
    setSelectedDivision('');
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teams</h1>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => navigate('/teams/new')}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Team</span>
          </button>
        )}
      </div>

      {/* Filter Section */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Teams</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Union</label>
            <select
              className="input"
              value={selectedUnion}
              onChange={(e) => handleUnionChange(e.target.value)}
            >
              <option value="">All Unions</option>
              {unions.map((union: any) => (
                <option key={union.id} value={union.id}>
                  {union.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Division</label>
            <select
              className="input"
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              disabled={!selectedUnion}
            >
              <option value="">All Divisions</option>
              {divisions.map((division: any) => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
            </select>
            {!selectedUnion && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Select a union first
              </p>
            )}
          </div>
          <div className="flex items-end">
            {(selectedUnion || selectedDivision) && (
              <button
                onClick={handleClearFilters}
                className="btn btn-secondary w-full"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{teams.length}</span> team{teams.length !== 1 ? 's' : ''}
            {selectedDivision && divisions.find((d: any) => d.id === selectedDivision) && (
              <span> in <span className="font-semibold text-gray-900 dark:text-white">{divisions.find((d: any) => d.id === selectedDivision)?.name}</span></span>
            )}
            {selectedUnion && !selectedDivision && unions.find((u: any) => u.id === selectedUnion) && (
              <span> in <span className="font-semibold text-gray-900 dark:text-white">{unions.find((u: any) => u.id === selectedUnion)?.name}</span></span>
            )}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="card">
          <p className="text-gray-600 dark:text-gray-300">Loading teams...</p>
        </div>
      ) : teams.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No teams yet</h3>
          <p className="text-gray-600 dark:text-gray-300">Teams will appear here once they're created.</p>
          {isAuthenticated && (
            <button
              onClick={() => navigate('/teams/new')}
              className="btn btn-primary mt-4 inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create First Team</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team: any) => (
            <div key={team.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{team.name}</h3>
                {isAuthenticated && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/teams/${team.id}/manage`)}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      title="Manage team"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/teams/${team.id}/edit`)}
                      className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      title="Edit team info"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {team.clubName && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{team.clubName}</p>
              )}

              <div className="space-y-2 mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Union: </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {team.union?.name || 'N/A'}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Division: </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {team.division?.name || 'N/A'}
                  </span>
                </div>
                {team.homeVenue && (
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Venue: </span>
                    <span className="text-gray-900 dark:text-white font-medium">{team.homeVenue}</span>
                  </div>
                )}
              </div>

              {!team.isActive && (
                <div className="mt-3 px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded text-xs text-gray-600 dark:text-gray-400">
                  Inactive
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
