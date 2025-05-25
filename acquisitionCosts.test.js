const { acquisitionCosts } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('acquisitionCosts function', () => {
  test('should calculate acquisition costs from dollar amount', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const acquisitionCostsInput = { value: 6000, isDollar: true };
    
    const result = acquisitionCosts(purchasePrice, acquisitionCostsInput);
    
    expect(result.realAcquisitionCosts).toBe(6000);
  });

  test('should calculate acquisition costs from percentage', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const acquisitionCostsInput = { value: 3, isDollar: false }; // 3% of purchase price
    
    const result = acquisitionCosts(purchasePrice, acquisitionCostsInput);
    
    expect(result.realAcquisitionCosts).toBe(6000); // 200000 * 0.03 = 6000
  });

  test('should work with cash purchase', () => {
    const purchasePrice = { value: 200000, isCashPurchase: true };
    const acquisitionCostsInput = { value: 3, isDollar: false };
    
    const result = acquisitionCosts(purchasePrice, acquisitionCostsInput);
    
    expect(result.realAcquisitionCosts).toBe(6000);
  });
}); 