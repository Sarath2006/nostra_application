export const discountRules = [
  { minCoins: 150, discount: 650, minCart: 3399, coinsUsed: 50 },
  { minCoins: 100, discount: 400, minCart: 2599, coinsUsed: 35 },
  { minCoins: 70,  discount: 350, minCart: 1899, coinsUsed: 22 },
  { minCoins: 40,  discount: 220, minCart: 1099, coinsUsed: 12 },
  { minCoins: 22,  discount: 150,  minCart: 699,  coinsUsed: 8 }
];

export const getDiscountOffer = (walletCoins, cartValue) => {
  return discountRules.find(rule =>
    walletCoins >= rule.minCoins &&
    cartValue >= rule.minCart
  ) || null;
};
