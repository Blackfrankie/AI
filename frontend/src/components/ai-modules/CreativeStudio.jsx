import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CreativeStudio = () => {
  const [prompt, setPrompt] = useState('');
  const [creativeType, setCreativeType] = useState('');
  const [style, setStyle] = useState('modern');
  const [mood, setMood] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdContent, setCreatedContent] = useState(null);
  const [sessionId] = useState(() => localStorage.getItem('ai_session_id'));

  const handleCreate = async () => {
    if (!prompt.trim()) return;
    
    setIsCreating(true);
    
    try {
      const response = await axios.post(`${API}/ai/creative`, {
        prompt,
        creative_type: creativeType,
        style,
        mood,
        session_id: sessionId
      });
      
      setCreatedContent(response.data.result);
    } catch (error) {
      console.error('Error creating content:', error);
      // Fallback to mock data
      const mockResult = {
        title: `${style.charAt(0).toUpperCase() + style.slice(1)} ${creativeType?.charAt(0).toUpperCase() + creativeType?.slice(1) || 'Creation'}`,
        type: creativeType || 'poem',
        style: style,
        content: `This is a demo ${creativeType} about: ${prompt}\n\nThe AI backend is ready but using fallback content for demonstration.`,
        stats: { words: 45, verses: 3, readTime: '1min', creativity: '92%' },
        elements: ['Metaphor', 'Imagery', 'Rhythm', 'Emotional Depth'],
        analysis: `This ${creativeType} demonstrates strong ${style} influences with thoughtful composition.`
      };
      setCreatedContent(mockResult);
    } finally {
      setIsCreating(false);
    }
  };

  const creativeTypes = [
    { value: 'poem', label: '📜 Poetry', icon: '📜' },
    { value: 'story', label: '📚 Short Story', icon: '📚' },
    { value: 'song', label: '🎵 Song Lyrics', icon: '🎵' },
    { value: 'script', label: '🎬 Script/Dialogue', icon: '🎬' },
    { value: 'monologue', label: '🎭 Monologue', icon: '🎭' },
    { value: 'haiku', label: '🌸 Haiku', icon: '🌸' },
    { value: 'speech', label: '🎤 Speech', icon: '🎤' },
    { value: 'creative_writing', label: '✍️ Creative Writing', icon: '✍️' }
  ];

  const styles = [
    'Modern', 'Classical', 'Romantic', 'Gothic', 'Minimalist',
    'Experimental', 'Traditional', 'Contemporary', 'Abstract', 'Narrative'
  ];

  const moods = [
    'Joyful', 'Melancholy', 'Inspirational', 'Mysterious', 'Energetic',
    'Peaceful', 'Dramatic', 'Whimsical', 'Dark', 'Uplifting', 'Nostalgic'
  ];

  return (
    <div className="space-y-8">
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            🎭 AI Creative Studio
            <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
              Artistic Expression
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-gray-300 block mb-2">Creative Type</label>
              <Select value={creativeType} onValueChange={setCreativeType}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select creative format" />
                </SelectTrigger>
                <SelectContent>
                  {creativeTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-gray-300 block mb-2">Style</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styles.map(styleOption => (
                    <SelectItem key={styleOption} value={styleOption.toLowerCase()}>
                      {styleOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-gray-300 block mb-2">Mood/Tone</label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  {moods.map(moodOption => (
                    <SelectItem key={moodOption} value={moodOption.toLowerCase()}>
                      {moodOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-gray-300 block mb-2">Creative Prompt</label>
            <Textarea
              placeholder="Describe what you want me to create... Include themes, characters, emotions, settings, or any specific elements you want included."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
              rows={6}
            />
          </div>

          <Button 
            onClick={handleCreate}
            disabled={!prompt.trim() || !creativeType || isCreating}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
          >
            {isCreating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating Art...
              </div>
            ) : (
              '🎨 Create Content'
            )}
          </Button>
        </CardContent>
      </Card>

      {createdContent && (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              ✨ {createdContent.title}
              <div className="flex gap-2">
                <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                  {createdContent.type}
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {createdContent.style}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Content Stats */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-indigo-400">{createdContent.stats.words}</div>
                <div className="text-gray-400 text-sm">Words</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{createdContent.stats.verses || createdContent.stats.paragraphs}</div>
                <div className="text-gray-400 text-sm">{createdContent.type === 'poem' ? 'Verses' : 'Paragraphs'}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-400">{createdContent.stats.readTime}</div>
                <div className="text-gray-400 text-sm">Read Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">{createdContent.stats.creativity}</div>
                <div className="text-gray-400 text-sm">Creativity</div>
              </div>
            </div>

            {/* Creative Content Display */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-8 border border-indigo-500/20">
              <div className="max-h-96 overflow-y-auto">
                <div className="prose prose-lg prose-invert max-w-none">
                  <div className="text-gray-100 leading-relaxed whitespace-pre-line text-lg">
                    {createdContent.content}
                  </div>
                </div>
              </div>
            </div>

            {/* Literary Features */}
            <div>
              <h4 className="text-white font-semibold mb-3">Literary Elements:</h4>
              <div className="flex flex-wrap gap-2">
                {createdContent.elements.map(element => (
                  <Badge key={element} className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                    ✨ {element}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Analysis */}
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">AI Analysis:</h4>
              <p className="text-gray-300 text-sm">
                {createdContent.analysis}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                📝 Save Work
              </Button>
              <Button variant="outline" className="flex-1">
                🔄 Create Variation
              </Button>
              <Button variant="outline" className="flex-1">
                🎙️ Audio Reading
              </Button>
              <Button variant="outline" className="flex-1">
                📤 Publish
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreativeStudio;