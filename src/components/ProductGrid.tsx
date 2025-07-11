
import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types/Product';
import ProductModal from './ProductModal';
import { supabase } from '../integrations/supabase/client';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productsWithSales, setProductsWithSales] = useState<Product[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Preload critical images
  const preloadImage = useCallback((src: string) => {
    if (!src || loadedImages.has(src)) return;
    
    const img = new Image();
    img.onload = () => {
      setLoadedImages(prev => new Set(prev).add(src));
    };
    img.src = src;
  }, [loadedImages]);

  useEffect(() => {
    // Fetch active sales and apply them to products
    const fetchSalesData = async () => {
      try {
        const { data: salesData, error } = await supabase
          .from('sales')
          .select('*')
          .eq('is_active', true)
          .gte('end_date', new Date().toISOString());

        if (error) throw error;

        const updatedProducts = products.map(product => {
          const sale = salesData?.find((s: any) => s.product_id === product.id);
          const productWithSale = sale ? {
            ...product,
            originalPrice: sale.original_price,
            price: sale.sale_price,
            saleInfo: {
              title: sale.sale_title,
              description: sale.sale_description,
              endDate: sale.end_date
            }
          } : product;

          // Preload primary images
          const primaryImage = productWithSale.images?.[0] || productWithSale.image_url;
          if (primaryImage) {
            preloadImage(primaryImage);
          }

          return productWithSale;
        });

        setProductsWithSales(updatedProducts);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setProductsWithSales(products);
        
        // Still preload images even if sales fetch fails
        products.forEach(product => {
          const primaryImage = product.images?.[0] || product.image_url;
          if (primaryImage) {
            preloadImage(primaryImage);
          }
        });
      }
    };

    fetchSalesData();
  }, [products, preloadImage]);

  // Filter to only show active products
  const activeProducts = productsWithSales.filter(product => product.is_active === true);

  const handleChooseOptions = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {activeProducts.map((product) => {
          const primaryImage = product.images && product.images.length > 0 ? product.images[0] : product.image_url;
          const hoverImage = product.images && product.images.length > 1 ? product.images[1] : primaryImage;
          const isOnSale = product.originalPrice && product.originalPrice > product.price;
          const imageLoaded = loadedImages.has(primaryImage || '');
          
          return (
            <div 
              key={product.id} 
              className="group cursor-pointer bg-white"
              onClick={() => handleProductClick(product)}
            >
              {/* Product Image */}
              <div className="aspect-square overflow-hidden bg-gray-50 relative mb-2 md:mb-4">
                {/* Sale Badge - Updated styling to match reference */}
                {isOnSale && (
                  <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-600 text-white text-xs md:text-sm font-bold px-3 py-1 md:px-4 md:py-2 z-10 uppercase tracking-wide">
                    SALE
                  </div>
                )}
                
                {primaryImage ? (
                  <>
                    {/* Loading placeholder */}
                    {!imageLoaded && (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-gray-200 rounded"></div>
                      </div>
                    )}
                    
                    <img
                      src={primaryImage}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:opacity-0 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading="lazy"
                      onLoad={() => setLoadedImages(prev => new Set(prev).add(primaryImage))}
                      onError={(e) => {
                        console.log('Primary image failed to load for:', product.name);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {hoverImage && hoverImage !== primaryImage && (
                      <img
                        src={hoverImage}
                        alt={product.name}
                        className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
                        loading="lazy"
                        onError={(e) => {
                          console.log('Hover image failed to load for:', product.name);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="text-left space-y-1">
                <h3 className="text-sm md:text-base font-normal text-black leading-tight">
                  {product.name}
                </h3>
                <div className="text-sm md:text-base font-normal text-black">
                  {isOnSale ? (
                    <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                      <span className="text-gray-400 line-through text-xs md:text-sm">€{product.originalPrice}.00 EUR</span>
                      <span className="text-red-600 font-bold">€{product.price}.00 EUR</span>
                    </div>
                  ) : (
                    <span>€{product.price}.00 EUR</span>
                  )}
                </div>
                <div className="pt-2">
                  <button 
                    onClick={(e) => handleChooseOptions(product, e)}
                    className="w-full border border-gray-400 text-black py-2 px-2 md:px-4 text-xs md:text-sm font-normal hover:bg-gray-50 transition-colors duration-200"
                  >
                    Choose options
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
};

export default ProductGrid;
