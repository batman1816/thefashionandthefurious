import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import FlipClock from '../components/FlipClock';
import { Product } from '../types/Product';
import AnnouncementBanner from '../components/AnnouncementBanner';
interface Sale {
  id: string;
  product_id: string;
  original_price: number;
  sale_price: number;
  sale_title: string;
  sale_description: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
}
interface BundleDeal {
  id: string;
  name: string;
  description: string;
  discount_percentage: number;
  minimum_quantity: number;
  max_discount_items: number;
  is_active: boolean;
  end_date: string;
}
const Sales = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [bundleDeals, setBundleDeals] = useState<BundleDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  useEffect(() => {
    fetchSalesData();
  }, []);
  useEffect(() => {
    // Set up countdown timer for active sales
    const activeSale = sales.find(sale => sale.is_active && new Date(sale.end_date) > new Date());
    const activeBundle = bundleDeals.find(bundle => bundle.is_active && new Date(bundle.end_date) > new Date());
    const endDate = activeSale?.end_date || activeBundle?.end_date;
    if (endDate) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const end = new Date(endDate).getTime();
        const distance = end - now;
        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
          const minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
          const seconds = Math.floor(distance % (1000 * 60) / 1000);
          setCountdown({
            days,
            hours,
            minutes,
            seconds
          });
        } else {
          setCountdown(null);
          fetchSalesData(); // Refresh data when sale ends
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [sales, bundleDeals]);
  const fetchSalesData = async () => {
    try {
      // Fetch active sales
      const {
        data: salesData,
        error: salesError
      } = await supabase.from('sales').select('*').eq('is_active', true).gte('end_date', new Date().toISOString());
      if (salesError) throw salesError;

      // Fetch active bundle deals
      const {
        data: bundleData,
        error: bundleError
      } = await supabase.from('bundle_deals').select('*').eq('is_active', true).gte('end_date', new Date().toISOString());
      if (bundleError) throw bundleError;

      // Only fetch products that have active sales
      const productIds = salesData?.map(sale => sale.product_id).filter(Boolean) || [];
      let productsWithSales: Product[] = [];
      if (productIds.length > 0) {
        const {
          data: productsData,
          error: productsError
        } = await supabase.from('products').select('*').in('id', productIds).eq('is_active', true);
        if (productsError) throw productsError;

        // Map sale prices to products
        productsWithSales = (productsData?.map(product => {
          const sale = salesData?.find(s => s.product_id === product.id);
          
          // Convert color_variants from Json to ColorVariant[]
          let colorVariants: any = undefined;
          if (product.color_variants) {
            try {
              colorVariants = Array.isArray(product.color_variants) 
                ? product.color_variants 
                : JSON.parse(product.color_variants as string);
            } catch (error) {
              console.error('Error parsing color_variants:', error);
              colorVariants = undefined;
            }
          }

          // Convert size_variants from Json to SizeVariant[]
          let sizeVariants: any = undefined;
          if (product.size_variants) {
            try {
              sizeVariants = Array.isArray(product.size_variants) 
                ? product.size_variants 
                : JSON.parse(product.size_variants as string);
            } catch (error) {
              console.error('Error parsing size_variants:', error);
              sizeVariants = undefined;
            }
          }
          
          const baseProduct = {
            ...product,
            category: product.category as 'drivers' | 'f1-classic' | 'teams' | 'mousepads',
            images: product.images || (product.image_url ? [product.image_url] : []),
            tags: product.tags || [],
            is_active: product.is_active !== undefined ? product.is_active : true,
            slug: product.slug,
            color_variants: colorVariants,
            size_variants: sizeVariants,
            main_image: product.main_image
          };
          
          if (sale) {
            return {
              ...baseProduct,
              originalPrice: sale.original_price,
              price: sale.sale_price,
              saleInfo: {
                title: sale.sale_title,
                description: sale.sale_description,
                endDate: sale.end_date
              }
            };
          }
          
          return baseProduct;
        }) as Product[]) || [];
      }
      setSales(salesData || []);
      setBundleDeals(bundleData || []);
      setProducts(productsWithSales);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };
  const activeBundleDeal = bundleDeals.find(deal => deal.is_active);
  return <div className="min-h-screen bg-white">
      <AnnouncementBanner />
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Countdown Banner */}
        {countdown && (
          <div className="mb-8">
            <FlipClock 
              targetDate={sales.find(sale => sale.is_active && new Date(sale.end_date) > new Date())?.end_date || 
                          bundleDeals.find(bundle => bundle.is_active && new Date(bundle.end_date) > new Date())?.end_date || 
                          new Date().toISOString()}
              title="SALE ENDS SOON!"
            />
          </div>
        )}

        {/* Bundle Deal Banner */}
        {activeBundleDeal && <div className="bg-black text-white p-6 rounded-lg mb-8 text-center">
            <h2 className="text-2xl font-bold mb-2">{activeBundleDeal.name}</h2>
            <p className="text-lg mb-2">{activeBundleDeal.description}</p>
            <p className="text-lg font-semibold text-zinc-50">
              Buy {activeBundleDeal.minimum_quantity} items, get {activeBundleDeal.max_discount_items} item at {activeBundleDeal.discount_percentage}% off!
            </p>
          </div>}

        

        {loading ? <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Loading sales...</div>
          </div> : products.length > 0 ? <ProductGrid products={products} /> : <div className="text-center py-16">
            <h3 className="text-xl text-gray-700 mb-2 font-extrabold">Oops sorry there is no active sales currently, come back and check again</h3>
            <p className="text-gray-500">Check back soon for amazing deals!</p>
          </div>}
      </div>

      <Footer />
    </div>;
};
export default Sales;