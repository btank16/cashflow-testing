const { wholesalingFees } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('wholesalingFees function', () => {
  test('should calculate wholesaling fees correctly', () => {
    const ARV = 200000;
    const contractPrice = 120000;
    const feePercent = 0.1; // 10% fee
    
    const result = wholesalingFees(ARV, contractPrice, feePercent);
    
    expect(result.wholesaleFee).toBe(20000); // 200000 * 0.1 = 20000
    expect(result.wholesaleSalePrice).toBe(140000); // 120000 + 20000 = 140000
  });

  test('should handle zero fee', () => {
    const ARV = 200000;
    const contractPrice = 120000;
    const feePercent = 0;
    
    const result = wholesalingFees(ARV, contractPrice, feePercent);
    
    expect(result.wholesaleFee).toBe(0);
    expect(result.wholesaleSalePrice).toBe(120000); // Same as contract price
  });

  test('should handle high fee percentage', () => {
    const ARV = 200000;
    const contractPrice = 120000;
    const feePercent = 0.2; // 20% fee
    
    const result = wholesalingFees(ARV, contractPrice, feePercent);
    
    expect(result.wholesaleFee).toBe(40000); // 200000 * 0.2 = 40000
    expect(result.wholesaleSalePrice).toBe(160000); // 120000 + 40000 = 160000
  });
}); 