const { capEx } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('capEx function', () => {
  test('should calculate capital expenditure from dollar amount', () => {
    const monthRent = 1500;
    const capExInput = { value: 1200, isDollar: true };
    
    const result = capEx(monthRent, capExInput);
    
    expect(result.monthlyCapEx).toBe(100); // 1200 / 12 = 100
  });

  test('should calculate capital expenditure from percentage', () => {
    const monthRent = 1500;
    const capExInput = { value: 5, isDollar: false }; // 5% of rent
    
    const result = capEx(monthRent, capExInput);
    
    expect(result.monthlyCapEx).toBe(75); // 1500 * 0.05 = 75
  });

  test('should handle zero capital expenditure', () => {
    const monthRent = 1500;
    const capExInput = { value: 0, isDollar: false };
    
    const result = capEx(monthRent, capExInput);
    
    expect(result.monthlyCapEx).toBe(0);
  });

  test('should work with zero rent', () => {
    const monthRent = 0;
    const capExInput = { value: 5, isDollar: false };
    
    const result = capEx(monthRent, capExInput);
    
    expect(result.monthlyCapEx).toBe(0);
  });
}); 