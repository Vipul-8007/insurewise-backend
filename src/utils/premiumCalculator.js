export const calculatePremium = ({
  revenue,
  experience,
  coverageLimit,
  riskLevel,
}) => {
  let premium = 0;

  // Base premium based on revenue
  if (revenue <= 500000) premium = 400;
  else if (revenue <= 1000000) premium = 600;
  else premium = 800;

  // Experience discount
  if (experience >= 5)
    premium *= 0.9; // 10% discount
  else if (experience < 2) premium *= 1.15; // 15% increase

  // Risk multiplier
  const riskMultiplier = {
    LOW: 1,
    MEDIUM: 1.25,
    HIGH: 1.5,
  };
  premium *= riskMultiplier[riskLevel] || 1;

  // Coverage limit impact
  if (coverageLimit > 2000000) premium += 300;
  else if (coverageLimit > 1000000) premium += 150;

  return Math.round(premium);
};
