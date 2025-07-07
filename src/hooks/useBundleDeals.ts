
import { useState, useEffect } from 'react';
import { CartItem } from '../types/Product';
import { useSalesContext } from '../context/SalesContext';

export const useBundleDeals = (cartItems: CartItem[]) => {
  const { getActiveBundleDeal } = useSalesContext();
  const [bundleDiscounts, setBundleDiscounts] = useState<{ itemId: string; discount: number }[]>([]);

  useEffect(() => {
    const activeBundleDeal = getActiveBundleDeal();
    
    if (!activeBundleDeal || activeBundleDeal.deal_type !== 'buy_2_get_1_half_off') {
      setBundleDiscounts([]);
      return;
    }

    // Filter t-shirts (assuming category includes 'shirt' or similar)
    const tshirtItems = cartItems.filter(item => 
      item.product.category?.toLowerCase().includes('shirt') ||
      item.product.name.toLowerCase().includes('shirt') ||
      item.product.name.toLowerCase().includes('t-shirt')
    );

    if (tshirtItems.length < 2) {
      setBundleDiscounts([]);
      return;
    }

    // Calculate how many bundle deals can be applied
    const totalTshirts = tshirtItems.reduce((sum, item) => sum + item.quantity, 0);
    const bundleSets = Math.floor(totalTshirts / 2); // Every 2 t-shirts qualifies for 1 discounted item

    if (bundleSets === 0) {
      setBundleDiscounts([]);
      return;
    }

    // Sort t-shirts by price (ascending) to apply discount to cheapest ones
    const sortedTshirts = [...tshirtItems].sort((a, b) => a.product.price - b.product.price);
    
    const discounts: { itemId: string; discount: number }[] = [];
    let discountsApplied = 0;

    for (const item of sortedTshirts) {
      if (discountsApplied >= bundleSets) break;
      
      const discountAmount = (item.product.price * activeBundleDeal.discount_percentage) / 100;
      const quantityToDiscount = Math.min(item.quantity, bundleSets - discountsApplied);
      
      if (quantityToDiscount > 0) {
        discounts.push({
          itemId: `${item.product.id}-${item.size}`,
          discount: discountAmount * quantityToDiscount
        });
        discountsApplied += quantityToDiscount;
      }
    }

    setBundleDiscounts(discounts);
  }, [cartItems, getActiveBundleDeal]);

  const getTotalBundleDiscount = () => {
    return bundleDiscounts.reduce((sum, discount) => sum + discount.discount, 0);
  };

  const getItemBundleDiscount = (itemId: string) => {
    const discount = bundleDiscounts.find(d => d.itemId === itemId);
    return discount ? discount.discount : 0;
  };

  return {
    bundleDiscounts,
    getTotalBundleDiscount,
    getItemBundleDiscount,
    activeBundleDeal: getActiveBundleDeal()
  };
};
