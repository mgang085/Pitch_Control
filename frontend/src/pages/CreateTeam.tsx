import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { teamsAPI, divisionsAPI } from '../services/api';

export const CreateTeam = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [divisions, setDivisions] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    divisionId: '',
    logo: '',
    homeVenue: '',
    presidentName: '',
    presidentEmail: '',
    presidentPhone: '',
    coachName: '',
    coachEmail: '',
    coachPhone: '',
    matchSecretaryName: '',
    matchSecretaryEmail: '',
    matchSecretaryPhone: '',
  });

  useEffect(() => {
    loadDivisions();
  }, []);

  const loadDivisions = async () => {
    try {
      const response = await divisionsAPI.getAll();
      setDivisions(response.data);
    } catch (err) {
      console.error('Failed to load divisions:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await teamsAPI.create(formData);
      navigate('/teams');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Team</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">Register a new team in the league</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label">Team Name *</label>
              <input
                type="text"
                name="name"
                className="input"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Warriors RFC"
              />
            </div>

            <div>
              <label className="label">Division (Optional)</label>
              <select
                name="divisionId"
                className="input"
                value={formData.divisionId}
                onChange={handleChange}
              >
                <option value="">Select a division (optional)</option>
                {divisions.map((div: any) => (
                  <option key={div.id} value={div.id}>
                    {div.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Team Logo URL</label>
              <input
                type="url"
                name="logo"
                className="input"
                value={formData.logo}
                onChange={handleChange}
                placeholder="https://example.com/team-logo.png"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Optional: URL to your team logo</p>
            </div>

            <div>
              <label className="label">Home Venue</label>
              <input
                type="text"
                name="homeVenue"
                className="input"
                value={formData.homeVenue}
                onChange={handleChange}
                placeholder="e.g., Memorial Stadium"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">President Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  name="presidentName"
                  className="input"
                  value={formData.presidentName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  name="presidentEmail"
                  className="input"
                  value={formData.presidentEmail}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  name="presidentPhone"
                  className="input"
                  value={formData.presidentPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coach Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  name="coachName"
                  className="input"
                  value={formData.coachName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  name="coachEmail"
                  className="input"
                  value={formData.coachEmail}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  name="coachPhone"
                  className="input"
                  value={formData.coachPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Secretary Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  name="matchSecretaryName"
                  className="input"
                  value={formData.matchSecretaryName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  name="matchSecretaryEmail"
                  className="input"
                  value={formData.matchSecretaryEmail}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  name="matchSecretaryPhone"
                  className="input"
                  value={formData.matchSecretaryPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? 'Creating...' : 'Create Team'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/teams')}
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
