const { wholesalefunction } = require('../cashflow/app/Calculations/WholesalingFunction.Js');
const CoreFunctions = require('../cashflow/app/Calculations/CoreFunctions.Js');

// Mock all CoreFunctions to isolate testing
jest.mock('../cashflow/app/Calculations/CoreFunctions.Js', () => ({
  operatingExpense: jest.fn().mockReturnValue({
    totalMonthlyExpenses: 200,
    totalFixedExpenses: 1000
  }),
  maximumAllowableOffer: jest.fn().mockReturnValue({
    MAO: 115000
  }),
  wholesalingFees: jest.fn()
    .mockImplementation((arv, contractPrice, feePercent) => {
      if (feePercent === 0.05) {
        return {
          wholesaleFee: 10000,
          wholesaleSalePrice: 110000
        };
      } else if (feePercent === 0.15) {
        return {
          wholesaleFee: 30000,
          wholesaleSalePrice: 130000
        };
      }
    })
}));

describe('wholesalefunction', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('should calculate wholesaling metrics correctly', () => {
    // Input parameters
    const contractPrice = 100000;
    const rehabCost = 25000;
    const afterRepairValue = 200000;
    const monthsHeld = 3;
    const operatingExpenses = {
      isActive: true,
      expenses: [
        { name: 'Insurance', cost: 600, frequency: 'Annually' },
        { name: 'Utilities', cost: 150, frequency: 'Monthly' }
      ]
    };

    // Call the function
    const result = wholesalefunction(
      contractPrice,
      rehabCost,
      afterRepairValue,
      monthsHeld,
      operatingExpenses
    );

    // Check that the core functions were called with correct parameters
    expect(CoreFunctions.operatingExpense).toHaveBeenCalledWith(operatingExpenses);
    expect(CoreFunctions.maximumAllowableOffer).toHaveBeenCalledWith(afterRepairValue, rehabCost);
    
    // Check that wholesalingFees was called with correct parameters for both fee levels
    expect(CoreFunctions.wholesalingFees).toHaveBeenCalledWith(afterRepairValue, contractPrice, 0.05);
    expect(CoreFunctions.wholesalingFees).toHaveBeenCalledWith(afterRepairValue, contractPrice, 0.15);

    // Calculate expected total expenses
    const expectedTotalExpenses = (200 * 3) + 1000;

    // Verify the output array
    expect(result).toEqual([
      '115000.00',         // MAO
      '1600.00',           // totalExpenses (200 * 3 + 1000)
      '10000.00',          // fee5Percent
      '30000.00',          // fee15Percent
      '110000.00',         // salePrice5Percent
      '130000.00'          // salePrice15Percent
    ]);
  });

  test('should handle zero monthly expenses', () => {
    // Mock zero monthly expenses
    CoreFunctions.operatingExpense.mockReturnValueOnce({
      totalMonthlyExpenses: 0,
      totalFixedExpenses: 500
    });

    // Input parameters
    const contractPrice = 100000;
    const rehabCost = 25000;
    const afterRepairValue = 200000;
    const monthsHeld = 3;
    const operatingExpenses = {
      isActive: true,
      expenses: [
        { name: 'One-time fee', cost: 500, frequency: 'Non-recurring' }
      ]
    };

    // Call the function
    const result = wholesalefunction(
      contractPrice,
      rehabCost,
      afterRepairValue,
      monthsHeld,
      operatingExpenses
    );

    // Verify the total expenses calculation
    expect(result[1]).toBe('500.00'); // (0 * 3) + 500 = 500
  });

  test('should handle zero holding period', () => {
    // Input parameters with zero months held
    const contractPrice = 100000;
    const rehabCost = 25000;
    const afterRepairValue = 200000;
    const monthsHeld = 0; // No holding period
    const operatingExpenses = {
      isActive: true,
      expenses: [
        { name: 'Insurance', cost: 600, frequency: 'Annually' },
        { name: 'Utilities', cost: 150, frequency: 'Monthly' },
        { name: 'One-time fee', cost: 800, frequency: 'Non-recurring' }
      ]
    };

    // Call the function
    const result = wholesalefunction(
      contractPrice,
      rehabCost,
      afterRepairValue,
      monthsHeld,
      operatingExpenses
    );

    // Verify the total expenses calculation (only fixed expenses)
    expect(result[1]).toBe('1000.00'); // (200 * 0) + 1000 = 1000
  });
}); 