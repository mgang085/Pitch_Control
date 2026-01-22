import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Users, UserPlus, Edit, Trash2, Plus, Shield, ArrowLeft } from 'lucide-react';
import { teamsAPI, playersAPI, usersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const ManageTeam = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<any>(null);
  const [officers, setOfficers] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [showAddOfficer, setShowAddOfficer] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);

  useEffect(() => {
    if (id) {
      loadTeamData();
    }
  }, [id]);

  const loadTeamData = async () => {
    try {
      const [teamRes, officersRes, playersRes] = await Promise.all([
        teamsAPI.getOne(id!),
        teamsAPI.getOfficers(id!),
        playersAPI.getAll(id),
      ]);

      setTeam(teamRes.data);
      setOfficers(officersRes.data);
      setPlayers(playersRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveOfficer = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this officer?')) return;

    try {
      await teamsAPI.removeOfficer(id!, userId);
      await loadTeamData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove officer');
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    if (!confirm('Are you sure you want to remove this player from the roster?')) return;

    try {
      await playersAPI.delete(playerId);
      await loadTeamData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove player');
    }
  };

  const isAdmin = hasRole('LEAGUE_ADMIN');
  const isTeamOfficer = officers.some((officer: any) => officer.userId === user?.id);
  const canManage = isAdmin || isTeamOfficer;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="card">
          <p className="text-gray-600 dark:text-gray-300">Loading team data...</p>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="card">
          <p className="text-red-600 dark:text-red-400">{error || 'Team not found'}</p>
          <button onClick={() => navigate('/teams')} className="btn btn-secondary mt-4">
            Back to Teams
          </button>
        </div>
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="card text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Access Denied</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You don't have permission to manage this team.
          </p>
          <button onClick={() => navigate('/teams')} className="btn btn-secondary">
            Back to Teams
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
            onClick={() => navigate('/teams')}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{team.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Team Management</p>
            </div>
          </div>
        </div>
        <Link
          to={`/teams/${id}/edit`}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Edit className="w-5 h-5" />
          <span>Edit Team Info</span>
        </Link>
      </div>

      {/* Team Information */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Team Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Union</label>
            <p className="text-gray-900 dark:text-white mt-1">{team.union?.name || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Division</label>
            <p className="text-gray-900 dark:text-white mt-1">{team.division?.name || 'N/A'}</p>
          </div>
          {team.homeVenue && (
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Home Venue</label>
              <p className="text-gray-900 dark:text-white mt-1">{team.homeVenue}</p>
            </div>
          )}
          {team.email && (
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
              <p className="text-gray-900 dark:text-white mt-1">{team.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Team Officers */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Team Officers ({officers.length})
            </h2>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddOfficer(true)}
              className="btn btn-secondary text-sm flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Officer</span>
            </button>
          )}
        </div>

        {officers.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-300">No officers assigned yet</p>
            {isAdmin && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Assign team presidents, coaches, or secretaries to manage this team
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {officers.map((officer: any) => (
              <div
                key={officer.id}
                className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg flex items-start justify-between"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {officer.user?.firstName} {officer.user?.lastName}
                    {officer.user?.displayId && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        (ID: {officer.user.displayId})
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{officer.role}</p>
                  {officer.user?.email && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {officer.user.email}
                    </p>
                  )}
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleRemoveOfficer(officer.userId)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    title="Remove officer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {isAdmin && !showAddOfficer && officers.length > 0 && (
          <button
            onClick={() => setShowAddOfficer(true)}
            className="mt-4 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
          >
            + Add Another Officer
          </button>
        )}

        {showAddOfficer && (
          <AddOfficerForm
            teamId={id!}
            onSuccess={() => {
              setShowAddOfficer(false);
              loadTeamData();
            }}
            onCancel={() => setShowAddOfficer(false)}
          />
        )}
      </div>

      {/* Player Roster */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Player Roster ({players.length})
            </h2>
          </div>
          <button
            onClick={() => setShowAddPlayer(true)}
            className="btn btn-primary text-sm flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Player</span>
          </button>
        </div>

        {players.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-300">No players on the roster yet</p>
            <button
              onClick={() => setShowAddPlayer(true)}
              className="btn btn-primary mt-4 inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Player</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-slate-600">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">#</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Position</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">DOB</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player: any) => (
                  <tr
                    key={player.id}
                    className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                      {player.jerseyNumber || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {player.firstName} {player.lastName}
                      {!player.isActive && (
                        <span className="ml-2 text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {player.position || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {new Date(player.dateOfBirth).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleRemovePlayer(player.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Remove player"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showAddPlayer && (
          <AddPlayerForm
            teamId={id!}
            onSuccess={() => {
              setShowAddPlayer(false);
              loadTeamData();
            }}
            onCancel={() => setShowAddPlayer(false)}
          />
        )}
      </div>
    </div>
  );
};

// Add Officer Form Component
const AddOfficerForm = ({ teamId, onSuccess, onCancel }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [role, setRole] = useState('MATCH_SECRETARY');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError('');
    try {
      const response = await usersAPI.search(searchQuery);
      setSearchResults(response.data);
      if (response.data.length === 0) {
        setError('No users found matching your search');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setError('Please select a user first');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await teamsAPI.assignOfficer(teamId, selectedUser.id, role);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add officer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Team Officer</h3>
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 rounded text-sm">
          {error}
        </div>
      )}

      {!selectedUser ? (
        <div className="space-y-4">
          <div>
            <label className="label">Search User (by ID, username, or email)</label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="input flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter user ID, username, or email..."
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={searching || !searchQuery.trim()}
                className="btn btn-secondary"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Tip: You can search by user ID (e.g., 1001), username, or email
            </p>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <label className="label">Select User</label>
              {searchResults.map((user: any) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded cursor-pointer hover:border-primary-500 dark:hover:border-primary-400"
                >
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      (ID: {user.displayId})
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {user.username} • {user.email}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex space-x-3">
            <button type="button" onClick={onCancel} className="btn btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded">
            <div className="font-semibold text-gray-900 dark:text-white">
              {selectedUser.firstName} {selectedUser.lastName}
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                (ID: {selectedUser.displayId})
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedUser.username} • {selectedUser.email}
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedUser(null);
                setSearchResults([]);
                setSearchQuery('');
              }}
              className="text-xs text-primary-600 dark:text-primary-400 mt-2 hover:underline"
            >
              Change user
            </button>
          </div>

          <div>
            <label className="label">Role</label>
            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="PRESIDENT">President</option>
              <option value="COACH">Coach</option>
              <option value="MATCH_SECRETARY">Match Secretary</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button type="submit" disabled={loading} className="btn btn-primary flex-1">
              {loading ? 'Adding...' : 'Add Officer'}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedUser(null);
                setSearchResults([]);
                setSearchQuery('');
              }}
              className="btn btn-secondary"
            >
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// Add Player Form Component
const AddPlayerForm = ({ teamId, onSuccess, onCancel }: any) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    jerseyNumber: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    position: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        teamId,
        jerseyNumber: formData.jerseyNumber ? parseInt(formData.jerseyNumber) : undefined,
      };

      // Remove empty fields
      Object.keys(payload).forEach(key => {
        if (payload[key as keyof typeof payload] === '') {
          delete payload[key as keyof typeof payload];
        }
      });

      await playersAPI.create(payload);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add player');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Player to Roster</h3>
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 rounded text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">First Name *</label>
            <input
              type="text"
              className="input"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Last Name *</label>
            <input
              type="text"
              className="input"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Jersey Number</label>
            <input
              type="number"
              className="input"
              value={formData.jerseyNumber}
              onChange={(e) => setFormData({ ...formData, jerseyNumber: e.target.value })}
              min="1"
              max="99"
            />
          </div>
          <div>
            <label className="label">Date of Birth *</label>
            <input
              type="date"
              className="input"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Position</label>
            <input
              type="text"
              className="input"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="e.g., Fly Half, Prop, etc."
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input
              type="tel"
              className="input"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Emergency Contact Name</label>
            <input
              type="text"
              className="input"
              value={formData.emergencyContactName}
              onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Emergency Contact Phone</label>
            <input
              type="tel"
              className="input"
              value={formData.emergencyContactPhone}
              onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
            />
          </div>
        </div>
        <div className="flex space-x-3 pt-4">
          <button type="submit" disabled={loading} className="btn btn-primary flex-1">
            {loading ? 'Adding...' : 'Add Player'}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
