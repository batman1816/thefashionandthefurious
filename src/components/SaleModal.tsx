
import React, { useState, useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSalesContext } from '../context/SalesContext';

const SaleModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { globalSaleActive, globalSaleInfo, getActiveBundleDeal } = useSalesContext();
  const bundleDeal = getActiveBundleDeal();

  useEffect(() => {
    // Show modal if there's an active global sale or bundle deal
    const shouldShowModal = globalSaleActive || (bundleDeal && bundleDeal.is_active);
    
    if (shouldShowModal) {
      // Check if user has already seen the modal in this session
      const hasSeenModal = sessionStorage.getItem('saleModalSeen');
      if (!hasSeenModal) {
        setIsVisible(true);
      }
    }
  }, [globalSaleActive, bundleDeal]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('saleModalSeen', 'true');
  };

  const handleShopNow = () => {
    handleClose();
    // The Link component will handle navigation
  };

  if (!isVisible) return null;

  const isBundleDeal = bundleDeal && bundleDeal.is_active;
  const isGlobalSale = globalSaleActive && globalSaleInfo;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4">
      <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl max-w-md w-full p-8 text-white relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Background decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white opacity-10 rounded-full"></div>

        <div className="text-center relative z-10">
          {/* Sale icon */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Sale title */}
          <h2 className="text-3xl font-bold mb-4">
            {isBundleDeal ? '🎁 MASSIVE SALE!' : (isGlobalSale ? globalSaleInfo.global_sale_title : 'SALE ALERT!')}
          </h2>

          {/* Sale description */}
          <div className="mb-6">
            {isBundleDeal && (
              <div>
                <p className="text-xl font-semibold mb-2">
                  Buy 2 Get 1 at 50% Off!
                </p>
                <p className="text-sm opacity-90">
                  Mix and match any t-shirts. The discount applies automatically to your 3rd item.
                </p>
              </div>
            )}
            
            {isGlobalSale && !isBundleDeal && (
              <div>
                <p className="text-lg mb-2">
                  Don't miss out on incredible deals!
                </p>
                <p className="text-sm opacity-90">
                  Limited time offer on selected items.
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Link
              to="/category/sale"
              onClick={handleShopNow}
              className="block w-full bg-white text-red-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              🛍️ Shop Sale Now
            </Link>
            
            <button
              onClick={handleClose}
              className="block w-full bg-transparent border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-red-600 transition-colors"
            >
              Maybe Later
            </button>
          </div>

          {/* Small disclaimer */}
          <p className="text-xs opacity-75 mt-4">
            *Terms and conditions apply
          </p>
        </div>
      </div>
    </div>
  );
};

export default SaleModal;
