const { equityReturnCalc } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('equityReturnCalc function', () => {
  test('should calculate equity return correctly', () => {
    const maxEquity = 100000;
    const totalInvestment = 40000;
    
    const result = equityReturnCalc(maxEquity, totalInvestment);
    
    expect(result.equityReturn).toBe(60000); // 100000 - 40000 = 60000
    expect(result.equityReturnPerc).toBe(150); // (60000 / 40000) * 100 = 150%
  });

  test('should handle negative equity return', () => {
    const maxEquity = 30000;
    const totalInvestment = 50000;
    
    const result = equityReturnCalc(maxEquity, totalInvestment);
    
    expect(result.equityReturn).toBe(-20000); // 30000 - 50000 = -20000
    expect(result.equityReturnPerc).toBe(-40); // (-20000 / 50000) * 100 = -40%
  });
}); 