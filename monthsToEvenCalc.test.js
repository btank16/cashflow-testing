const { monthsToEvenCalc } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('monthsToEvenCalc function', () => {
  test('should calculate months to break even correctly', () => {
    const cashDown = 50000;
    const monthlyCashFlow = 500;
    
    const result = monthsToEvenCalc(cashDown, monthlyCashFlow);
    
    expect(result.monthsToEven).toBe(100); // 50000 / 500 = 100 months
  });

  test('should round up for partial months', () => {
    const cashDown = 10000;
    const monthlyCashFlow = 333;
    
    const result = monthsToEvenCalc(cashDown, monthlyCashFlow);
    
    // 10000 / 333 = 30.03, should round up to 31
    expect(result.monthsToEven).toBe(31);
  });

  test('should handle very small monthly cash flow', () => {
    const cashDown = 50000;
    const monthlyCashFlow = 10;
    
    const result = monthsToEvenCalc(cashDown, monthlyCashFlow);
    
    expect(result.monthsToEven).toBe(5000); // 50000 / 10 = 5000 months
  });

  test('should handle zero cash flow', () => {
    const cashDown = 50000;
    const monthlyCashFlow = 0;
    
    const result = monthsToEvenCalc(cashDown, monthlyCashFlow);
    
    expect(result.monthsToEven).toBe('N/A');
  });

  test('should handle negative cash flow', () => {
    const cashDown = 50000;
    const monthlyCashFlow = -100;
    
    const result = monthsToEvenCalc(cashDown, monthlyCashFlow);
    
    expect(result.monthsToEven).toBe('N/A');
  });
}); 