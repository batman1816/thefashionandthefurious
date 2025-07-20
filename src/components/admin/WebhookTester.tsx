
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { Send, Globe, CheckCircle } from 'lucide-react';

const WebhookTester = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testData, setTestData] = useState({
    test_message: 'Admin panel webhook test',
    timestamp: new Date().toISOString(),
    admin_action: 'webhook_test'
  });

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      toast.error('Please enter a webhook URL');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Testing webhook:', webhookUrl);
      console.log('Test data:', testData);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(testData),
      });

      console.log('Webhook test sent');
      toast.success('Webhook test sent successfully! Check your automation platform for the received data.');
    } catch (error) {
      console.error('Webhook test error:', error);
      toast.error('Failed to send webhook test. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Globe size={20} />
          Webhook Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Webhook URL (Make.com, Zapier, etc.)
          </label>
          <Input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://hook.make.com/..."
            className="bg-zinc-800 border-zinc-600 text-white"
          />
        </div>

        <div className="bg-zinc-800 p-3 rounded border border-zinc-600">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Test Data Preview:</h4>
          <pre className="text-xs text-gray-400 overflow-x-auto">
            {JSON.stringify(testData, null, 2)}
          </pre>
        </div>

        <Button 
          onClick={handleTestWebhook}
          disabled={isLoading || !webhookUrl.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Send size={16} className="mr-2 animate-pulse" />
              Sending Test...
            </>
          ) : (
            <>
              <Send size={16} className="mr-2" />
              Send Test Webhook
            </>
          )}
        </Button>

        <div className="text-xs text-gray-400 space-y-1">
          <p className="flex items-center gap-2">
            <CheckCircle size={12} className="text-green-500" />
            This will send a test payload to your webhook URL
          </p>
          <p className="flex items-center gap-2">
            <CheckCircle size={12} className="text-green-500" />
            Use this to verify your automation is receiving data correctly
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookTester;
