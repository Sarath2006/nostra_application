// services/coinEngine.js
export const calculateCoins = ({
  itemCount,
  monthlyAttempts,
  hoursSinceLast
}) => {
  const baseCoins = itemCount * 5; // appreciation per item

  const decay = Math.max(0.4, 1 - monthlyAttempts * 0.15);
  const recovery = Math.min(1, hoursSinceLast / 72);

  return Math.round(baseCoins * decay * recovery);
};
