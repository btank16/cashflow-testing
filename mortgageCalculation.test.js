const { mortgageCalculation } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('mortgageCalculation function', () => {
  test('should return zero for cash purchase', () => {
    const purchasePrice = { value: 200000, isCashPurchase: true };
    const loanAmount = 0;
    const downPaymentPercent = 100;
    const interestRate = { value: 4, isInterestOnly: false };
    const loanTerm = 30;
    
    const result = mortgageCalculation(purchasePrice, loanAmount, downPaymentPercent, interestRate, loanTerm);
    
    expect(result.mortgageCost).toBe(0);
  });

  test('should calculate mortgage with amortization correctly', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const loanAmount = 160000;
    const downPaymentPercent = 20;
    const interestRate = { value: 4, isInterestOnly: false };
    const loanTerm = 30;
    
    const result = mortgageCalculation(purchasePrice, loanAmount, downPaymentPercent, interestRate, loanTerm);
    
    // Expected value calculated with the same formula
    // Monthly payment on a 30 year loan at 4% for $160,000
    expect(result.mortgageCost).toBeCloseTo(763.86, 1);
  });

  test('should calculate interest-only mortgage correctly', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const loanAmount = 160000;
    const downPaymentPercent = 20;
    const interestRate = { value: 4, isInterestOnly: true };
    const loanTerm = 30;
    
    const result = mortgageCalculation(purchasePrice, loanAmount, downPaymentPercent, interestRate, loanTerm);
    
    // Interest only payment: $160,000 * 0.04 / 12 = $533.33
    expect(result.mortgageCost).toBeCloseTo(533.33, 1);
  });

  test('should add PMI for down payment less than 20%', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const loanAmount = 170000;
    const downPaymentPercent = 15;
    const interestRate = { value: 4, isInterestOnly: false };
    const loanTerm = 30;
    
    const result = mortgageCalculation(purchasePrice, loanAmount, downPaymentPercent, interestRate, loanTerm);
    
    // Regular mortgage payment plus PMI
    // PMI: (loanAmount * 0.0085) / 12 = (170000 * 0.0085) / 12 = $120.42
    const expectedPaymentWithPMI = 811.61 + 120.42;
    expect(result.mortgageCost).toBeCloseTo(expectedPaymentWithPMI, 0);
  });

  test('should add upfront mortgage insurance for FHA loan (3.5% down)', () => {
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const loanAmount = 193000; // 96.5% of purchase price
    const downPaymentPercent = 3.5;
    const interestRate = { value: 4, isInterestOnly: false };
    const loanTerm = 30;
    
    const result = mortgageCalculation(purchasePrice, loanAmount, downPaymentPercent, interestRate, loanTerm);
    
    // FHA adds 1.75% to loan amount: 193000 * 1.0175 = 196377.5
    // Mortgage payment is around $937.5 without additional PMI
    // PMI is around 139.1
    expect(result.mortgageCost).toBeCloseTo(1076.6, 1);
  });
}); 