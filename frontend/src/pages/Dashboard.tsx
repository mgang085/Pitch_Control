import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Plus, Users } from 'lucide-react';
import { unionsAPI, matchesAPI, teamsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [leaguesRes, matchesRes, teamsRes] = await Promise.all([
        unionsAPI.getAll(),
        matchesAPI.getAll(),
        teamsAPI.getAll(),
      ]);
      setLeagues(leaguesRes.data);
      setUpcomingMatches(matchesRes.data.slice(0, 5));
      setTeams(teamsRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = hasRole('LEAGUE_ADMIN');

  const stats = [
    { name: 'Total Unions', value: leagues.length, icon: Trophy, color: 'bg-blue-500' },
    { name: 'Total Teams', value: teams.length, icon: Users, color: 'bg-purple-500' },
    { name: 'Upcoming Matches', value: upcomingMatches.length, icon: Calendar, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Here's what's happening in your rugby unions
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      {isAdmin && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/unions/new"
              className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <Plus className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-gray-700">Create Union</span>
            </Link>
            <Link
              to="/teams/new"
              className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <Plus className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-gray-700">Add Team</span>
            </Link>
            <Link
              to="/matches/new"
              className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <Plus className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-gray-700">Schedule Match</span>
            </Link>
          </div>
        </div>
      )}

      {/* Recent Unions */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Active Unions</h2>
          <Link to="/unions" className="text-primary-600 hover:text-primary-700 font-medium">
            View all →
          </Link>
        </div>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : leagues.length === 0 ? (
          <p className="text-gray-600">No unions yet. Create one to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leagues.slice(0, 6).map((league: any) => (
              <Link
                key={league.id}
                to={`/unions/${league.id}`}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-3">
                  <Trophy className="w-8 h-8 text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{league.name}</h3>
                    <p className="text-sm text-gray-600">
                      {league.divisions?.length || 0} divisions
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Matches */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Matches</h2>
          <Link to="/matches" className="text-primary-600 hover:text-primary-700 font-medium">
            View all →
          </Link>
        </div>
        {upcomingMatches.length === 0 ? (
          <p className="text-gray-600">No upcoming matches scheduled.</p>
        ) : (
          <div className="space-y-4">
            {upcomingMatches.map((match: any) => (
              <Link
                key={match.id}
                to={`/matches/${match.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {match.homeTeam?.name} vs {match.awayTeam?.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(match.scheduledTime).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    match.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                    match.status === 'IN_PROGRESS' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {match.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
