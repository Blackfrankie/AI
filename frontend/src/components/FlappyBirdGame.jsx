import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import GameCanvas from './GameCanvas';
import ScoreBoard from './ScoreBoard';
import { mockScores } from '../data/mock';

const FlappyBirdGame = () => {
  const [gameState, setGameState] = useState('start'); // start, playing, gameOver
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showScores, setShowScores] = useState(false);
  const gameRef = useRef(null);

  useEffect(() => {
    // Load high score from localStorage (mock backend behavior)
    const savedHighScore = localStorage.getItem('flappyBirdHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    if (gameRef.current) {
      gameRef.current.startGame();
    }
  }, []);

  const endGame = useCallback((finalScore) => {
    setGameState('gameOver');
    setScore(finalScore);
    
    // Update high score
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('flappyBirdHighScore', finalScore.toString());
    }
  }, [highScore]);

  const resetGame = useCallback(() => {
    setGameState('start');
    setScore(0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-400 to-green-300 flex items-center justify-center p-4">
      <div className="relative">
        {/* Game Canvas */}
        <div className="relative border-4 border-yellow-400 rounded-lg overflow-hidden shadow-2xl">
          <GameCanvas
            ref={gameRef}
            gameState={gameState}
            onScoreUpdate={setScore}
            onGameEnd={endGame}
          />
          
          {/* Game Overlay UI */}
          {gameState === 'start' && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Card className="p-8 text-center bg-white/95 backdrop-blur-sm">
                <h1 className="text-5xl font-bold text-yellow-600 mb-4 drop-shadow-lg">
                  🐦 Flappy Bird
                </h1>
                <p className="text-gray-700 mb-6 text-lg">
                  Tap SPACE or click to flap!
                </p>
                <div className="space-y-4">
                  <Button 
                    onClick={startGame}
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 text-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    🚀 Start Game
                  </Button>
                  <Button 
                    onClick={() => setShowScores(true)}
                    variant="outline"
                    size="lg"
                    className="border-2 border-blue-400 text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 text-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    🏆 High Scores
                  </Button>
                </div>
                {highScore > 0 && (
                  <div className="mt-4 text-sm text-gray-600">
                    Personal Best: <span className="font-bold text-yellow-600">{highScore}</span>
                  </div>
                )}
              </Card>
            </div>
          )}

          {gameState === 'gameOver' && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <Card className="p-8 text-center bg-white/95 backdrop-blur-sm">
                <h2 className="text-4xl font-bold text-red-600 mb-4">
                  💥 Game Over!
                </h2>
                <div className="mb-6 space-y-2">
                  <p className="text-2xl font-semibold text-gray-800">
                    Score: <span className="text-yellow-600">{score}</span>
                  </p>
                  {score === highScore && score > 0 && (
                    <p className="text-lg text-green-600 font-bold animate-bounce">
                      🎉 New High Score! 🎉
                    </p>
                  )}
                  <p className="text-lg text-gray-600">
                    High Score: <span className="text-yellow-600 font-bold">{highScore}</span>
                  </p>
                </div>
                <div className="space-y-3">
                  <Button 
                    onClick={startGame}
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 text-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    🔄 Play Again
                  </Button>
                  <Button 
                    onClick={resetGame}
                    variant="outline"
                    size="lg"
                    className="border-2 border-gray-400 text-gray-600 hover:bg-gray-50 font-bold px-8 py-4 text-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    🏠 Main Menu
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Live Score Display */}
          {gameState === 'playing' && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border-2 border-yellow-400">
                <span className="text-3xl font-bold text-yellow-600">{score}</span>
              </div>
            </div>
          )}
        </div>

        {/* Score Board Modal */}
        {showScores && (
          <ScoreBoard 
            onClose={() => setShowScores(false)}
            highScore={highScore}
          />
        )}
      </div>
    </div>
  );
};

export default FlappyBirdGame;