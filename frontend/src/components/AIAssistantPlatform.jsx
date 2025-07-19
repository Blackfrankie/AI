import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import WebsiteBuilder from './ai-modules/WebsiteBuilder';
import GameCreator from './ai-modules/GameCreator';
import ContentGenerator from './ai-modules/ContentGenerator';
import ImageGenerator from './ai-modules/ImageGenerator';
import CodeAssistant from './ai-modules/CodeAssistant';
import DataAnalyzer from './ai-modules/DataAnalyzer';
import CreativeStudio from './ai-modules/CreativeStudio';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AIAssistantPlatform = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sessionId, setSessionId] = useState(null);
  const [platformStats, setPlatformStats] = useState(null);

  // Initialize session on component mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Check if session exists in localStorage
        let existingSessionId = localStorage.getItem('ai_session_id');
        
        if (!existingSessionId) {
          // Create new session
          const response = await axios.post(`${API}/sessions`, {
            user_agent: navigator.userAgent
          });
          existingSessionId = response.data.id;
          localStorage.setItem('ai_session_id', existingSessionId);
        }
        
        setSessionId(existingSessionId);
        
        // Fetch platform statistics
        const statsResponse = await axios.get(`${API}/stats/platform`);
        setPlatformStats(statsResponse.data);
      } catch (error) {
        console.error('Error initializing session:', error);
        // Generate fallback session ID
        const fallbackId = 'session_' + Date.now();
        setSessionId(fallbackId);
        localStorage.setItem('ai_session_id', fallbackId);
        
        // Set fallback stats
        setPlatformStats({
          total_sessions: 1,
          total_generations: 0,
          module_stats: [],
          platform_status: 'operational'
        });
      }
    };

    initializeSession();
  }, []);

  const aiModules = [
    {
      id: 'website',
      name: 'Website Builder',
      description: 'Create complete websites from descriptions',
      icon: '🌐',
      color: 'bg-blue-500',
      features: ['HTML/CSS/JS Generation', 'Responsive Design', 'SEO Optimized']
    },
    {
      id: 'game',
      name: 'Game Creator',
      description: 'Build games with AI assistance',
      icon: '🎮',
      color: 'bg-purple-500',
      features: ['Game Logic', 'Asset Creation', 'Physics Systems']
    },
    {
      id: 'content',
      name: 'Content Generator',
      description: 'Generate articles, blogs, and copy',
      icon: '✍️',
      color: 'bg-green-500',
      features: ['Blog Posts', 'Marketing Copy', 'Technical Writing']
    },
    {
      id: 'image',
      name: 'Image Generator',
      description: 'Create stunning visuals and artwork',
      icon: '🎨',
      color: 'bg-pink-500',
      features: ['Digital Art', 'Logos', 'Illustrations']
    },
    {
      id: 'code',
      name: 'Code Assistant',
      description: 'Write and debug code in any language',
      icon: '💻',
      color: 'bg-orange-500',
      features: ['Multi-Language', 'Bug Fixes', 'Code Review']
    },
    {
      id: 'data',
      name: 'Data Analyzer',
      description: 'Analyze and visualize complex data',
      icon: '📊',
      color: 'bg-cyan-500',
      features: ['Data Insights', 'Visualization', 'Predictions']
    },
    {
      id: 'creative',
      name: 'Creative Studio',
      description: 'Poetry, stories, and creative writing',
      icon: '🎭',
      color: 'bg-indigo-500',
      features: ['Poetry', 'Stories', 'Song Lyrics']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            🤖 OmniAI Studio
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            The Ultimate AI Assistant Platform
          </p>
          <p className="text-gray-400">
            Create anything with the power of artificial intelligence
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              ✅ Backend Connected
            </Badge>
            {sessionId && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                📱 Session Active
              </Badge>
            )}
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              🔑 Add API keys for real AI power
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 bg-slate-800/50 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600">
              📊 Dashboard
            </TabsTrigger>
            {aiModules.map(module => (
              <TabsTrigger 
                key={module.id} 
                value={module.id}
                className="data-[state=active]:bg-purple-600 text-sm"
              >
                {module.icon}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiModules.map(module => (
                <Card 
                  key={module.id}
                  className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 group cursor-pointer"
                  onClick={() => setActiveTab(module.id)}
                >
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 ${module.color} rounded-full flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {module.icon}
                    </div>
                    <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
                      {module.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm mb-4 text-center">
                      {module.description}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {module.features.map(feature => (
                        <Badge 
                          key={feature} 
                          variant="secondary"
                          className="text-xs bg-slate-700 text-gray-300"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(module.id);
                      }}
                    >
                      Launch {module.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Platform Statistics */}
            <Card className="mt-12 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  🚀 Platform Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-cyan-400">
                      {platformStats?.total_sessions || 1}
                    </div>
                    <div className="text-gray-400">Active Sessions</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-400">
                      {platformStats?.total_generations || 0}
                    </div>
                    <div className="text-gray-400">AI Generations</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-400">7</div>
                    <div className="text-gray-400">AI Modules</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-pink-400">
                      {platformStats?.platform_status === 'operational' ? '✅' : '⚠️'}
                    </div>
                    <div className="text-gray-400">System Status</div>
                  </div>
                </div>
                
                {sessionId && (
                  <div className="text-center mt-6">
                    <Badge variant="outline" className="text-xs bg-slate-700/50 text-gray-400">
                      Session ID: {sessionId.substring(0, 8)}...
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Modules */}
          <TabsContent value="website">
            <WebsiteBuilder />
          </TabsContent>
          
          <TabsContent value="game">
            <GameCreator />
          </TabsContent>
          
          <TabsContent value="content">
            <ContentGenerator />
          </TabsContent>
          
          <TabsContent value="image">
            <ImageGenerator />
          </TabsContent>
          
          <TabsContent value="code">
            <CodeAssistant />
          </TabsContent>
          
          <TabsContent value="data">
            <DataAnalyzer />
          </TabsContent>
          
          <TabsContent value="creative">
            <CreativeStudio />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIAssistantPlatform;