import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { matchesAPI } from '../services/api';

export const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await matchesAPI.getAll();
      setMatches(response.data);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-green-100 text-green-800';
      case 'FINISHED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Matches</h1>

      {loading ? (
        <p className="text-gray-600">Loading matches...</p>
      ) : matches.length === 0 ? (
        <div className="card text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">No matches scheduled</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match: any) => (
            <div key={match.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(match.status)}`}>
                      {match.status}
                    </span>
                    <span className="text-sm text-gray-600">
                      {new Date(match.scheduledTime).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">{match.homeTeam?.name}</p>
                      <p className="text-sm text-gray-600">Home</p>
                    </div>

                    <div className="text-center">
                      {match.status === 'FINISHED' || match.status === 'IN_PROGRESS' ? (
                        <div className="flex items-center justify-center space-x-4">
                          <span className="text-3xl font-bold text-gray-900">{match.homeScore}</span>
                          <span className="text-gray-400">-</span>
                          <span className="text-3xl font-bold text-gray-900">{match.awayScore}</span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-gray-400">VS</span>
                      )}
                    </div>

                    <div className="text-left">
                      <p className="font-bold text-lg text-gray-900">{match.awayTeam?.name}</p>
                      <p className="text-sm text-gray-600">Away</p>
                    </div>
                  </div>

                  {match.venue && (
                    <p className="text-sm text-gray-600 mt-3">📍 {match.venue}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
