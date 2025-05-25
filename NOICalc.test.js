const { NOICalc } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('NOICalc function', () => {
  test('should calculate NOI correctly', () => {
    const monthRent = 2000;
    const operatingExpense = 800;
    const vacancy = 5; // 5%
    
    const result = NOICalc(monthRent, operatingExpense, vacancy);
    
    // Annual rent: 2000 * 12 = 24000
    // Annual expenses: 800 * 12 = 9600
    // Annual vacancy: 24000 * 0.05 = 1200
    // NOI: 24000 - (9600 + 1200) = 13200
    expect(result.NOI).toBe(13200);
  });

  test('should handle zero rent', () => {
    const monthRent = 0;
    const operatingExpense = 800;
    const vacancy = 5;
    
    const result = NOICalc(monthRent, operatingExpense, vacancy);
    
    // Without rent, the result should be negative annual operating expenses
    expect(result.NOI).toBe(-9600); // -(800 * 12)
  });

  test('should handle zero expenses', () => {
    const monthRent = 2000;
    const operatingExpense = 0;
    const vacancy = 5;
    
    const result = NOICalc(monthRent, operatingExpense, vacancy);
    
    // Annual rent minus vacancy: 24000 - 1200 = 22800
    expect(result.NOI).toBe(22800);
  });

  test('should handle zero vacancy', () => {
    const monthRent = 2000;
    const operatingExpense = 800;
    const vacancy = 0;
    
    const result = NOICalc(monthRent, operatingExpense, vacancy);
    
    // Annual rent minus expenses: 24000 - 9600 = 14400
    expect(result.NOI).toBe(14400);
  });
}); 