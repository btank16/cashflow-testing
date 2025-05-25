const { sum } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('sum function', () => {
  test('should sum positive numbers correctly', () => {
    const result = sum(10, 20, 30, 40);
    
    expect(result.total).toBe(100);
  });

  test('should sum negative numbers correctly', () => {
    const result = sum(-5, -10, -15);
    
    expect(result.total).toBe(-30);
  });

  test('should sum mixed positive and negative numbers', () => {
    const result = sum(10, -5, 15, -20);
    
    expect(result.total).toBe(0);
  });

  test('should handle decimals correctly', () => {
    const result = sum(1.1, 2.2, 3.3);
    
    expect(result.total).toBeCloseTo(6.6);
  });

  test('should handle no arguments', () => {
    const result = sum();
    
    expect(result.total).toBe(0);
  });
}); 