import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { unionsAPI } from '../services/api';
import { FileUpload } from '../components/FileUpload';

export const EditUnion = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    seasonStart: '',
    seasonEnd: '',
    isActive: true,
    winPoints: 4,
    drawPoints: 2,
    lossPoints: 0,
  });

  useEffect(() => {
    loadUnion();
  }, [id]);

  const loadUnion = async () => {
    if (!id) return;

    try {
      const response = await unionsAPI.getOne(id);
      const union = response.data;

      // Format dates for input type="date"
      const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        name: union.name || '',
        description: union.description || '',
        logo: union.logo || '',
        seasonStart: formatDate(union.seasonStart),
        seasonEnd: formatDate(union.seasonEnd),
        isActive: union.isActive ?? true,
        winPoints: union.winPoints ?? 4,
        drawPoints: union.drawPoints ?? 2,
        lossPoints: union.lossPoints ?? 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load union');
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
      await unionsAPI.update(id!, formData);
      navigate('/unions');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update union');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <p className="text-gray-600 dark:text-gray-300">Loading union data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Trophy className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Edit Union</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">Update union settings and configuration</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="label">Union Name *</label>
            <input
              type="text"
              name="name"
              className="input"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., National Rugby Union"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              className="input"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the union..."
            />
          </div>

          <FileUpload
            label="Union Logo"
            value={formData.logo}
            onChange={(url) => setFormData({ ...formData, logo: url })}
            helpText="Upload your union logo image (PNG, JPG, SVG)"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Season Start Date</label>
              <input
                type="date"
                name="seasonStart"
                className="input"
                value={formData.seasonStart}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label">Season End Date</label>
              <input
                type="date"
                name="seasonEnd"
                className="input"
                value={formData.seasonEnd}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="border-t pt-6 dark:border-slate-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Point Settings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Configure how points are awarded for match results</p>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Win Points</label>
                <input
                  type="number"
                  name="winPoints"
                  className="input"
                  value={formData.winPoints}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div>
                <label className="label">Draw Points</label>
                <input
                  type="number"
                  name="drawPoints"
                  className="input"
                  value={formData.drawPoints}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div>
                <label className="label">Loss Points</label>
                <input
                  type="number"
                  name="lossPoints"
                  className="input"
                  value={formData.lossPoints}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
              Union is active
            </label>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? 'Updating...' : 'Update Union'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/unions')}
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
