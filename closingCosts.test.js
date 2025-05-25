const { closingCosts } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('closingCosts function', () => {
  test('should calculate closing costs from dollar amount', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const closingCostInput = { value: 6000, isDollar: true };
    
    const result = closingCosts(purchasePrice, closingCostInput);
    
    expect(result.closingCostTotal).toBe(6000);
  });

  test('should calculate closing costs from percentage', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const closingCostInput = { value: 3, isDollar: false }; // 3% of purchase price
    
    const result = closingCosts(purchasePrice, closingCostInput);
    
    expect(result.closingCostTotal).toBe(6000); // 200000 * 0.03 = 6000
  });

  test('should handle zero closing costs', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const closingCostInput = { value: 0, isDollar: false };
    
    const result = closingCosts(purchasePrice, closingCostInput);
    
    expect(result.closingCostTotal).toBe(0);
  });
}); 