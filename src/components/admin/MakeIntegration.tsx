
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { supabase } from '../../integrations/supabase/client';
import WebhookTester from './WebhookTester';
import { Globe, Settings, Activity, Zap } from 'lucide-react';

const MakeIntegration = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');

  useEffect(() => {
    // Check if webhook is configured
    const storedWebhook = localStorage.getItem('make_webhook_url');
    if (storedWebhook) {
      setWebhookUrl(storedWebhook);
      setConnectionStatus('connected');
    }
  }, []);

  const handleSaveWebhook = () => {
    if (!webhookUrl.trim()) {
      toast.error('Please enter a valid webhook URL');
      return;
    }

    try {
      localStorage.setItem('make_webhook_url', webhookUrl);
      setConnectionStatus('connected');
      toast.success('Make.com webhook URL saved successfully');
    } catch (error) {
      console.error('Error saving webhook URL:', error);
      toast.error('Failed to save webhook URL');
    }
  };

  const handleTestConnection = async () => {
    if (!webhookUrl.trim()) {
      toast.error('Please enter a webhook URL first');
      return;
    }

    setIsLoading(true);
    setConnectionStatus('testing');

    try {
      const testData = {
        test: true,
        message: 'Admin panel connection test',
        timestamp: new Date().toISOString(),
        source: 'admin_panel'
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(testData),
      });

      setConnectionStatus('connected');
      toast.success('Test webhook sent! Check your Make.com scenario.');
    } catch (error) {
      console.error('Connection test error:', error);
      setConnectionStatus('disconnected');
      toast.error('Connection test failed. Please check your webhook URL.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearWebhook = () => {
    localStorage.removeItem('make_webhook_url');
    setWebhookUrl('');
    setConnectionStatus('disconnected');
    toast.success('Webhook URL cleared');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Make.com Integration</h1>
        <p className="text-gray-400">Connect your admin panel with Make.com for powerful automations</p>
      </div>

      {/* Connection Status */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity size={20} />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge 
              variant={connectionStatus === 'connected' ? 'default' : connectionStatus === 'testing' ? 'secondary' : 'destructive'}
            >
              {connectionStatus === 'connected' && '🟢 Connected'}
              {connectionStatus === 'testing' && '🟡 Testing...'}
              {connectionStatus === 'disconnected' && '🔴 Disconnected'}
            </Badge>
            <span className="text-gray-300 text-sm">
              {connectionStatus === 'connected' && 'Your webhook is configured and ready'}
              {connectionStatus === 'testing' && 'Testing webhook connection...'}
              {connectionStatus === 'disconnected' && 'No webhook configured'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Configuration */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings size={20} />
            Webhook Configuration
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure your Make.com webhook URL to receive admin panel events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="webhook-url" className="text-white">Make.com Webhook URL</Label>
            <Input
              id="webhook-url"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hook.make.com/..."
              className="bg-zinc-800 border-zinc-600 text-white"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleSaveWebhook}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Webhook URL
            </Button>
            <Button 
              onClick={handleTestConnection}
              disabled={isLoading || !webhookUrl.trim()}
              variant="outline"
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </Button>
            {webhookUrl && (
              <Button 
                onClick={handleClearWebhook}
                variant="destructive"
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Webhook Tester */}
      <WebhookTester />

      {/* Integration Guide */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap size={20} />
            Integration Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-gray-300 space-y-3">
            <h4 className="font-semibold">How to set up Make.com integration:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Create a new scenario in Make.com</li>
              <li>Add a "Webhooks" → "Custom webhook" trigger</li>
              <li>Copy the webhook URL from Make.com</li>
              <li>Paste it in the configuration above</li>
              <li>Save and test the connection</li>
              <li>Your admin panel actions will now trigger your Make.com scenarios</li>
            </ol>
          </div>

          <div className="bg-zinc-800 p-4 rounded border border-zinc-600">
            <h4 className="font-semibold text-white mb-2">Events that trigger webhooks:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• New orders placed</li>
              <li>• Product sales created/updated</li>
              <li>• Bundle deals created/updated</li>
              <li>• Announcement banners updated</li>
              <li>• Product inventory changes</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MakeIntegration;
