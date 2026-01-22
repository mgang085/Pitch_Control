import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { matchesAPI, divisionsAPI, teamsAPI, unionsAPI } from '../services/api';

export const CreateMatch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unions, setUnions] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [filteredDivisions, setFilteredDivisions] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    unionId: '',
    divisionId: '',
    homeTeamId: '',
    awayTeamId: '',
    scheduledTime: '',
    venue: '',
  });

  useEffect(() => {
    loadUnions();
    loadDivisions();
  }, []);

  useEffect(() => {
    // Filter divisions when union changes
    if (formData.unionId) {
      const filtered = divisions.filter((div: any) => div.leagueId === formData.unionId);
      setFilteredDivisions(filtered);

      // Clear division and teams if division is not from selected union
      if (formData.divisionId) {
        const divisionValid = filtered.some((div: any) => div.id === formData.divisionId);
        if (!divisionValid) {
          setFormData(prev => ({ ...prev, divisionId: '', homeTeamId: '', awayTeamId: '' }));
          setTeams([]);
        }
      }
    } else {
      setFilteredDivisions([]);
      setFormData(prev => ({ ...prev, divisionId: '', homeTeamId: '', awayTeamId: '' }));
      setTeams([]);
    }
  }, [formData.unionId, divisions]);

  useEffect(() => {
    if (formData.divisionId) {
      loadTeams(formData.divisionId);
    } else {
      setTeams([]);
      setFormData(prev => ({ ...prev, homeTeamId: '', awayTeamId: '' }));
    }
  }, [formData.divisionId]);

  const loadUnions = async () => {
    try {
      const response = await unionsAPI.getAll();
      setUnions(response.data);
    } catch (err) {
      console.error('Failed to load unions:', err);
    }
  };

  const loadDivisions = async () => {
    try {
      const response = await divisionsAPI.getAll();
      setDivisions(response.data);
    } catch (err) {
      console.error('Failed to load divisions:', err);
    }
  };

  const loadTeams = async (divisionId: string) => {
    try {
      const response = await teamsAPI.getAll(divisionId);
      setTeams(response.data);
    } catch (err) {
      console.error('Failed to load teams:', err);
      setTeams([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.homeTeamId === formData.awayTeamId) {
      setError('Home and away teams must be different');
      return;
    }

    setLoading(true);

    try {
      // Convert datetime-local to ISO 8601 format
      const scheduledTimeISO = new Date(formData.scheduledTime).toISOString();

      // Prepare payload without unionId (not needed in backend)
      const payload = {
        divisionId: formData.divisionId,
        homeTeamId: formData.homeTeamId,
        awayTeamId: formData.awayTeamId,
        scheduledTime: scheduledTimeISO,
        venue: formData.venue || undefined,
      };

      await matchesAPI.create(payload);
      navigate('/matches');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to schedule match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Calendar className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Schedule New Match</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">Create a new match fixture</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900 dark:border-red-700 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900 dark:border-blue-700">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Hierarchy:</strong> Unions contain Divisions, and Teams are assigned to Divisions.
              Select a Union first, then choose a Division, then select teams from that division.
            </p>
          </div>

          <div>
            <label className="label">Union *</label>
            <select
              name="unionId"
              className="input"
              value={formData.unionId}
              onChange={handleChange}
              required
            >
              <option value="">Select a union</option>
              {unions.map((union: any) => (
                <option key={union.id} value={union.id}>
                  {union.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Divisions and teams are filtered by union
            </p>
          </div>

          <div>
            <label className="label">Division *</label>
            <select
              name="divisionId"
              className="input"
              value={formData.divisionId}
              onChange={handleChange}
              disabled={!formData.unionId || filteredDivisions.length === 0}
              required
            >
              <option value="">
                {!formData.unionId
                  ? 'Select a union first'
                  : filteredDivisions.length === 0
                  ? 'No divisions available'
                  : 'Select a division'}
              </option>
              {filteredDivisions.map((div: any) => (
                <option key={div.id} value={div.id}>
                  {div.name} {div.type && `(${div.type})`}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {formData.unionId
                ? filteredDivisions.length > 0
                  ? `Showing ${filteredDivisions.length} division(s) from ${unions.find((u: any) => u.id === formData.unionId)?.name || 'selected union'}`
                  : 'No divisions created for this union yet'
                : 'Divisions are filtered by union'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Home Team *</label>
              <select
                name="homeTeamId"
                className="input"
                value={formData.homeTeamId}
                onChange={handleChange}
                required
                disabled={!formData.divisionId || teams.length === 0}
              >
                <option value="">
                  {!formData.divisionId
                    ? 'Select division first'
                    : teams.length === 0
                    ? 'No teams in this division'
                    : 'Select home team'}
                </option>
                {teams.map((team: any) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Away Team *</label>
              <select
                name="awayTeamId"
                className="input"
                value={formData.awayTeamId}
                onChange={handleChange}
                required
                disabled={!formData.divisionId || teams.length === 0}
              >
                <option value="">
                  {!formData.divisionId
                    ? 'Select division first'
                    : teams.length === 0
                    ? 'No teams in this division'
                    : 'Select away team'}
                </option>
                {teams.map((team: any) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Match Date & Time *</label>
            <input
              type="datetime-local"
              name="scheduledTime"
              className="input"
              value={formData.scheduledTime}
              onChange={handleChange}
              required
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Select the date and time when the match will be played
            </p>
          </div>

          <div>
            <label className="label">Venue</label>
            <input
              type="text"
              name="venue"
              className="input"
              value={formData.venue}
              onChange={handleChange}
              placeholder="e.g., Memorial Stadium"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? 'Scheduling...' : 'Schedule Match'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/matches')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
