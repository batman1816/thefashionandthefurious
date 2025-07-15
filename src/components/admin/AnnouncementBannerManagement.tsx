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
  const {
    toast
  } = useToast();
  useEffect(() => {
    fetchBannerData();
  }, []);
  const fetchBannerData = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('announcement_banner').select('*').limit(1).single();
      if (error) {
        console.error('Error fetching banner data:', error);
        return;
      }
      setBannerData(data);
    } catch (error) {
      console.error('Error fetching banner data:', error);
    }
  };
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const {
        error
      } = await supabase.from('announcement_banner').update({
        text: bannerData.text,
        is_active: bannerData.is_active
      }).eq('id', bannerData.id);
      if (error) {
        console.error('Error updating banner:', error);
        toast({
          title: "Error",
          description: "Failed to update announcement banner",
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "Success",
        description: "Announcement banner updated successfully"
      });
    } catch (error) {
      console.error('Error updating banner:', error);
      toast({
        title: "Error",
        description: "Failed to update announcement banner",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Announcement Banner</h1>
        <p className="text-gray-600">Manage the scrolling announcement banner at the top of your site</p>
      </div>

      <Card className="bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-50">Banner Settings</CardTitle>
          <CardDescription className="text-zinc-50">
            Configure the text and visibility of your announcement banner
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 bg-zinc-900">
          <div className="space-y-2">
            <Label htmlFor="banner-text" className="bg-zinc-50">Banner Text</Label>
            <Input id="banner-text" value={bannerData.text} onChange={e => setBannerData({
            ...bannerData,
            text: e.target.value
          })} placeholder="Enter your announcement text..." className="w-full" />
            <p className="text-sm text-zinc-50">
              This text will scroll continuously across the banner
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="banner-active" checked={bannerData.is_active} onCheckedChange={checked => setBannerData({
            ...bannerData,
            is_active: checked
          })} />
            <Label htmlFor="banner-active" className="bg-zinc-50">
              Enable announcement banner
            </Label>
          </div>

          <Button onClick={handleSave} disabled={isLoading} className="w-full bg-zinc-950 hover:bg-zinc-800">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader className="bg-zinc-900">
          <CardTitle className="text-zinc-50">Preview</CardTitle>
          <CardDescription className="text-zinc-50">
            This is how your banner will appear on the website
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-zinc-900">
          {bannerData.is_active ? <div className="bg-red-600 text-white py-2 overflow-hidden relative rounded font-poppins">
              <div className="flex animate-scroll-continuous">
                <div className="flex whitespace-nowrap">
                  {Array.from({
                length: 6
              }, (_, i) => <span key={`first-${i}`} className="inline-block px-8 text-sm font-semibold tracking-wide">
                      {bannerData.text}
                    </span>)}
                </div>
                <div className="flex whitespace-nowrap">
                  {Array.from({
                length: 6
              }, (_, i) => <span key={`second-${i}`} className="inline-block px-8 text-sm font-semibold tracking-wide">
                      {bannerData.text}
                    </span>)}
                </div>
              </div>
            </div> : <div className="bg-gray-100 text-gray-500 py-2 px-4 rounded text-center">
              Banner is currently disabled
            </div>}
        </CardContent>
      </Card>
    </div>;
};
export default AnnouncementBannerManagement;