export const resolvePrice = (product: any, quantity: number, customPrice: number | null) => {
    let priceToConsider = customPrice !== null ? customPrice : product.price;

    const basePriceForTiers = product.price;

    if (quantity >= 100) { 
        const doubleBasePrice = basePriceForTiers * 2;
        
        if (quantity >= 5000) {
            priceToConsider = doubleBasePrice * 1.10;
        } else if (quantity >= 3000) {
            priceToConsider = doubleBasePrice * 1.20;
        } else if (quantity >= 1000) {
            priceToConsider = doubleBasePrice * 1.30;
        } else if (quantity >= 100) {
            priceToConsider = doubleBasePrice * 1.40;
        }
    } else if (customPrice === null && product.price_tiers && Array.isArray(product.price_tiers)) {
      const sortedTiers = [...product.price_tiers].sort((a, b) => b.min_qty - a.min_qty);
      const applicableTier = sortedTiers.find(tier => quantity >= tier.min_qty);
      if (applicableTier) priceToConsider = applicableTier.price;
    }

    return priceToConsider;
};
