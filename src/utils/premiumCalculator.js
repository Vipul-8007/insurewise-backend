export const calculatePremium = ({
  revenue,
  experience,
  coverageLimit,
  riskLevel,
}) => {
  let basePremium = 500;

  // Revenue factor
  if (revenue > 1000000) basePremium += 300;
  else if (revenue > 500000) basePremium += 150;

  // Experience factor
  if (experience < 3) basePremium *= 1.2;

  // Risk factor
  if (riskLevel === "HIGH") basePremium *= 1.5;
  else if (riskLevel === "MEDIUM") basePremium *= 1.2;

  // Revenue factor
  if (coverageLimit > 1000000) basePremium += 200;

  return Math.round(basePremium);
};
