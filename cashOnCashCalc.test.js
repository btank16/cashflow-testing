const { cashOnCashCalc } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('cashOnCashCalc function', () => {
  test('should calculate cash on cash return correctly', () => {
    const annualCashFlow = 12000;
    const cashDown = 50000;
    
    const result = cashOnCashCalc(annualCashFlow, cashDown);
    
    expect(result.cashOnCash).toBe(24); // (12000 / 50000) * 100 = 24%
  });

  test('should handle negative cash flow', () => {
    const annualCashFlow = -3000;
    const cashDown = 50000;
    
    const result = cashOnCashCalc(annualCashFlow, cashDown);
    
    expect(result.cashOnCash).toBe(-6); // (-3000 / 50000) * 100 = -6%
  });

  test('should handle very high returns', () => {
    const annualCashFlow = 12000;
    const cashDown = 10000;
    
    const result = cashOnCashCalc(annualCashFlow, cashDown);
    
    expect(result.cashOnCash).toBe(120); // (12000 / 10000) * 100 = 120%
  });
}); 