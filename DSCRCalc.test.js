const { DSCRCalc } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('DSCRCalc function', () => {
  test('should calculate DSCR correctly', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const NOI = 20000;
    const mortgageCost = 1000; // Monthly mortgage payment
    
    const result = DSCRCalc(purchasePrice, NOI, mortgageCost);
    
    // Annual mortgage: 1000 * 12 = 12000
    // DSCR: 20000 / 12000 = 1.67
    expect(result.DSCR).toBe('1.67');
  });

  test('should return N/A for cash purchase', () => {
    const purchasePrice = { value: 200000, isCashPurchase: true };
    const NOI = 20000;
    const mortgageCost = 0; // No mortgage for cash purchase
    
    const result = DSCRCalc(purchasePrice, NOI, mortgageCost);
    
    expect(result.DSCR).toBe('N/A');
  });

  test('should handle negative NOI', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const NOI = -5000;
    const mortgageCost = 1000;
    
    const result = DSCRCalc(purchasePrice, NOI, mortgageCost);
    
    // DSCR: -5000 / 12000 = -0.42
    expect(result.DSCR).toBe('-0.42');
  });

  test('should handle zero mortgage cost', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const NOI = 20000;
    const mortgageCost = 0;
    
    const result = DSCRCalc(purchasePrice, NOI, mortgageCost);
    
    expect(result.DSCR).toBe('N/A');
  });
}); 