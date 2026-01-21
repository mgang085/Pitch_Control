import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { matchesAPI } from '../services/api';

export const Scoreboard = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (matchId) {
      loadMatch();
      // Refresh every 5 seconds for live updates
      const interval = setInterval(loadMatch, 5000);
      return () => clearInterval(interval);
    }
  }, [matchId]);

  const loadMatch = async () => {
    try {
      const response = await matchesAPI.getOne(matchId!);
      setMatch(response.data);
    } catch (err) {
      console.error('Failed to load match:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-green-700">
        <div className="text-white text-3xl font-bold">Loading...</div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-green-700">
        <div className="text-white text-3xl font-bold">Match not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Match Status */}
        <div className="text-center mb-8">
          <div className="text-white text-2xl font-semibold mb-2">
            {match.status === 'IN_PROGRESS' ? (
              <span className="bg-red-600 px-6 py-2 rounded-full animate-pulse">LIVE</span>
            ) : match.status === 'FINISHED' ? (
              <span className="bg-gray-600 px-6 py-2 rounded-full">FULL TIME</span>
            ) : (
              <span className="bg-blue-600 px-6 py-2 rounded-full">SCHEDULED</span>
            )}
          </div>
          <div className="text-white text-xl">
            {match.division?.name} - Round {match.round}
          </div>
          {match.venue && (
            <div className="text-green-200 text-lg mt-2">{match.venue}</div>
          )}
        </div>

        {/* Main Scoreboard */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="grid grid-cols-3 gap-8 items-center">
            {/* Home Team */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-4">{match.homeTeam?.name}</div>
              <div className="text-8xl font-bold text-green-600 mb-4">
                {match.homeScore || 0}
              </div>
              <div className="text-2xl text-gray-600">
                Tries: <span className="font-semibold">{match.homeTries || 0}</span>
              </div>
            </div>

            {/* VS */}
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-400">VS</div>
            </div>

            {/* Away Team */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-4">{match.awayTeam?.name}</div>
              <div className="text-8xl font-bold text-blue-600 mb-4">
                {match.awayScore || 0}
              </div>
              <div className="text-2xl text-gray-600">
                Tries: <span className="font-semibold">{match.awayTries || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-6">
          {/* Home Team Stats */}
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-4 text-center">{match.homeTeam?.name}</h3>
            <div className="space-y-3 text-lg">
              <div className="flex justify-between">
                <span>Conversions:</span>
                <span className="font-semibold">{match.homeConversions || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Penalty Kicks:</span>
                <span className="font-semibold">{match.homePenaltyKicks || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Drop Goals:</span>
                <span className="font-semibold">{match.homeDropGoals || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Bonus Points:</span>
                <span className="font-semibold">{match.homeBonusPoints || 0}</span>
              </div>
            </div>
          </div>

          {/* Away Team Stats */}
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-4 text-center">{match.awayTeam?.name}</h3>
            <div className="space-y-3 text-lg">
              <div className="flex justify-between">
                <span>Conversions:</span>
                <span className="font-semibold">{match.awayConversions || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Penalty Kicks:</span>
                <span className="font-semibold">{match.awayPenaltyKicks || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Drop Goals:</span>
                <span className="font-semibold">{match.awayDropGoals || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Bonus Points:</span>
                <span className="font-semibold">{match.awayBonusPoints || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Match Info */}
        <div className="mt-8 text-center text-white text-sm">
          <p>Scoreboard updates automatically every 5 seconds</p>
          {match.scheduledDate && (
            <p className="mt-2">
              Scheduled: {new Date(match.scheduledDate).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
