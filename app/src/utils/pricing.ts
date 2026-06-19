export const resolvePrice = (product: any, quantity: number, customPrice: number | null) => {
    let price = customPrice !== null ? customPrice : product.price;
    if (customPrice === null && product.price_tiers && Array.isArray(product.price_tiers)) {
      const sortedTiers = [...product.price_tiers].sort((a, b) => b.min_qty - a.min_qty);
      const applicableTier = sortedTiers.find(tier => quantity >= tier.min_qty);
      if (applicableTier) price = applicableTier.price;
    }
    return price;
  };
