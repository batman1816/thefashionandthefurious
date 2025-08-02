import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types/Product';
import { useProducts } from '../context/ProductsContext';
const MousepadSection = () => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const {
    products
  } = useProducts();
  const navigate = useNavigate();

  // Filter mousepad products and only include active products
  const mousepadProducts = products.filter(product => product.category === 'mousepads' && product.is_active !== false).slice(0, 8); // Show first 8 products

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.slug || product.id}`);
  };
  const getProductImage = (product: Product) => {
    return product.main_image || product.image_url || product.images && product.images[0];
  };
  const getLowestPrice = (product: Product) => {
    if (product.size_pricing) {
      const prices = Object.values(product.size_pricing);
      return Math.min(...prices);
    }
    if (product.saleInfo) {
      return product.price;
    }
    return product.price;
  };
  if (mousepadProducts.length === 0) {
    return null;
  }
  return <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4 tracking-wide lg:text-2xl font-medium text-zinc-950">
            MOUSEPADS
          </h2>
          
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {mousepadProducts.map(product => {
          const mainImage = getProductImage(product);
          const isHovered = hoveredProduct === product.id;
          return <div key={product.id} className="group relative">
                <div className="aspect-square bg-gray-100 rounded-none mb-3 sm:mb-4 overflow-hidden cursor-pointer relative" onClick={() => handleProductClick(product)} onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
                  {/* Main Product Image */}
                  <img src={mainImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                </div>

                {/* Product Info */}
                <div className="text-left space-y-1">
                  <h3 className="text-sm sm:text-base font-normal text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm sm:text-base font-normal text-gray-900 mb-2">
                    From Tk {getLowestPrice(product)}
                  </p>
                </div>
              </div>;
        })}
        </div>

        {mousepadProducts.length > 0 && <div className="text-center mt-8">
            <button onClick={() => navigate('/mousepads')} className="inline-block bg-black hover:bg-gray-800 text-white px-8 py-3 font-poppins font-medium transition-colors duration-300 uppercase tracking-wide text-sm">VIEW ALL</button>
          </div>}
      </div>
    </section>;
};
export default MousepadSection;