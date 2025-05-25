const { totalProfitCalc } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('totalProfitCalc function', () => {
  test('should calculate total profit for cash purchase', () => {
    const purchasePrice = { value: 200000, isCashPurchase: true };
    const ARV = 250000;
    const totalExpense = 220000; // Purchase price + other expenses
    const agentCommissionAmount = 7500;
    const principalAmt = 0; // No loan for cash purchase
    
    const result = totalProfitCalc(purchasePrice, ARV, totalExpense, agentCommissionAmount, principalAmt);
    
    expect(result.totalProfit).toBe(22500); // 250000 - (220000 + 7500)
  });

  test('should calculate total profit for financed purchase', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const ARV = 250000;
    const totalExpense = 60000; // Down payment + other expenses
    const agentCommissionAmount = 7500;
    const principalAmt = 150000; // Remaining loan balance
    
    const result = totalProfitCalc(purchasePrice, ARV, totalExpense, agentCommissionAmount, principalAmt);
    
    expect(result.totalProfit).toBe(32500); // 250000 - (60000 + 7500 + 150000)
  });

  test('should handle negative profit', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const ARV = 200000; // No appreciation
    const totalExpense = 50000;
    const agentCommissionAmount = 6000;
    const principalAmt = 160000;
    
    const result = totalProfitCalc(purchasePrice, ARV, totalExpense, agentCommissionAmount, principalAmt);
    
    expect(result.totalProfit).toBe(-16000); // 200000 - (50000 + 6000 + 160000)
  });
}); 