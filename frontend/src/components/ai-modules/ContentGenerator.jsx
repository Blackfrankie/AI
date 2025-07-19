import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { mockContentAI } from '../../data/mock-ai';

const ContentGenerator = () => {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const result = mockContentAI.generateContent(topic, contentType, tone, length);
      setGeneratedContent(result);
      setIsGenerating(false);
    }, 2500);
  };

  const contentTypes = [
    { value: 'blog', label: '📝 Blog Post' },
    { value: 'article', label: '📰 Article' },
    { value: 'social', label: '📱 Social Media' },
    { value: 'email', label: '📧 Email Marketing' },
    { value: 'product', label: '🛍️ Product Description' },
    { value: 'ad', label: '📢 Advertisement Copy' },
    { value: 'seo', label: '🔍 SEO Content' },
    { value: 'press', label: '📰 Press Release' }
  ];

  return (
    <div className="space-y-8">
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            ✍️ AI Content Generator
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Multi-Format Writing
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-300 block mb-2">Content Type</label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-gray-300 block mb-2">Topic/Subject</label>
              <Input
                placeholder="e.g., Benefits of AI in healthcare"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-300 block mb-2">Tone & Style</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual & Friendly</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                  <SelectItem value="informative">Informative</SelectItem>
                  <SelectItem value="creative">Creative & Fun</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-gray-300 block mb-2">Length</label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (200-400 words)</SelectItem>
                  <SelectItem value="medium">Medium (500-800 words)</SelectItem>
                  <SelectItem value="long">Long (1000+ words)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={!topic.trim() || !contentType || isGenerating}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating Content...
              </div>
            ) : (
              '📝 Generate Content'
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedContent && (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              ✨ Generated Content
              <div className="flex gap-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {generatedContent.stats.words} words
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {generatedContent.stats.readTime} read
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Content Stats */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{generatedContent.stats.words}</div>
                <div className="text-gray-400 text-sm">Words</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{generatedContent.stats.sentences}</div>
                <div className="text-gray-400 text-sm">Sentences</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{generatedContent.stats.readTime}</div>
                <div className="text-gray-400 text-sm">Read Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">{generatedContent.stats.seoScore}</div>
                <div className="text-gray-400 text-sm">SEO Score</div>
              </div>
            </div>

            {/* Generated Content */}
            <div className="bg-white rounded-lg p-6 max-h-96 overflow-y-auto">
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: generatedContent.content }} />
              </div>
            </div>

            {/* Content Features */}
            <div>
              <h4 className="text-white font-semibold mb-3">Content Includes:</h4>
              <div className="flex flex-wrap gap-2">
                {generatedContent.features.map(feature => (
                  <Badge key={feature} className="bg-green-500/20 text-green-400 border-green-500/30">
                    ✓ {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                📋 Copy to Clipboard
              </Button>
              <Button variant="outline" className="flex-1">
                📝 Edit Content
              </Button>
              <Button variant="outline" className="flex-1">
                📊 SEO Analysis
              </Button>
              <Button variant="outline" className="flex-1">
                💾 Save Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentGenerator;