const { cashFlow } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('cashFlow function', () => {
  test('should calculate monthly and annual cash flow correctly', () => {
    const monthRent = 2000;
    const monthlyCost = 1500;
    const vacancy = 5; // 5% vacancy rate
    
    const result = cashFlow(monthRent, monthlyCost, vacancy);
    
    expect(result.monthlyCashflow).toBe(500); // 2000 - 1500 = 500
    // Annual calculation includes vacancy: 
    // (2000 * 12) - (1500 * 12) - (2000 * 12 * 0.05) = 24000 - 18000 - 1200 = 4800
    expect(result.annualCashflow).toBe(4800);
  });

  test('should handle negative cash flow', () => {
    const monthRent = 1500;
    const monthlyCost = 1800;
    const vacancy = 5;
    
    const result = cashFlow(monthRent, monthlyCost, vacancy);
    
    expect(result.monthlyCashflow).toBe(-300); // 1500 - 1800 = -300
    // Annual: (1500 * 12) - (1800 * 12) - (1500 * 12 * 0.05) = 18000 - 21600 - 900 = -4500
    expect(result.annualCashflow).toBe(-4500);
  });

  test('should handle zero vacancy', () => {
    const monthRent = 2000;
    const monthlyCost = 1500;
    const vacancy = 0;
    
    const result = cashFlow(monthRent, monthlyCost, vacancy);
    
    expect(result.monthlyCashflow).toBe(500);
    expect(result.annualCashflow).toBe(6000); // 500 * 12, no vacancy loss
  });
}); 