const { maximumAllowableOffer } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('maximumAllowableOffer function', () => {
  test('should calculate MAO correctly', () => {
    const ARV = 250000;
    const rehabCost = 30000;
    
    const result = maximumAllowableOffer(ARV, rehabCost);
    
    // MAO: (250000 * 0.7) - 30000 = 175000 - 30000 = 145000
    expect(result.MAO).toBe(145000);
  });

  test('should handle high rehab costs', () => {
    const ARV = 250000;
    const rehabCost = 100000;
    
    const result = maximumAllowableOffer(ARV, rehabCost);
    
    // MAO: (250000 * 0.7) - 100000 = 175000 - 100000 = 75000
    expect(result.MAO).toBe(75000);
  });

  test('should handle rehab costs exceeding 70% of ARV', () => {
    const ARV = 250000;
    const rehabCost = 200000;
    
    const result = maximumAllowableOffer(ARV, rehabCost);
    
    // MAO: (250000 * 0.7) - 200000 = 175000 - 200000 = -25000
    expect(result.MAO).toBe(-25000);
  });
}); 