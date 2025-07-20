
import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';

interface AnnouncementBannerData {
  id: string;
  text: string;
  is_active: boolean;
}

const AnnouncementBannerManagement = () => {
  const [bannerData, setBannerData] = useState<AnnouncementBannerData>({
    id: '',
    text: 'FREE SHIPPING ON ORDERS ABOVE 2000 TK !!!',
    is_active: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBannerData();
  }, []);

  const fetchBannerData = async () => {
    try {
      console.log('Fetching banner data...');
      const { data, error } = await supabase
        .from('announcement_banner')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching banner data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch announcement banner data",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        console.log('Banner data found:', data);
        setBannerData(data);
      } else {
        console.log('No banner data found, using default data...');
        // Just set default data without creating a record - let user create one manually
        setBannerData({
          id: '',
          text: 'FREE SHIPPING ON ORDERS ABOVE 2000 TK !!!',
          is_active: false
        });
      }
    } catch (error) {
      console.error('Error fetching banner data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch announcement banner data",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const createDefaultBanner = async () => {
    try {
      const { data, error } = await supabase
        .from('announcement_banner')
        .insert([{
          text: 'FREE SHIPPING ON ORDERS ABOVE 2000 TK !!!',
          is_active: false
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating default banner:', error);
        toast({
          title: "Error",
          description: "Failed to create default banner",
          variant: "destructive"
        });
        return;
      }

      console.log('Default banner created:', data);
      setBannerData(data);
    } catch (error) {
      console.error('Error creating default banner:', error);
      toast({
        title: "Error",
        description: "Failed to create default banner",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      if (bannerData.id) {
        // Update existing banner
        console.log('Updating banner with ID:', bannerData.id);
        console.log('Banner data:', { text: bannerData.text, is_active: bannerData.is_active });

        const { error } = await supabase
          .from('announcement_banner')
          .update({
            text: bannerData.text,
            is_active: bannerData.is_active
          })
          .eq('id', bannerData.id);

        if (error) {
          console.error('Error updating banner:', error);
          toast({
            title: "Error",
            description: "Failed to update announcement banner",
            variant: "destructive"
          });
          return;
        }

        console.log('Banner updated successfully');
        toast({
          title: "Success",
          description: "Announcement banner updated successfully"
        });
      } else {
        // Create new banner
        console.log('Creating new banner...');
        const { data, error } = await supabase
          .from('announcement_banner')
          .insert([{
            text: bannerData.text,
            is_active: bannerData.is_active
          }])
          .select()
          .single();

        if (error) {
          console.error('Error creating banner:', error);
          toast({
            title: "Error",
            description: "Failed to create announcement banner",
            variant: "destructive"
          });
          return;
        }

        console.log('Banner created successfully:', data);
        setBannerData(data);
        toast({
          title: "Success",
          description: "Announcement banner created successfully"
        });
      }

      // Refresh data to ensure UI is in sync
      await fetchBannerData();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        title: "Error",
        description: "Failed to save announcement banner",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Loading announcement banner...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Announcement Banner</h1>
        <p className="text-gray-400">Manage the scrolling announcement banner at the top of your site</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-zinc-50">Banner Settings</CardTitle>
          <CardDescription className="text-zinc-400">
            Configure the text and visibility of your announcement banner
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="banner-text" className="text-zinc-50">Banner Text</Label>
            <Input 
              id="banner-text" 
              value={bannerData.text} 
              onChange={(e) => setBannerData({
                ...bannerData,
                text: e.target.value
              })} 
              placeholder="Enter your announcement text..." 
              className="w-full bg-zinc-800 border-zinc-600 text-white" 
            />
            <p className="text-sm text-zinc-400">
              This text will scroll continuously across the banner
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="banner-active" 
              checked={bannerData.is_active} 
              onCheckedChange={(checked) => setBannerData({
                ...bannerData,
                is_active: checked
              })} 
            />
            <Label htmlFor="banner-active" className="text-zinc-50">
              Enable announcement banner
            </Label>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isLoading} 
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Saving...' : bannerData.id ? 'Update Banner' : 'Create Banner'}
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-zinc-50">Preview</CardTitle>
          <CardDescription className="text-zinc-400">
            This is how your banner will appear on the website
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bannerData.is_active ? (
            <div className="bg-red-600 text-white py-2 overflow-hidden relative rounded font-poppins">
              <div className="flex animate-scroll-continuous">
                <div className="flex whitespace-nowrap">
                  {Array.from({ length: 6 }, (_, i) => (
                    <span
                      key={`first-${i}`}
                      className="inline-block px-8 text-sm font-semibold tracking-wide"
                    >
                      {bannerData.text}
                    </span>
                  ))}
                </div>
                <div className="flex whitespace-nowrap">
                  {Array.from({ length: 6 }, (_, i) => (
                    <span
                      key={`second-${i}`}
                      className="inline-block px-8 text-sm font-semibold tracking-wide"
                    >
                      {bannerData.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-600 text-gray-300 py-2 px-4 rounded text-center">
              Banner is currently disabled
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementBannerManagement;
