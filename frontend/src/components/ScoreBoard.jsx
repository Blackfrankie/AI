import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { mockScores } from '../data/mock';

const ScoreBoard = ({ onClose, highScore }) => {
  const combinedScores = [...mockScores, { name: 'You', score: highScore }]
    .filter(score => score.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((score, index) => ({ ...score, rank: index + 1 }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <Card className="bg-white/95 backdrop-blur-sm p-8 max-w-md w-full max-h-[80vh] overflow-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-yellow-600 mb-2">
            🏆 High Scores
          </h2>
          <p className="text-gray-600">Top 10 Players</p>
        </div>
        
        <div className="space-y-3 mb-6">
          {combinedScores.map((player, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                player.name === 'You' 
                  ? 'bg-yellow-100 border-2 border-yellow-400 shadow-lg transform scale-105' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  player.rank === 1 ? 'bg-yellow-500 text-white' :
                  player.rank === 2 ? 'bg-gray-400 text-white' :
                  player.rank === 3 ? 'bg-amber-600 text-white' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {player.rank}
                </div>
                <span className={`font-semibold ${
                  player.name === 'You' ? 'text-yellow-700' : 'text-gray-800'
                }`}>
                  {player.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xl font-bold ${
                  player.name === 'You' ? 'text-yellow-600' : 'text-gray-700'
                }`}>
                  {player.score}
                </span>
                {player.rank <= 3 && (
                  <span className="text-lg">
                    {player.rank === 1 ? '👑' : player.rank === 2 ? '🥈' : '🥉'}
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {combinedScores.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No scores yet!</p>
              <p>Play some games to see your scores here.</p>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <Button 
            onClick={onClose}
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ScoreBoard;