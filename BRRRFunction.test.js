const { BRRRRFunction } = require('../cashflow/app/Calculations/BRRRFunction.Js');
const CoreFunctions = require('../cashflow/app/Calculations/CoreFunctions.Js');

// Mock all CoreFunctions to isolate testing
jest.mock('../cashflow/app/Calculations/CoreFunctions.Js', () => ({
  downPayment: jest.fn().mockReturnValue({
    downPaymentCash: 30000,
    downPaymentPercent: 20,
    loanAmount: 120000
  }),
  mortgageCalculation: jest.fn()
    .mockImplementationOnce(() => ({ mortgageCost: 600 })) // Initial mortgage
    .mockImplementationOnce(() => ({ mortgageCost: 750 })), // Refinance mortgage
  propertyTax: jest.fn()
    .mockImplementationOnce(() => ({ monthlyPropTax: 150 })) // Initial property tax
    .mockImplementationOnce(() => ({ monthlyPropTax: 200 })), // Post-rehab property tax
  capEx: jest.fn().mockReturnValue({
    monthlyCapEx: 100
  }),
  operatingExpense: jest.fn().mockReturnValue({
    totalMonthlyExpenses: 250,
    totalFixedExpenses: 1500
  }),
  sum: jest.fn()
    .mockImplementationOnce(() => ({ total: 1000 })) // Pre-refinance expenses
    .mockImplementationOnce(() => ({ total: 56500 })) // Total cash down
    .mockImplementationOnce(() => ({ total: 61500 })) // Total investment
    .mockImplementationOnce(() => ({ total: 1300 })), // Post-refinance expenses
  closingCosts: jest.fn().mockReturnValue({
    closingCostTotal: 5000
  }),
  holdingExpenses: jest.fn().mockReturnValue({
    totalHoldingExpenses: 3000
  }),
  principalLeft: jest.fn().mockReturnValue({
    principalAmt: 118000
  }),
  maxEquityCalc: jest.fn().mockReturnValue({
    newLoanAmount: 160000,
    maxEquity: 42000
  }),
  equityReturnCalc: jest.fn().mockReturnValue({
    equityReturn: 20000,
    equityReturnPerc: 32.5
  }),
  cashFlow: jest.fn().mockReturnValue({
    monthlyCashflow: 700,
    annualCashflow: 7560
  }),
  cashOnCashCalc: jest.fn().mockReturnValue({
    cashOnCash: 12.3
  })
}));

describe('BRRRRFunction', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('should calculate BRRR strategy metrics correctly', () => {
    // Input parameters
    const purchasePrice = { value: 150000, isCashPurchase: false };
    const downPay = { value: 20, isDollar: false };
    const interestRate = { value: 5, isInterestOnly: false };
    const loanTerm = 30;
    const propTax = { value: 1.2, isDollar: false };
    const closingCost = { value: 3, isDollar: false };
    const capexEst = { value: 5, isDollar: false };
    const rehabCost = 20000;
    const rehabTime = 3; // months
    const refinanceCost = 2000;
    const newInterest = { value: 4.5, isInterestOnly: false };
    const newLoanTerm = 30;
    const afterRev = 200000; // After repair value
    const monthRent = 2000;
    const vacancyRate = 5;
    const operatingExpenses = {
      isActive: true,
      expenses: [
        { name: 'Insurance', cost: 1200, frequency: 'Annually' },
        { name: 'Utilities', cost: 150, frequency: 'Monthly' }
      ]
    };

    // Call the function
    const result = BRRRRFunction(
      purchasePrice,
      downPay,
      interestRate,
      loanTerm,
      propTax,
      closingCost,
      capexEst,
      rehabCost,
      rehabTime,
      refinanceCost,
      newInterest,
      newLoanTerm,
      afterRev,
      monthRent,
      vacancyRate,
      operatingExpenses
    );

    // Check that the core functions were called with correct parameters
    expect(CoreFunctions.operatingExpense).toHaveBeenCalledWith(operatingExpenses);
    expect(CoreFunctions.propertyTax).toHaveBeenCalledWith(purchasePrice, propTax);
    expect(CoreFunctions.downPayment).toHaveBeenCalledWith(purchasePrice, downPay);
    expect(CoreFunctions.mortgageCalculation).toHaveBeenCalledWith(
      purchasePrice, 120000, 20, interestRate, loanTerm
    );
    
    // Verify correct use of second mortgage calculation for refinance
    expect(CoreFunctions.mortgageCalculation).toHaveBeenCalledWith(
      { value: 200000, isCashPurchase: false }, 160000, 20, newInterest, newLoanTerm
    );

    // Verify the output array
    expect(result).toEqual([
      '600.00',              // mortgageCost
      '150.00',              // monthlyPropTax
      '250.00',              // totalMonthlyExpenses
      '750.00',              // BRRRmortgageCost
      '200.00',              // BRRRpropTax
      '100.00',              // monthlyCapEx
      '56500.00',            // totalCashDown
      '700.00',              // monthlyCashflow
      '7560.00',             // annualCashflow
      '12.30',               // cashOnCash
      '42000.00',            // maxEquity
      '32.50'                // equityReturnPerc
    ]);
  });
}); 