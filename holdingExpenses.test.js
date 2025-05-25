const { holdingExpenses } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('holdingExpenses function', () => {
  test('should calculate holding expenses correctly', () => {
    const monthsHeld = 6;
    const monthlyExpenses = 1500;
    
    const result = holdingExpenses(monthsHeld, monthlyExpenses);
    
    expect(result.totalHoldingExpenses).toBe(9000); // 6 * 1500 = 9000
  });

  test('should handle zero months held', () => {
    const monthsHeld = 0;
    const monthlyExpenses = 1500;
    
    const result = holdingExpenses(monthsHeld, monthlyExpenses);
    
    expect(result.totalHoldingExpenses).toBe(0);
  });

  test('should handle zero monthly expenses', () => {
    const monthsHeld = 6;
    const monthlyExpenses = 0;
    
    const result = holdingExpenses(monthsHeld, monthlyExpenses);
    
    expect(result.totalHoldingExpenses).toBe(0);
  });
}); 