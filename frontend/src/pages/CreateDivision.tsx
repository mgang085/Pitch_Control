import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { divisionsAPI, leaguesAPI } from '../services/api';

export const CreateDivision = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [leagues, setLeagues] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    leagueId: '',
    description: '',
  });

  useEffect(() => {
    loadLeagues();
  }, []);

  const loadLeagues = async () => {
    try {
      const response = await leaguesAPI.getAll();
      setLeagues(response.data);
    } catch (err) {
      console.error('Failed to load leagues:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await divisionsAPI.create(formData);
      navigate('/leagues');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create division');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Layers className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Division</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">Add a division to your league</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="label">League *</label>
            <select
              name="leagueId"
              className="input"
              value={formData.leagueId}
              onChange={handleChange}
              required
            >
              <option value="">Select a league</option>
              {leagues.map((league: any) => (
                <option key={league.id} value={league.id}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Division Name *</label>
            <input
              type="text"
              name="name"
              className="input"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Division 1, Senior Division"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              className="input"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the division..."
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? 'Creating...' : 'Create Division'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/leagues')}
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
