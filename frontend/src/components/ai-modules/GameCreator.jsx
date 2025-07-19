import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { mockGameAI } from '../../data/mock-ai';

const GameCreator = () => {
  const [gameIdea, setGameIdea] = useState('');
  const [gameType, setGameType] = useState('');
  const [platform, setPlatform] = useState('web');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGame, setGeneratedGame] = useState(null);

  const handleGenerate = async () => {
    if (!gameIdea.trim()) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const result = mockGameAI.generateGame(gameIdea, gameType, platform);
      setGeneratedGame(result);
      setIsGenerating(false);
    }, 4000);
  };

  const gameTypes = [
    'Platformer', 'Puzzle', 'Adventure', 'RPG', 'Strategy', 
    'Arcade', 'Racing', 'Shooting', 'Casual', 'Educational'
  ];

  return (
    <div className="space-y-8">
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            🎮 AI Game Creator
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              Full Game Development
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-gray-300 block mb-2">Game Type</label>
              <Select value={gameType} onValueChange={setGameType}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select game type" />
                </SelectTrigger>
                <SelectContent>
                  {gameTypes.map(type => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-gray-300 block mb-2">Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web Browser</SelectItem>
                  <SelectItem value="mobile">Mobile App</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-gray-300 block mb-2">Complexity</label>
              <Select defaultValue="medium">
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="complex">Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-gray-300 block mb-2">Game Concept</label>
            <Textarea
              placeholder="Describe your game idea... Include mechanics, story, visual style, target audience, etc."
              value={gameIdea}
              onChange={(e) => setGameIdea(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
              rows={6}
            />
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={!gameIdea.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating Your Game...
              </div>
            ) : (
              '🎯 Create Game'
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedGame && (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              🎮 {generatedGame.title}
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Playable
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Game Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-400">{generatedGame.stats.levels}</div>
                <div className="text-gray-400 text-sm">Levels</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-400">{generatedGame.stats.assets}</div>
                <div className="text-gray-400 text-sm">Assets</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">{generatedGame.stats.codeLines}</div>
                <div className="text-gray-400 text-sm">Lines of Code</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{generatedGame.stats.playtime}</div>
                <div className="text-gray-400 text-sm">Playtime</div>
              </div>
            </div>

            {/* Game Preview */}
            <div className="bg-slate-900 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">{generatedGame.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{generatedGame.title}</h3>
                <p className="text-gray-400 mb-4">{generatedGame.description}</p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  🎮 Play Game
                </Button>
              </div>
            </div>

            {/* Game Features */}
            <div>
              <h4 className="text-white font-semibold mb-3">Game Features:</h4>
              <div className="flex flex-wrap gap-2">
                {generatedGame.features.map(feature => (
                  <Badge key={feature} className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    ⭐ {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="text-white font-semibold mb-3">Technology Stack:</h4>
              <div className="flex flex-wrap gap-2">
                {generatedGame.techStack.map(tech => (
                  <Badge key={tech} className="bg-gray-600/50 text-gray-300 border-gray-500/30">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                📱 Deploy Game
              </Button>
              <Button variant="outline" className="flex-1">
                📝 View Code
              </Button>
              <Button variant="outline" className="flex-1">
                🎨 Edit Assets
              </Button>
              <Button variant="outline" className="flex-1">
                📊 Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameCreator;