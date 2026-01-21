import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { divisionsAPI, unionsAPI } from '../services/api';

export const CreateDivision = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [leagues, setLeagues] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    leagueId: '',
    type: '',
    description: '',
  });

  useEffect(() => {
    loadLeagues();
  }, []);

  const loadLeagues = async () => {
    try {
      const response = await unionsAPI.getAll();
      setLeagues(response.data);
    } catch (err) {
      console.error('Failed to load unions:', err);
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
      navigate('/unions');
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
        <p className="text-gray-600 dark:text-gray-300">Add a division to your union</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="label">Union *</label>
            <select
              name="leagueId"
              className="input"
              value={formData.leagueId}
              onChange={handleChange}
              required
            >
              <option value="">Select a union</option>
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
            <label className="label">Division Type</label>
            <select
              name="type"
              className="input"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="">Select type (optional)</option>
              <option value="MENS">Men's</option>
              <option value="WOMENS">Women's</option>
              <option value="YOUTH_BOYS">Youth Boys</option>
              <option value="YOUTH_GIRLS">Youth Girls</option>
            </select>
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
