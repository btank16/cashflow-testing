const { propertyTax } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('propertyTax function', () => {
  test('should calculate property tax from dollar amount', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const propertyTaxInput = { value: 2400, isDollar: true };
    
    const result = propertyTax(purchasePrice, propertyTaxInput);
    
    expect(result.monthlyPropTax).toBe(200); // 2400 / 12 = 200
  });

  test('should calculate property tax from percentage', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const propertyTaxInput = { value: 1.2, isDollar: false }; // 1.2% of property value
    
    const result = propertyTax(purchasePrice, propertyTaxInput);
    
    expect(result.monthlyPropTax).toBe(200); // (200000 * 0.012) / 12 = 200
  });

  test('should handle zero property tax', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const propertyTaxInput = { value: 0, isDollar: true };
    
    const result = propertyTax(purchasePrice, propertyTaxInput);
    
    expect(result.monthlyPropTax).toBe(0);
  });

  test('should work with cash purchases', () => {
    const purchasePrice = { value: 200000, isCashPurchase: true };
    const propertyTaxInput = { value: 1.2, isDollar: false };
    
    const result = propertyTax(purchasePrice, propertyTaxInput);
    
    expect(result.monthlyPropTax).toBe(200);
  });
}); 