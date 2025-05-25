const { operatingExpense } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('operatingExpense function', () => {
  test('should calculate total monthly expenses correctly', () => {
    const operatingExpenseInput = {
      isActive: true,
      expenses: [
        { name: 'Utilities', cost: 150, frequency: 'Monthly' },
        { name: 'Insurance', cost: 1200, frequency: 'Annually' },
        { name: 'Maintenance', cost: 200, frequency: 'Monthly' }
      ]
    };
    
    const result = operatingExpense(operatingExpenseInput);
    
    // Monthly: 150 + 200 = 350
    // Annual converted to monthly: 1200 / 12 = 100
    // Total monthly: 350 + 100 = 450
    expect(result.totalMonthlyExpenses).toBe(450);
    expect(result.totalFixedExpenses).toBe(0);
  });

  test('should handle non-recurring expenses correctly', () => {
    const operatingExpenseInput = {
      isActive: true,
      expenses: [
        { name: 'Appliance Replacement', cost: 2000, frequency: 'Non-recurring' },
        { name: 'Roof Repair', cost: 5000, frequency: 'Non-recurring' },
        { name: 'HOA', cost: 300, frequency: 'Monthly' }
      ]
    };
    
    const result = operatingExpense(operatingExpenseInput);
    
    expect(result.totalMonthlyExpenses).toBe(300);
    expect(result.totalFixedExpenses).toBe(7000); // 2000 + 5000
  });

  test('should return zero when inactive', () => {
    const operatingExpenseInput = {
      isActive: false,
      expenses: [
        { name: 'Utilities', cost: 150, frequency: 'Monthly' },
        { name: 'Insurance', cost: 1200, frequency: 'Annually' }
      ]
    };
    
    const result = operatingExpense(operatingExpenseInput);
    
    expect(result.totalMonthlyExpenses).toBe(0);
    expect(result.totalFixedExpenses).toBe(0);
  });

  test('should handle empty expenses array', () => {
    const operatingExpenseInput = {
      isActive: true,
      expenses: []
    };
    
    const result = operatingExpense(operatingExpenseInput);
    
    expect(result.totalMonthlyExpenses).toBe(0);
    expect(result.totalFixedExpenses).toBe(0);
  });

  test('should handle missing expenses property', () => {
    const operatingExpenseInput = {
      isActive: true
    };
    
    const result = operatingExpense(operatingExpenseInput);
    
    expect(result.totalMonthlyExpenses).toBe(0);
    expect(result.totalFixedExpenses).toBe(0);
  });
}); 