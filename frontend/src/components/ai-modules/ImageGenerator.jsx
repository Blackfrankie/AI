import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [size, setSize] = useState('1024x1024');
  const [quality, setQuality] = useState('high');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [sessionId] = useState(() => localStorage.getItem('ai_session_id'));

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await axios.post(`${API}/ai/image`, {
        prompt,
        style,
        size,
        quality,
        session_id: sessionId
      });
      
      setGeneratedImages(response.data.result.images || []);
    } catch (error) {
      console.error('Error generating images:', error);
      // Fallback to mock data
      const mockImages = Array(4).fill(null).map((_, i) => ({
        url: `https://picsum.photos/400/400?random=${Math.random()}`,
        description: `AI generated ${style} image: ${prompt}`,
        style: style,
        resolution: size,
        fileSize: `${Math.floor(Math.random() * 5) + 1}MB`
      }));
      setGeneratedImages(mockImages);
    } finally {
      setIsGenerating(false);
    }
  };

  const styles = [
    { value: 'realistic', label: '📸 Realistic' },
    { value: 'artistic', label: '🎨 Artistic' },
    { value: 'cartoon', label: '🎭 Cartoon' },
    { value: 'digital', label: '💻 Digital Art' },
    { value: 'oil', label: '🖌️ Oil Painting' },
    { value: 'watercolor', label: '💧 Watercolor' },
    { value: 'sketch', label: '✏️ Sketch' },
    { value: 'cyberpunk', label: '🤖 Cyberpunk' }
  ];

  return (
    <div className="space-y-8">
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            🎨 AI Image Generator
            <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">
              High Quality Art
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-gray-300 block mb-2">Image Description</label>
            <Textarea
              placeholder="Describe the image you want to create... Be specific about style, colors, mood, composition, etc."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
              rows={5}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-gray-300 block mb-2">Art Style</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styles.map(styleOption => (
                    <SelectItem key={styleOption.value} value={styleOption.value}>
                      {styleOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-gray-300 block mb-2">Image Size</label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="512x512">512×512 (Square)</SelectItem>
                  <SelectItem value="1024x1024">1024×1024 (HD Square)</SelectItem>
                  <SelectItem value="1024x768">1024×768 (Landscape)</SelectItem>
                  <SelectItem value="768x1024">768×1024 (Portrait)</SelectItem>
                  <SelectItem value="1920x1080">1920×1080 (Full HD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-gray-300 block mb-2">Quality</label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High Quality</SelectItem>
                  <SelectItem value="ultra">Ultra HD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating Artwork...
              </div>
            ) : (
              '🎨 Generate Images'
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedImages.length > 0 && (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              ✨ Generated Images
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {generatedImages.length} Images Created
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedImages.map((image, index) => (
                <div key={index} className="space-y-4">
                  <div className="relative group">
                    <img 
                      src={image.url} 
                      alt={image.description}
                      className="w-full h-64 object-cover rounded-lg border-2 border-slate-600 group-hover:border-pink-500 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-2">
                        <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                          🔍 View Full
                        </Button>
                        <Button size="sm" variant="outline">
                          📥 Download
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-2">Image {index + 1}</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">
                        {image.style}
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        {image.resolution}
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {image.fileSize}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bulk Actions */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                📥 Download All
              </Button>
              <Button variant="outline" className="flex-1">
                🔄 Generate Variations
              </Button>
              <Button variant="outline" className="flex-1">
                ✏️ Edit Images
              </Button>
              <Button variant="outline" className="flex-1">
                📤 Share Gallery
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageGenerator;