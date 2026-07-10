import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { shareAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { ExternalLink } from 'lucide-react';

function SharePage() {
  const { isDarkMode } = useTheme();
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const resolveShare = async () => {
      try {
        const res = await shareAPI.getByToken(token);
        const { itemType, pincode } = res.data.itemData || {};
        if (pincode) {
          if (itemType === 'business') {
            navigate(`/business-overview/${pincode}`, { replace: true });
          } else {
            navigate(`/area-overview/${pincode}`, { replace: true });
          }
        } else {
          setError('Shared link has expired or is invalid.');
        }
      } catch (err) {
        setError(err.message || 'Shared link has expired or is invalid.');
      } finally {
        setLoading(false);
      }
    };
    resolveShare();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className={`min-h-[calc(100vh-70px)] flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`min-h-[calc(100vh-70px)] px-3 py-2 sm:px-4 sm:py-3 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <EmptyState
        type="error"
        message={error || 'Link could not be resolved.'}
        actionText="Go to Dashboard"
        onAction={() => navigate('/dashboard')}
      />
    </div>
  );
}

export default SharePage;
