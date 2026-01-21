import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { teamsAPI, divisionsAPI, unionsAPI } from '../services/api';
import { FileUpload } from '../components/FileUpload';

export const CreateTeam = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unions, setUnions] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [filteredDivisions, setFilteredDivisions] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    unionId: '',
    divisionId: '',
    logo: '',
    homeVenue: '',
    phoneNumber: '',
    email: '',
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

      // Clear division selection if it's not from the selected union
      if (formData.divisionId) {
        const divisionValid = filtered.some((div: any) => div.id === formData.divisionId);
        if (!divisionValid) {
          setFormData(prev => ({ ...prev, divisionId: '' }));
        }
      }
    } else {
      setFilteredDivisions([]);
      setFormData(prev => ({ ...prev, divisionId: '' }));
    }
  }, [formData.unionId, divisions]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Filter out empty fields and convert empty IDs to undefined
      const payload = {
        ...formData,
        unionId: formData.unionId || undefined,
        divisionId: formData.divisionId || undefined,
      };

      // Remove empty optional fields
      Object.keys(payload).forEach(key => {
        if (payload[key as keyof typeof payload] === '') {
          delete payload[key as keyof typeof payload];
        }
      });

      await teamsAPI.create(payload);
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
        <p className="text-gray-600 dark:text-gray-300">Register a new team in the union</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900 dark:border-red-700 dark:text-red-200">
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

            <div className="md:col-span-2 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900 dark:border-blue-700">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Hierarchy:</strong> Unions contain Divisions, and Teams are assigned to Divisions within a Union.
                Select a Union first, then choose a Division within that Union. Teams must be assigned to both to participate in matches and appear in standings.
              </p>
            </div>

            <div className="md:col-span-2">
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
                Divisions belong to unions - select a union first
              </p>
            </div>

            <div className="md:col-span-2">
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
                  {!formData.unionId ? 'Select a union first' : filteredDivisions.length === 0 ? 'No divisions available' : 'Select a division'}
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

            <div className="md:col-span-2">
              <FileUpload
                label="Team Logo"
                value={formData.logo}
                onChange={(url) => setFormData({ ...formData, logo: url })}
                helpText="Upload your team logo image (PNG, JPG, SVG)"
              />
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

            <div>
              <label className="label">Team Email</label>
              <input
                type="email"
                name="email"
                className="input"
                value={formData.email}
                onChange={handleChange}
                placeholder="team@example.com"
              />
            </div>

            <div>
              <label className="label">Team Phone</label>
              <input
                type="tel"
                name="phoneNumber"
                className="input"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+1234567890"
              />
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
