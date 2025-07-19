
import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductsContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import { Product } from '../types/Product';
import { supabase } from '../integrations/supabase/client';

const NewProducts = () => {
  const { products } = useProducts();
  const [productsWithSales, setProductsWithSales] = useState<Product[]>([]);

  // Filter products with "New" tag AND active status
  const newProducts = products.filter(product => 
    product.tags?.includes('New') && product.is_active === true
  );

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const { data: salesData, error } = await supabase
          .from('sales')
          .select('*')
          .eq('is_active', true)
          .gte('end_date', new Date().toISOString());
        
        if (error) throw error;
        
        const updatedProducts = newProducts.map(product => {
          const sale = salesData?.find((s: any) => s.product_id === product.id);
          return sale ? {
            ...product,
            originalPrice: sale.original_price,
            price: sale.sale_price,
            saleInfo: {
              title: sale.sale_title,
              description: sale.sale_description,
              endDate: sale.end_date
            }
          } : product;
        });
        
        setProductsWithSales(updatedProducts);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setProductsWithSales(newProducts);
      }
    };
    
    fetchSalesData();
  }, [products]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-900">
          NEW PRODUCTS
        </h1>

        {productsWithSales.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No new products available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back soon for new arrivals!</p>
          </div>
        ) : (
          <ProductGrid products={productsWithSales} showSaleTag={true} />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default NewProducts;
