import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WebsiteBuilder = () => {
  const [description, setDescription] = useState('');
  const [websiteType, setWebsiteType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWebsite, setGeneratedWebsite] = useState(null);
  const [sessionId] = useState(() => localStorage.getItem('ai_session_id'));

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await axios.post(`${API}/ai/website`, {
        description,
        website_type: websiteType,
        session_id: sessionId
      });
      
      setGeneratedWebsite(response.data.result);
    } catch (error) {
      console.error('Error generating website:', error);
      // Fallback to mock data if API fails
      const mockResult = {
        preview: `<div style="padding: 2rem; text-center; border: 2px dashed #ccc; border-radius: 10px;">
          <h2>Demo Website Preview</h2>
          <p>This is a mock preview. API integration is ready but using fallback data.</p>
          <p><strong>Your request:</strong> ${description}</p>
        </div>`,
        stats: { files: 3, components: 5, responsive: '✓', seo_score: '90/100' },
        features: ['Responsive Design', 'SEO Optimized', 'Modern UI/UX']
      };
      setGeneratedWebsite(mockResult);
    } finally {
      setIsGenerating(false);
    }
  };

  const websiteTypes = [
    'Landing Page', 'E-commerce', 'Blog', 'Portfolio', 
    'Business', 'Restaurant', 'Agency', 'Startup'
  ];

  return (
    <div className="space-y-8">
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            🌐 AI Website Builder
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              HTML + CSS + JS
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-300 block mb-2">Website Type</label>
              <Input
                placeholder="e.g., Modern restaurant website"
                value={websiteType}
                onChange={(e) => setWebsiteType(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {websiteTypes.map(type => (
                  <Badge 
                    key={type}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-500/20 hover:border-blue-500"
                    onClick={() => setWebsiteType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-gray-300 block mb-2">Description</label>
              <Textarea
                placeholder="Describe your website... Include features, color scheme, target audience, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
                rows={5}
              />
            </div>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={!description.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating Website...
              </div>
            ) : (
              '🚀 Generate Website'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Website Preview */}
      {generatedWebsite && (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              ✨ Generated Website
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Ready
                </Badge>
                <Button size="sm" variant="outline">
                  Download Code
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Website Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">{generatedWebsite.stats.files}</div>
                <div className="text-gray-400 text-sm">Files</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{generatedWebsite.stats.components}</div>
                <div className="text-gray-400 text-sm">Components</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{generatedWebsite.stats.responsive}</div>
                <div className="text-gray-400 text-sm">Responsive</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">{generatedWebsite.stats.seo}</div>
                <div className="text-gray-400 text-sm">SEO Score</div>
              </div>
            </div>

            {/* Website Preview */}
            <div className="bg-white rounded-lg p-6 min-h-[400px]">
              <div dangerouslySetInnerHTML={{ __html: generatedWebsite.preview }} />
            </div>

            {/* Features */}
            <div>
              <h4 className="text-white font-semibold mb-3">Generated Features:</h4>
              <div className="flex flex-wrap gap-2">
                {generatedWebsite.features.map(feature => (
                  <Badge key={feature} className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    ✓ {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                📥 Download Files
              </Button>
              <Button variant="outline" className="flex-1">
                🔧 Customize
              </Button>
              <Button variant="outline" className="flex-1">
                👁️ Live Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WebsiteBuilder;