import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { matchesAPI, divisionsAPI, teamsAPI } from '../services/api';

export const CreateMatch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [divisions, setDivisions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    divisionId: '',
    homeTeamId: '',
    awayTeamId: '',
    scheduledDate: '',
    venue: '',
    round: 1,
  });

  useEffect(() => {
    loadDivisions();
  }, []);

  useEffect(() => {
    if (formData.divisionId) {
      loadTeams(formData.divisionId);
    }
  }, [formData.divisionId]);

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
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'round' ? parseInt(value) : value });
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
      await matchesAPI.create(formData);
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
          <Calendar className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Schedule New Match</h1>
        </div>
        <p className="text-gray-600">Create a new match fixture</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="label">Division *</label>
            <select
              name="divisionId"
              className="input"
              value={formData.divisionId}
              onChange={handleChange}
              required
            >
              <option value="">Select a division</option>
              {divisions.map((div: any) => (
                <option key={div.id} value={div.id}>
                  {div.name}
                </option>
              ))}
            </select>
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
                disabled={!formData.divisionId}
              >
                <option value="">Select home team</option>
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
                disabled={!formData.divisionId}
              >
                <option value="">Select away team</option>
                {teams.map((team: any) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Match Date & Time *</label>
              <input
                type="datetime-local"
                name="scheduledDate"
                className="input"
                value={formData.scheduledDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="label">Round Number</label>
              <input
                type="number"
                name="round"
                className="input"
                value={formData.round}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
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
