const { rentalFunction } = require('../cashflow/app/Calculations/RentalFunction.Js');
const CoreFunctions = require('../cashflow/app/Calculations/CoreFunctions.Js');

// Mock all CoreFunctions to isolate testing
jest.mock('../cashflow/app/Calculations/CoreFunctions.Js', () => ({
  downPayment: jest.fn().mockReturnValue({
    downPaymentCash: 40000,
    downPaymentPercent: 20,
    loanAmount: 160000
  }),
  mortgageCalculation: jest.fn().mockReturnValue({
    mortgageCost: 800
  }),
  propertyTax: jest.fn().mockReturnValue({
    monthlyPropTax: 200
  }),
  capEx: jest.fn().mockReturnValue({
    monthlyCapEx: 75
  }),
  operatingExpense: jest.fn().mockReturnValue({
    totalMonthlyExpenses: 300,
    totalFixedExpenses: 1000
  }),
  sum: jest.fn()
    .mockImplementationOnce(() => ({ total: 500 })) // totalMonthlyExpenses + monthlyPropTax
    .mockImplementationOnce(() => ({ total: 1375 })) // monthOperatingExpenses + mortgageCost + monthlyCapEx
    .mockImplementationOnce(() => ({ total: 46000 })), // downPaymentCash + closingCostTotal + totalFixedExpenses + rehabCost
  NOICalc: jest.fn().mockReturnValue({
    NOI: 18000
  }),
  DSCRCalc: jest.fn().mockReturnValue({
    DSCR: '1.88'
  }),
  closingCosts: jest.fn().mockReturnValue({
    closingCostTotal: 5000
  }),
  cashFlow: jest.fn().mockReturnValue({
    monthlyCashflow: 625,
    annualCashflow: 6750
  }),
  cashOnCashCalc: jest.fn().mockReturnValue({
    cashOnCash: 14.67
  }),
  capRateCalc: jest.fn().mockReturnValue({
    capRate: 3.38
  }),
  monthsToEvenCalc: jest.fn().mockReturnValue({
    monthsToEven: 74
  })
}));

describe('rentalFunction', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('should calculate rental property metrics correctly', () => {
    // Input parameters
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const downPay = { value: 20, isDollar: false };
    const interestRate = { value: 4.5, isInterestOnly: false };
    const loanTerm = 30;
    const propTax = { value: 1.2, isDollar: false };
    const closingCost = { value: 2.5, isDollar: false };
    const capexEst = { value: 5, isDollar: false };
    const rehabCost = 0;
    const monthRent = 2000;
    const vacancyRate = 5;
    const operatingExpenses = {
      isActive: true,
      expenses: [
        { name: 'Insurance', cost: 1200, frequency: 'Annually' },
        { name: 'Utilities', cost: 200, frequency: 'Monthly' }
      ]
    };

    // Call the function
    const result = rentalFunction(
      purchasePrice,
      downPay,
      interestRate,
      loanTerm,
      propTax,
      closingCost,
      capexEst,
      rehabCost,
      monthRent,
      vacancyRate,
      operatingExpenses
    );

    // Check that the core functions were called with correct parameters
    expect(CoreFunctions.operatingExpense).toHaveBeenCalledWith(operatingExpenses);
    expect(CoreFunctions.propertyTax).toHaveBeenCalledWith(purchasePrice, propTax);
    expect(CoreFunctions.capEx).toHaveBeenCalledWith(monthRent, capexEst);
    expect(CoreFunctions.downPayment).toHaveBeenCalledWith(purchasePrice, downPay);
    expect(CoreFunctions.mortgageCalculation).toHaveBeenCalledWith(
      purchasePrice, 160000, 20, interestRate, loanTerm
    );
    expect(CoreFunctions.closingCosts).toHaveBeenCalledWith(purchasePrice, closingCost);

    // Verify the output array
    expect(result).toEqual([
      '800.00',              // mortgageCost
      '46000.00',            // totalCashDown
      '1.88',                // DSCR
      '200.00',              // monthlyPropTax
      '75.00',               // monthlyCapEx
      '300.00',              // totalMonthlyExpenses
      '625.00',              // monthlyCashflow
      '6750.00',             // annualCashflow
      '14.67',               // cashOnCash
      '3.38',                // capRate
      74                     // monthsToEven
    ]);
  });
}); 