const { PriceSuggestion } = require('../cashflow/app/Calculations/SuggestPrice.Js');
const CoreFunctions = require('../cashflow/app/Calculations/CoreFunctions.Js');

// Mock the CoreFunctions that are used in the SuggestPrice function
jest.mock('../cashflow/app/Calculations/CoreFunctions.Js', () => ({
  operatingExpense: jest.fn().mockImplementation((opExpense) => {
    // Simple mock implementation that returns expected values
    return {
      totalMonthlyExpenses: 200,
      totalFixedExpenses: 500
    };
  }),
  capEx: jest.fn().mockImplementation((rent, capExEst) => {
    if (capExEst.isDollar) {
      return { monthlyCapEx: Number(capExEst.value) / 12 };
    } else {
      return { monthlyCapEx: (rent * (Number(capExEst.value) / 100)) };
    }
  }),
  reverseMortgage: jest.fn().mockImplementation((intRate, downPayPerc, loanTerm) => {
    // Simplified mock for testing
    return {
      NormRate: 0.004743, // example rate for 20% down, 4.5% interest, 30yr
      LowDPRate: 0.005828  // example rate for <20% down including PMI
    };
  }),
  closingCosts: jest.fn().mockImplementation((purchasePrice, closingCost) => {
    if (closingCost.isDollar) {
      return { closingCostTotal: Number(closingCost.value) };
    } else {
      return { closingCostTotal: purchasePrice.value * (Number(closingCost.value) / 100) };
    }
  }),
  sum: jest.fn().mockImplementation((...args) => {
    return { total: args.reduce((acc, val) => acc + val, 0) };
  })
}));

describe('PriceSuggestion', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
  
  test('should calculate target purchase prices correctly with standard down payment', () => {
    // Input parameters
    const cashflowTarget = 200;
    const downPayPerc = 20; // 20%
    const intRate = 4.5; // 4.5%
    const loanTerm = 30; // 30 years
    const propTaxPerc = 1.2; // 1.2%
    const capExEst = { value: 5, isDollar: false }; // 5% of rent
    const monthRent = 1500;
    const closingCost = { value: 3, isDollar: false }; // 3% of purchase price
    const rehabCost = 5000;
    const operatingExpenses = {
      isActive: true,
      expenses: [
        { name: 'Insurance', cost: 1200, frequency: 'Annually' },
        { name: 'Utilities', cost: 100, frequency: 'Monthly' },
        { name: 'Landscaping', cost: 500, frequency: 'Non-recurring' }
      ]
    };

    // Call the function
    const result = PriceSuggestion(
      cashflowTarget,
      downPayPerc,
      intRate,
      loanTerm,
      propTaxPerc,
      capExEst,
      monthRent,
      closingCost,
      rehabCost,
      operatingExpenses
    );

    // Verify core functions were called with correct parameters
    expect(CoreFunctions.operatingExpense).toHaveBeenCalledWith(operatingExpenses);
    expect(CoreFunctions.capEx).toHaveBeenCalledWith(monthRent, capExEst);
    expect(CoreFunctions.reverseMortgage).toHaveBeenCalledWith(intRate, downPayPerc, loanTerm);
    
    // Verify that all 12 output values are present and correctly formatted
    expect(result).toHaveLength(12);
    
    // All values should be strings with 2 decimal places
    result.forEach(value => {
      expect(typeof value).toBe('string');
      expect(value).toMatch(/^\d+\.\d{2}$/);
    });

    // Basic validation of the logic
    const targetPrice = parseFloat(result[0]);
    const netZeroPrice = parseFloat(result[1]);
    
    // Target price should be less than net zero price (since we need to leave room for cashflow)
    expect(targetPrice).toBeLessThan(netZeroPrice);
    
    // Cash requirements should be proportional to prices
    const netZeroCash = parseFloat(result[2]);
    const targetPriceCash = parseFloat(result[3]);
    expect(targetPriceCash).toBeLessThan(netZeroCash);
  });

  test('should calculate target purchase prices correctly with low down payment', () => {
    // Input parameters with low down payment (adds PMI)
    const cashflowTarget = 200;
    const downPayPerc = 5; // 5%
    const intRate = 4.5;
    const loanTerm = 30;
    const propTaxPerc = 1.2;
    const capExEst = { value: 5, isDollar: false };
    const monthRent = 1500;
    const closingCost = { value: 3, isDollar: false };
    const rehabCost = 5000;
    const operatingExpenses = {
      isActive: true,
      expenses: [
        { name: 'Insurance', cost: 1200, frequency: 'Annually' },
        { name: 'Utilities', cost: 100, frequency: 'Monthly' }
      ]
    };

    // Call the function
    const result = PriceSuggestion(
      cashflowTarget,
      downPayPerc,
      intRate,
      loanTerm,
      propTaxPerc,
      capExEst,
      monthRent,
      closingCost,
      rehabCost,
      operatingExpenses
    );

    // Verify core functions were called with correct parameters
    expect(CoreFunctions.reverseMortgage).toHaveBeenCalledWith(intRate, downPayPerc, loanTerm);

    // With low down payment, the price should be lower due to PMI
    const targetPrice = parseFloat(result[0]);
    const netZeroPrice = parseFloat(result[1]);
    
    // Basic validation
    expect(targetPrice).toBeGreaterThan(0);
    expect(netZeroPrice).toBeGreaterThan(targetPrice);
  });

  test('should handle FHA loan calculation (3.5% down)', () => {
    // Input parameters for FHA loan
    const cashflowTarget = 200;
    const downPayPerc = 3.5; // 3.5% (FHA)
    const intRate = 4.5;
    const loanTerm = 30;
    const propTaxPerc = 1.2;
    const capExEst = { value: 5, isDollar: false };
    const monthRent = 1500;
    const closingCost = { value: 3, isDollar: false };
    const rehabCost = 5000;
    const operatingExpenses = {
      isActive: true,
      expenses: [
        { name: 'Insurance', cost: 1200, frequency: 'Annually' },
        { name: 'Utilities', cost: 100, frequency: 'Monthly' }
      ]
    };

    // Override the mock for FHA loan
    CoreFunctions.reverseMortgage.mockReturnValueOnce({
      NormRate: 0.004743,
      LowDPRate: 0.006123 // Higher rate for FHA loan
    });

    // Call the function
    const result = PriceSuggestion(
      cashflowTarget,
      downPayPerc,
      intRate,
      loanTerm,
      propTaxPerc,
      capExEst,
      monthRent,
      closingCost,
      rehabCost,
      operatingExpenses
    );

    // Verify core functions were called with correct parameters
    expect(CoreFunctions.reverseMortgage).toHaveBeenCalledWith(intRate, downPayPerc, loanTerm);

    // FHA loan should have additional costs (upfront MIP)
    const targetPrice = parseFloat(result[0]);
    
    // Basic validation
    expect(targetPrice).toBeGreaterThan(0);
    
    // With FHA loan, the price should be even lower due to upfront MIP and higher monthly PMI
    // Reset the mock to normal for the next call
    CoreFunctions.reverseMortgage.mockReturnValueOnce({
      NormRate: 0.004743,
      LowDPRate: 0.005828
    });
    
    const lowDPResult = PriceSuggestion(
      cashflowTarget, 5, intRate, loanTerm, propTaxPerc, 
      capExEst, monthRent, closingCost, rehabCost, operatingExpenses
    );
    
    const lowDPTargetPrice = parseFloat(lowDPResult[0]);
    expect(targetPrice).toBeLessThanOrEqual(lowDPTargetPrice);
  });

  test('should handle dollar-based capEx and closing costs', () => {
    // Input parameters with dollar-based inputs instead of percentages
    const cashflowTarget = 200;
    const downPayPerc = 20;
    const intRate = 4.5;
    const loanTerm = 30;
    const propTaxPerc = 1.2;
    const capExEst = { value: 600, isDollar: true }; // $600 annually
    const monthRent = 1500;
    const closingCost = { value: 4500, isDollar: true }; // $4500 flat fee
    const rehabCost = 5000;
    const operatingExpenses = {
      isActive: true,
      expenses: [
        { name: 'Insurance', cost: 1200, frequency: 'Annually' },
        { name: 'Utilities', cost: 100, frequency: 'Monthly' }
      ]
    };

    // For this test, make sure capEx returns the exact expected value
    CoreFunctions.capEx.mockReturnValueOnce({ monthlyCapEx: 50 });

    // Call the function
    const result = PriceSuggestion(
      cashflowTarget,
      downPayPerc,
      intRate,
      loanTerm,
      propTaxPerc,
      capExEst,
      monthRent,
      closingCost,
      rehabCost,
      operatingExpenses
    );

    // Verify that capEx was called with dollar-based input
    expect(CoreFunctions.capEx).toHaveBeenCalledWith(monthRent, capExEst);
    
    // Basic validation
    const targetPrice = parseFloat(result[0]);
    const netZeroPrice = parseFloat(result[1]);
    const monthlyCapEx = parseFloat(result[8]);
    
    expect(targetPrice).toBeGreaterThan(0);
    expect(netZeroPrice).toBeGreaterThan(targetPrice);
    expect(monthlyCapEx).toBe(50); // $600 / 12 = $50 monthly
  });
}); 