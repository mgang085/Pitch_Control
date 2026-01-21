import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Plus, Calendar, Users } from 'lucide-react';
import { leaguesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const Leagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { hasRole, isAuthenticated } = useAuth();

  useEffect(() => {
    loadLeagues();
  }, []);

  const loadLeagues = async () => {
    try {
      const response = await leaguesAPI.getAll();
      setLeagues(response.data);
    } catch (error) {
      console.error('Failed to load leagues:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = isAuthenticated && hasRole('LEAGUE_ADMIN');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leagues</h1>
          <p className="text-gray-600 mt-2">Browse and manage rugby leagues</p>
        </div>
        {isAdmin && (
          <Link to="/leagues/new" className="btn btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create League</span>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading leagues...</p>
        </div>
      ) : leagues.length === 0 ? (
        <div className="card text-center py-12">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No leagues yet</h3>
          <p className="text-gray-600 mb-6">
            {isAdmin
              ? 'Create your first league to get started!'
              : 'Check back soon for available leagues.'}
          </p>
          {isAdmin && (
            <Link to="/leagues/new" className="btn btn-primary inline-flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create First League</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leagues.map((league: any) => (
            <Link
              key={league.id}
              to={`/leagues/${league.id}`}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Trophy className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{league.name}</h3>
                    {league.isActive ? (
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {league.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{league.description}</p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{league.divisions?.length || 0} Divisions</span>
                </div>
                {(league.seasonStart || league.seasonEnd) && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {league.seasonStart ? new Date(league.seasonStart).getFullYear() : 'N/A'}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
