const { maxEquityCalc } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('maxEquityCalc function', () => {
  test('should calculate max equity for financed purchase', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const ARV = 250000;
    const principalAmt = 150000; // Remaining loan balance
    
    const result = maxEquityCalc(purchasePrice, ARV, principalAmt);
    
    // New loan amount: 250000 * 0.8 = 200000
    // Max equity: 200000 - 150000 = 50000
    expect(result.newLoanAmount).toBe(200000);
    expect(result.maxEquity).toBe(50000);
  });

  test('should calculate max equity for cash purchase', () => {
    const purchasePrice = { value: 200000, isCashPurchase: true };
    const ARV = 250000;
    const principalAmt = 0; // No loan for cash purchase
    
    const result = maxEquityCalc(purchasePrice, ARV, principalAmt);
    
    // New loan amount: 250000 * 0.8 = 200000
    // For cash purchase, max equity is the new loan amount
    expect(result.newLoanAmount).toBe(200000);
    expect(result.maxEquity).toBe(200000);
  });
}); 