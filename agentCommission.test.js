const { agentCommission } = require('../cashflow/app/Calculations/CoreFunctions.Js');

describe('agentCommission function', () => {
  test('should calculate agent commission from dollar amount', () => {
    const ARV = 250000;
    const agentCommissionInput = { value: 7500, isDollar: true };
    
    const result = agentCommission(ARV, agentCommissionInput);
    
    expect(result.agentLoss).toBe(7500);
  });

  test('should calculate agent commission from percentage', () => {
    const ARV = 250000;
    const agentCommissionInput = { value: 3, isDollar: false }; // 3% of ARV
    
    const result = agentCommission(ARV, agentCommissionInput);
    
    expect(result.agentLoss).toBe(7500); // 250000 * 0.03 = 7500
  });

  test('should handle zero commission', () => {
    const ARV = 250000;
    const agentCommissionInput = { value: 0, isDollar: false };
    
    const result = agentCommission(ARV, agentCommissionInput);
    
    expect(result.agentLoss).toBe(0);
  });
}); 