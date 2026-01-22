import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Trophy, Layers, Users, Calendar, ArrowLeft, Edit } from 'lucide-react';
import { unionsAPI, divisionsAPI, teamsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const ViewUnion = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [union, setUnion] = useState<any>(null);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadUnionDetails();
    }
  }, [id]);

  const loadUnionDetails = async () => {
    try {
      const [unionRes, divisionsRes, teamsRes] = await Promise.all([
        unionsAPI.getOne(id!),
        divisionsAPI.getAll(id),
        teamsAPI.getAll(),
      ]);

      setUnion(unionRes.data);
      setDivisions(divisionsRes.data);

      // Filter teams that belong to this union
      const unionTeams = teamsRes.data.filter((team: any) => team.unionId === id);
      setTeams(unionTeams);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load union details');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = isAuthenticated && hasRole('LEAGUE_ADMIN');

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="card">
          <p className="text-gray-600 dark:text-gray-300">Loading union details...</p>
        </div>
      </div>
    );
  }

  if (error || !union) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="card">
          <p className="text-red-600 dark:text-red-400">{error || 'Union not found'}</p>
          <button onClick={() => navigate('/unions')} className="btn btn-secondary mt-4">
            Back to Unions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/unions')}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{union.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Union Details</p>
            </div>
          </div>
        </div>
        {isAdmin && (
          <Link
            to={`/unions/${id}/edit`}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Edit className="w-5 h-5" />
            <span>Edit Union</span>
          </Link>
        )}
      </div>

      {/* Union Information */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Union Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</label>
            <p className="text-gray-900 dark:text-white mt-1">
              {union.description || 'No description provided'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
            <div className="mt-1">
              {union.isActive ? (
                <span className="inline-block px-3 py-1 text-sm font-semibold text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-900 rounded-full">
                  Active
                </span>
              ) : (
                <span className="inline-block px-3 py-1 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full">
                  Inactive
                </span>
              )}
            </div>
          </div>
          {union.seasonStart && (
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Season Start</label>
              <p className="text-gray-900 dark:text-white mt-1">
                {new Date(union.seasonStart).toLocaleDateString()}
              </p>
            </div>
          )}
          {union.seasonEnd && (
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Season End</label>
              <p className="text-gray-900 dark:text-white mt-1">
                {new Date(union.seasonEnd).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Point Settings */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Point Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Win Points</label>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{union.winPoints}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Draw Points</label>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{union.drawPoints}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Loss Points</label>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{union.lossPoints}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bonus Points</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Try Bonus</label>
              <p className="text-gray-900 dark:text-white mt-1">
                {union.bonusPointsForTries} point for scoring {union.minimumTriesForBonus}+ tries
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Losing Bonus</label>
              <p className="text-gray-900 dark:text-white mt-1">
                {union.bonusPointsForLosingMargin} point for losing by ≤{union.maximumLosingMarginForBonus} points
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divisions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Divisions ({divisions.length})
            </h2>
          </div>
          {isAdmin && (
            <Link to="/divisions/new" className="btn btn-secondary text-sm">
              Create Division
            </Link>
          )}
        </div>

        {divisions.length === 0 ? (
          <div className="text-center py-8">
            <Layers className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-300">No divisions created yet</p>
            {isAdmin && (
              <Link to="/divisions/new" className="btn btn-primary mt-4 inline-flex items-center space-x-2">
                <Layers className="w-4 h-4" />
                <span>Create First Division</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {divisions.map((division: any) => (
              <div
                key={division.id}
                className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{division.name}</h3>
                {division.type && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Type: {division.type}</p>
                )}
                {division.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {division.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Teams */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Teams ({teams.length})
            </h2>
          </div>
          {isAuthenticated && (
            <Link to="/teams/new" className="btn btn-secondary text-sm">
              Create Team
            </Link>
          )}
        </div>

        {teams.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-300">No teams in this union yet</p>
            {isAuthenticated && (
              <Link to="/teams/new" className="btn btn-primary mt-4 inline-flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Create First Team</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team: any) => (
              <div
                key={team.id}
                className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{team.name}</h3>
                  {!team.isActive && (
                    <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded">
                      Inactive
                    </span>
                  )}
                </div>
                {team.division && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Division: {team.division.name}
                  </p>
                )}
                {team.homeVenue && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Venue: {team.homeVenue}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <Layers className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{divisions.length}</p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Divisions</p>
        </div>
        <div className="card text-center">
          <Users className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{teams.length}</p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Teams</p>
        </div>
        <div className="card text-center">
          <Calendar className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {union.isActive ? 'Active' : 'Inactive'}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Status</p>
        </div>
      </div>
    </div>
  );
};
