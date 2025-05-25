const { ROI } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('ROI function', () => {
  test('should calculate ROI percentages correctly', () => {
    const totalProfit = 50000;
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const totalExpense = 40000; // Down payment + other expenses
    
    const result = ROI(totalProfit, purchasePrice, totalExpense);
    
    expect(result.PercROI).toBe(25); // (50000 / 200000) * 100 = 25%
    expect(result.CashROI).toBe(125); // (50000 / 40000) * 100 = 125%
  });

  test('should handle negative profit', () => {
    const totalProfit = -10000;
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const totalExpense = 40000;
    
    const result = ROI(totalProfit, purchasePrice, totalExpense);
    
    expect(result.PercROI).toBe(-5); // (-10000 / 200000) * 100 = -5%
    expect(result.CashROI).toBe(-25); // (-10000 / 40000) * 100 = -25%
  });

  test('should handle cash purchase', () => {
    const totalProfit = 30000;
    const purchasePrice = { value: 200000, isCashPurchase: true };
    const totalExpense = 200000; // Full purchase price for cash deal
    
    const result = ROI(totalProfit, purchasePrice, totalExpense);
    
    expect(result.PercROI).toBe(15); // (30000 / 200000) * 100 = 15%
    expect(result.CashROI).toBe(15); // (30000 / 200000) * 100 = 15%
    // For cash purchase, PercROI and CashROI should be the same
  });
}); 