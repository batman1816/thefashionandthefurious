
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface MakeWebhookProps {
  onWebhookSave?: (url: string) => void;
}

const MakeWebhook = ({ onWebhookSave }: MakeWebhookProps) => {
  const [webhookUrl, setWebhookUrl] = useState(() => 
    localStorage.getItem('make_webhook_url') || ''
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveWebhook = () => {
    if (!webhookUrl.trim()) {
      toast.error('Please enter a valid Make.com webhook URL');
      return;
    }

    // Validate URL format
    try {
      new URL(webhookUrl);
    } catch (error) {
      toast.error('Please enter a valid URL');
      return;
    }

    localStorage.setItem('make_webhook_url', webhookUrl);
    onWebhookSave?.(webhookUrl);
    toast.success('Make.com webhook URL saved successfully!');
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      toast.error('Please save a webhook URL first');
      return;
    }

    setIsLoading(true);
    console.log('Testing Make.com webhook:', webhookUrl);

    try {
      const testData = {
        test: true,
        timestamp: new Date().toISOString(),
        message: 'Test webhook from The Fashion & Furious',
        source: 'webhook_test'
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(testData),
      });

      toast.success('Test webhook sent! Check your Make.com scenario to see if it was received.');
    } catch (error) {
      console.error('Error testing webhook:', error);
      toast.error('Failed to send test webhook. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Make.com Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="webhook-url" className="text-gray-300">
            Make.com Webhook URL
          </Label>
          <Input
            id="webhook-url"
            type="url"
            placeholder="https://hook.eu1.make.com/..."
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white mt-2"
          />
          <p className="text-sm text-gray-400 mt-2">
            Enter your Make.com webhook URL to receive order notifications
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={handleSaveWebhook}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Webhook
          </Button>
          <Button
            onClick={handleTestWebhook}
            disabled={isLoading || !webhookUrl.trim()}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {isLoading ? 'Testing...' : 'Test Webhook'}
          </Button>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-2">Setup Instructions:</h4>
          <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
            <li>Create a new scenario in Make.com</li>
            <li>Add a "Webhooks" → "Custom webhook" trigger</li>
            <li>Copy the webhook URL from Make.com</li>
            <li>Paste it above and click "Save Webhook"</li>
            <li>Use "Test Webhook" to verify the connection</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default MakeWebhook;
