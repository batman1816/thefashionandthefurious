import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import ProductModal from './ProductModal';
import { Product } from '../types/Product';
import { supabase } from '../integrations/supabase/client';
const NewProductsSection = () => {
  const {
    products
  } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productsWithSales, setProductsWithSales] = useState<Product[]>([]);

  // Filter products with "New" tag and take only the first 4
  const newProducts = products.filter(product => product.tags?.includes('New') && product.is_active !== false).slice(0, 4);
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const {
          data: salesData,
          error
        } = await supabase.from('sales').select('*').eq('is_active', true).gte('end_date', new Date().toISOString());
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
  const handleChooseOptions = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Choose options clicked for:', product.name);
    setSelectedProduct(product);
  };
  const handleProductClick = (product: Product) => {
    console.log('Product clicked:', product.name);
    setSelectedProduct(product);
  };
  const handleCloseModal = () => {
    console.log('Modal closed');
    setSelectedProduct(null);
  };
  return <section className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-900">
          NEW PRODUCTS
        </h2>
        
        {productsWithSales.length > 0 ? <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
              {productsWithSales.map(product => {
            const primaryImage = product.images && product.images.length > 0 ? product.images[0] : product.image_url;
            const hoverImage = product.images && product.images.length > 1 ? product.images[1] : primaryImage;
            const isOnSale = product.originalPrice && product.originalPrice > product.price;
            return <div key={product.id} className="group cursor-pointer bg-white" onClick={() => handleProductClick(product)}>
                    {/* Product Image */}
                    <div className="aspect-square overflow-hidden bg-gray-50 relative mb-2 md:mb-4">
                      {/* Sale Badge */}
                      {isOnSale && <div className="absolute top-2 left-2 md:top-2 md:left-2 text-white text-xs font-bold px-2 py-1 md:px-3 md:py-1 z-10 uppercase tracking-wide" style={{
                  backgroundColor: '#C24242'
                }}>
                          SALE
                        </div>}
                      
                      {primaryImage ? <>
                          <img src={primaryImage} alt={product.name} className="w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0" onError={e => {
                    console.log('Primary image failed to load for:', product.name);
                    e.currentTarget.style.display = 'none';
                  }} />
                          <img src={hoverImage} alt={product.name} className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100" onError={e => {
                    console.log('Hover image failed to load for:', product.name);
                    e.currentTarget.style.display = 'none';
                  }} />
                        </> : <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                          No Image
                        </div>}
                    </div>
                    
                    {/* Product Info */}
                    <div className="text-left space-y-1">
                      <h3 className="text-sm md:text-base font-normal text-black leading-tight">
                        {product.name}
                      </h3>
                      <div className="text-sm md:text-base font-normal text-black">
                        {isOnSale ? <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                            <span className="line-through md:text-sm text-sm text-zinc-600">Tk {product.originalPrice}.00</span>
                            <span className="font-normal text-zinc-950 text-base">Tk {product.price}.00 BDT</span>
                          </div> : <span className="font-normal text-zinc-950 text-base">Tk {product.price}</span>}
                      </div>
                      <div className="pt-2">
                        <button onClick={e => handleChooseOptions(product, e)} className="w-full border border-gray-400 text-black py-2 px-2 md:px-4 text-xs md:text-sm font-normal hover:bg-gray-50 transition-colors duration-200">
                          Choose options
                        </button>
                      </div>
                    </div>
                  </div>;
          })}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Link to="/new-products" className="inline-block bg-black hover:bg-gray-800 text-white px-6 md:px-8 py-2 md:py-3 font-semibold transition-colors duration-300 uppercase tracking-wide text-sm md:text-base">
                VIEW ALL
              </Link>
            </div>
          </> : <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No new products available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back soon for new arrivals!</p>
          </div>}
      </div>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={handleCloseModal} />}
    </section>;
};
export default NewProductsSection;