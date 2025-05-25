const { reverseMortgage } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('reverseMortgage function', () => {
  test('should calculate normal rate correctly', () => {
    const interestRate = 4; // 4%
    const DownPayPerc = 20; // 20% down
    const LoanTerm = 30; // 30 years
    
    const result = reverseMortgage(interestRate, DownPayPerc, LoanTerm);
    
    // This is a complex calculation that returns a rate factor
    expect(result.NormRate).toBeCloseTo(0.0038, 3);
    expect(result.LowDPRate).toBeCloseTo(0.0043, 3);
  });

  test('should calculate low down payment rate with PMI', () => {
    const interestRate = 4; // 4%
    const DownPayPerc = 10; // 10% down
    const LoanTerm = 30; // 30 years
    
    const result = reverseMortgage(interestRate, DownPayPerc, LoanTerm);

    expect(result.NormRate).toBeCloseTo(0.0042, 3);
    expect(result.LowDPRate).toBeCloseTo(0.0049, 3);
  });

  test('should handle FHA loan with 3.5% down', () => {
    const interestRate = 4; // 4%
    const DownPayPerc = 3.5; // 3.5% down (FHA)
    const LoanTerm = 30; // 30 years
    
    const result = reverseMortgage(interestRate, DownPayPerc, LoanTerm);
    
    // FHA loan with upfront MIP and monthly MIP
    expect(result.NormRate).toBeCloseTo(0.0045, 3);
    expect(result.LowDPRate).toBeCloseTo(0.0053, 3);  
  });
}); 