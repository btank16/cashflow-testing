const { capRateCalc } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('capRateCalc function', () => {
  test('should calculate cap rate correctly', () => {
    const annualCashFlow = 15000;
    const purchasePrice = { value: 200000, isCashPurchase: false };
    
    const result = capRateCalc(annualCashFlow, purchasePrice);
    
    expect(result.capRate).toBe(7.5); // (15000 / 200000) * 100 = 7.5%
  });

  test('should handle negative cash flow', () => {
    const annualCashFlow = -5000;
    const purchasePrice = { value: 200000, isCashPurchase: true };
    
    const result = capRateCalc(annualCashFlow, purchasePrice);
    
    expect(result.capRate).toBe(-2.5); // (-5000 / 200000) * 100 = -2.5%
  });

  test('should work with cash purchase', () => {
    const annualCashFlow = 15000;
    const purchasePrice = { value: 200000, isCashPurchase: true };
    
    const result = capRateCalc(annualCashFlow, purchasePrice);
    
    expect(result.capRate).toBe(7.5); // Same calculation regardless of cash or financed
  });
}); 