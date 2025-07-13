
import { useState } from 'react';
import { Save, Upload, Eye, Palette, Globe, Shield, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'RoastBlame',
    siteDescription: 'The ultimate platform for celebrity roasts and humorous takes. Share, react, and have fun responsibly!',
    logoUrl: '',
    primaryColor: '#ec4899', // pink-500
    secondaryColor: '#8b5cf6', // purple-500
    maxPostLength: 500,
    maxImageSize: 5, // MB
    maxVideoSize: 10, // MB
    allowAnonymous: true,
    moderationEnabled: true,
    autoModerationLevel: 'medium',
    guidelinesText: `Welcome to RoastBlame! Please follow these community guidelines:

1. Keep it humorous and light-hearted
2. Target public figures and celebrities only
3. No personal attacks or harassment
4. Respect intellectual property
5. No spam or promotional content
6. Report inappropriate content

Remember: The goal is entertainment, not harm!`
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would save to Firestore
      localStorage.setItem('roastblame_settings', JSON.stringify(settings));
      
      toast({ 
        title: "Settings saved", 
        description: "Site settings have been updated successfully" 
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({ 
        title: "Error", 
        description: "Failed to save settings. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (field: string) => {
    // In a real app, this would upload to Firebase Storage
    const mockUrl = 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=200&h=200&fit=crop';
    handleInputChange(field, mockUrl);
    toast({ title: "Image uploaded", description: "Logo has been updated" });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Site Settings</h1>
          <p className="text-gray-400">Configure your RoastBlame platform settings</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>{previewMode ? 'Edit Mode' : 'Preview'}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">General Settings</h2>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleInputChange('siteName', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={previewMode}
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Site Description
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => handleInputChange('siteDescription', e.target.value)}
              rows={3}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={previewMode}
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Logo
            </label>
            <div className="flex items-center space-x-4">
              {settings.logoUrl && (
                <img 
                  src={settings.logoUrl} 
                  alt="Logo" 
                  className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                />
              )}
              <button
                onClick={() => handleImageUpload('logoUrl')}
                disabled={previewMode}
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Logo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Appearance</h2>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Primary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                className="w-12 h-10 rounded-lg border border-gray-600 bg-gray-700 cursor-pointer"
                disabled={previewMode}
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={previewMode}
                placeholder="#ec4899"
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Secondary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                className="w-12 h-10 rounded-lg border border-gray-600 bg-gray-700 cursor-pointer"
                disabled={previewMode}
              />
              <input
                type="text"
                value={settings.secondaryColor}
                onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={previewMode}
                placeholder="#8b5cf6"
              />
            </div>
          </div>

          {/* Color Preview */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-white text-sm mb-2">Color Preview:</div>
            <div className="flex space-x-2">
              <div 
                className="w-8 h-8 rounded-lg"
                style={{ backgroundColor: settings.primaryColor }}
              ></div>
              <div 
                className="w-8 h-8 rounded-lg"
                style={{ backgroundColor: settings.secondaryColor }}
              ></div>
              <div 
                className="flex-1 h-8 rounded-lg"
                style={{ 
                  background: `linear-gradient(to right, ${settings.primaryColor}, ${settings.secondaryColor})` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content Settings */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-5 w-5 text-green-400" />
            <h2 className="text-xl font-bold text-white">Content Settings</h2>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Max Post Length (characters)
            </label>
            <input
              type="number"
              value={settings.maxPostLength}
              onChange={(e) => handleInputChange('maxPostLength', parseInt(e.target.value))}
              min="100"
              max="2000"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={previewMode}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Max Image Size (MB)
              </label>
              <input
                type="number"
                value={settings.maxImageSize}
                onChange={(e) => handleInputChange('maxImageSize', parseInt(e.target.value))}
                min="1"
                max="20"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={previewMode}
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Max Video Size (MB)
              </label>
              <input
                type="number"
                value={settings.maxVideoSize}
                onChange={(e) => handleInputChange('maxVideoSize', parseInt(e.target.value))}
                min="5"
                max="100"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={previewMode}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowAnonymous}
                onChange={(e) => handleInputChange('allowAnonymous', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                disabled={previewMode}
              />
              <span className="text-white">Allow anonymous posting</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.moderationEnabled}
                onChange={(e) => handleInputChange('moderationEnabled', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                disabled={previewMode}
              />
              <span className="text-white">Enable content moderation</span>
            </label>
          </div>
        </div>

        {/* Moderation Settings */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Moderation</h2>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Auto-moderation Level
            </label>
            <select
              value={settings.autoModerationLevel}
              onChange={(e) => handleInputChange('autoModerationLevel', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={previewMode}
            >
              <option value="off">Off</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <p className="text-gray-400 text-xs mt-1">
              Higher levels will automatically flag more content for review
            </p>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Community Guidelines
            </label>
            <textarea
              value={settings.guidelinesText}
              onChange={(e) => handleInputChange('guidelinesText', e.target.value)}
              rows={8}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              disabled={previewMode}
            />
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {previewMode && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Settings Preview</h3>
          <div className="bg-gray-900 rounded-lg p-6 border-2 border-dashed border-gray-600">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4" style={{ color: settings.primaryColor }}>
                {settings.siteName}
              </h1>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                {settings.siteDescription}
              </p>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div 
                  className="px-6 py-3 rounded-lg text-white font-semibold"
                  style={{ 
                    background: `linear-gradient(to right, ${settings.primaryColor}, ${settings.secondaryColor})` 
                  }}
                >
                  Sample Button
                </div>
                <div className="text-gray-400">
                  Max post length: {settings.maxPostLength} chars
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Anonymous posting: {settings.allowAnonymous ? 'Enabled' : 'Disabled'} | 
                Moderation: {settings.moderationEnabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
