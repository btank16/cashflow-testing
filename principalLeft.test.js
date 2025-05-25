const { principalLeft } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('principalLeft function', () => {
  test('should calculate remaining principal correctly after some payments', () => {
    const loanAmount = 200000;
    const interestRate = { value: 4, isInterestOnly: false };
    const monthsHeld = 12; // 1 year
    const mortgageCost = 954.83; // Monthly payment
    
    const result = principalLeft(loanAmount, interestRate, monthsHeld, mortgageCost);
    
    expect(result.principalAmt).toBeCloseTo(196477.9, 0); // Approximation from online calculator
  });

  test('should return original amount for zero months held', () => {
    const loanAmount = 200000;
    const interestRate = { value: 4, isInterestOnly: false };
    const monthsHeld = 0;
    const mortgageCost = 954.83;
    
    const result = principalLeft(loanAmount, interestRate, monthsHeld, mortgageCost);
    
    expect(result.principalAmt).toBe(loanAmount);
  });
  
  test('should calculate large principal reduction over many years', () => {
    const loanAmount = 200000;
    const interestRate = { value: 4, isInterestOnly: false };
    const monthsHeld = 120; // 10 years
    const mortgageCost = 954.83;
    
    const result = principalLeft(loanAmount, interestRate, monthsHeld, mortgageCost);
    
    // After 10 years, the principal should be significantly reduced
    expect(result.principalAmt).toBeCloseTo(157568, 0); // Approximation from online calculator
  });

  test('should handle interest-only loan correctly', () => {
    const loanAmount = 200000;
    const interestRate = { value: 4, isInterestOnly: true };
    const monthsHeld = 12; // 1 year
    const mortgageCost = 666.67; // Interest-only payment: 200000 * 0.04 / 12
    
    const result = principalLeft(loanAmount, interestRate, monthsHeld, mortgageCost);
    
    // In an interest-only loan, the principal should remain the same
    expect(result.principalAmt).toBeCloseTo(loanAmount, 0);
  });
}); 