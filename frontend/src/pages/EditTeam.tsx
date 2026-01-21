import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users } from 'lucide-react';
import { teamsAPI } from '../services/api';
import { FileUpload } from '../components/FileUpload';

export const EditTeam = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    logo: '',
    clubName: '',
    homeVenue: '',
    phoneNumber: '',
    email: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    isActive: true,
  });

  useEffect(() => {
    loadTeam();
  }, [id]);

  const loadTeam = async () => {
    if (!id) return;

    try {
      const response = await teamsAPI.getOne(id);
      const team = response.data;

      setFormData({
        name: team.name || '',
        shortName: team.shortName || '',
        logo: team.logo || '',
        clubName: team.clubName || '',
        homeVenue: team.homeVenue || '',
        phoneNumber: team.phoneNumber || '',
        email: team.email || '',
        address: team.address || '',
        emergencyContactName: team.emergencyContactName || '',
        emergencyContactPhone: team.emergencyContactPhone || '',
        isActive: team.isActive ?? true,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load team');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await teamsAPI.updateInfo(id!, formData);
      navigate('/teams');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update team');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <p className="text-gray-600 dark:text-gray-300">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Team</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">Update team information and contact details</p>
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

            <div>
              <label className="label">Short Name</label>
              <input
                type="text"
                name="shortName"
                className="input"
                value={formData.shortName}
                onChange={handleChange}
                placeholder="e.g., Warriors"
              />
            </div>

            <div>
              <label className="label">Club Name</label>
              <input
                type="text"
                name="clubName"
                className="input"
                value={formData.clubName}
                onChange={handleChange}
                placeholder="e.g., Warriors Rugby Club"
              />
            </div>

            <div className="md:col-span-2">
              <FileUpload
                label="Team Logo"
                value={formData.logo}
                onChange={(url) => setFormData({ ...formData, logo: url })}
                helpText="Upload your team logo image (PNG, JPG, SVG)"
              />
            </div>

            <div className="md:col-span-2">
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

            <div className="md:col-span-2">
              <label className="label">Address</label>
              <textarea
                name="address"
                className="input"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address of the team or club"
              />
            </div>

            <div>
              <label className="label">Emergency Contact Name</label>
              <input
                type="text"
                name="emergencyContactName"
                className="input"
                value={formData.emergencyContactName}
                onChange={handleChange}
                placeholder="Contact person name"
              />
            </div>

            <div>
              <label className="label">Emergency Contact Phone</label>
              <input
                type="tel"
                name="emergencyContactPhone"
                className="input"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                placeholder="+1234567890"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-slate-700 dark:border-slate-600"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                  Team is active
                </label>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? 'Updating...' : 'Update Team'}
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

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900 dark:border-blue-700">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Note:</strong> Union and division assignments can only be changed by league administrators.
          Contact your league admin if the team needs to be moved to a different union or division.
        </p>
      </div>
    </div>
  );
};
