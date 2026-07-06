import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const DistrictManagement = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    population: 0,
    area: 0,
    urbanizationRate: 0,
    averageIncome: 0,
    literacyRate: 0,
    coordinates: {
      lat: 0,
      lng: 0
    },
    density: 0,
    headquarters: ''
  });

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await adminAPI.getDistricts();
      if (response.success) {
        setDistricts(response.data);
      }
    } catch (error) {
      /* districts will remain empty */
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingDistrict) {
        await adminAPI.updateDistrict(editingDistrict._id, formData);
      } else {
        await adminAPI.createDistrict(formData);
      }
      setShowModal(false);
      setEditingDistrict(null);
      setFormData({
        name: '',
        population: 0,
        area: 0,
        urbanizationRate: 0,
        averageIncome: 0,
        literacyRate: 0,
        coordinates: {
          lat: 0,
          lng: 0
        },
        density: 0,
        headquarters: ''
      });
      fetchDistricts();
    } catch (error) {
      alert(`Error saving district: ${error.message || 'Unknown error'}`);
    }
  };

  const handleEdit = (district) => {
    setEditingDistrict(district);
    setFormData({
      name: district.name,
      population: district.population,
      area: district.area,
      urbanizationRate: district.urbanizationRate,
      averageIncome: district.averageIncome,
      literacyRate: district.literacyRate,
      coordinates: district.coordinates || { lat: 0, lng: 0 },
      density: district.density || 0,
      headquarters: district.headquarters || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this district? This will also delete all areas in this district.')) {
      try {
        await adminAPI.deleteDistrict(id);
        fetchDistricts();
      } catch (error) {
        alert('Error deleting district');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1e293b]">
      <div className="bg-white dark:bg-[#1e293b] shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">District Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all districts</p>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setEditingDistrict(null);
                setFormData({
                  name: '',
                  population: 0,
                  area: 0,
                  urbanizationRate: 0,
                  averageIncome: 0,
                  literacyRate: 0,
                  coordinates: {
                    lat: 0,
                    lng: 0
                  },
                  density: 0,
                  headquarters: ''
                });
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Add District
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Population</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Area (sq km)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Urbanization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Avg Income</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Literacy</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#1e293b] divide-y divide-gray-200 dark:divide-gray-700">
                {districts.map((district) => (
                  <tr key={district._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{district.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{district.population?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{district.area?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{Number(district.urbanizationRate || 0).toFixed(2)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">₹{district.averageIncome?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{Number(district.literacyRate || 0).toFixed(2)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(district)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(district._id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {editingDistrict ? 'Edit District' : 'Add District'}
              </h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">District Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Population</label>
                <input
                  type="number"
                  required
                  value={formData.population}
                  onChange={(e) => setFormData({ ...formData, population: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Area (sq km)</label>
                <input
                  type="number"
                  required
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Urbanization Rate (%)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={formData.urbanizationRate}
                  onChange={(e) => setFormData({ ...formData, urbanizationRate: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Average Income (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.averageIncome}
                  onChange={(e) => setFormData({ ...formData, averageIncome: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Literacy Rate (%)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={formData.literacyRate}
                  onChange={(e) => setFormData({ ...formData, literacyRate: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.coordinates.lat}
                  onChange={(e) => setFormData({ ...formData, coordinates: { ...formData.coordinates, lat: parseFloat(e.target.value) } })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.coordinates.lng}
                  onChange={(e) => setFormData({ ...formData, coordinates: { ...formData.coordinates, lng: parseFloat(e.target.value) } })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Density (per sq km)</label>
                <input
                  type="number"
                  required
                  value={formData.density}
                  onChange={(e) => setFormData({ ...formData, density: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headquarters</label>
                <input
                  type="text"
                  required
                  value={formData.headquarters}
                  onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingDistrict(null);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingDistrict ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictManagement;
