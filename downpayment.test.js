const { downPayment } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('downPayment function', () => {
  test('should calculate down payment for cash purchase', () => {
    const purchasePrice = { value: 200000, isCashPurchase: true };
    const downPaymentInput = { value: 0, isDollar: false };
    
    const result = downPayment(purchasePrice, downPaymentInput);
    
    expect(result.downPaymentCash).toBe(200000);
    expect(result.downPaymentPercent).toBe(100);
    expect(result.loanAmount).toBe(0);
  });

  test('should calculate down payment with dollar amount input', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const downPaymentInput = { value: 40000, isDollar: true };
    
    const result = downPayment(purchasePrice, downPaymentInput);
    
    expect(result.downPaymentCash).toBe(40000);
    expect(result.downPaymentPercent).toBe(20);
    expect(result.loanAmount).toBe(160000);
  });

  test('should calculate down payment with percentage input', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const downPaymentInput = { value: 20, isDollar: false };
    
    const result = downPayment(purchasePrice, downPaymentInput);
    
    expect(result.downPaymentCash).toBe(40000);
    expect(result.downPaymentPercent).toBe(20);
    expect(result.loanAmount).toBe(160000);
  });

  test('should handle zero down payment', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const downPaymentInput = { value: 0, isDollar: false };
    
    const result = downPayment(purchasePrice, downPaymentInput);
    
    expect(result.downPaymentCash).toBe(0);
    expect(result.downPaymentPercent).toBe(0);
    expect(result.loanAmount).toBe(200000);
  });
}); 