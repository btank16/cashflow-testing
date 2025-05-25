const { flipFunction } = require('../cashflow/app/Calculations/FlipFunction.Js');
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
  operatingExpense: jest.fn().mockReturnValue({
    totalMonthlyExpenses: 300,
    totalFixedExpenses: 2000
  }),
  sum: jest.fn()
    .mockImplementationOnce(() => ({ total: 1300 })) // Monthly expenses
    .mockImplementationOnce(() => ({ total: 67000 })) // Total cash down
    .mockImplementationOnce(() => ({ total: 75800 })), // Total cash cost
  closingCosts: jest.fn().mockReturnValue({
    closingCostTotal: 5000
  }),
  holdingExpenses: jest.fn().mockReturnValue({
    totalHoldingExpenses: 8800
  }),
  agentCommission: jest.fn().mockReturnValue({
    agentLoss: 8400
  }),
  principalLeft: jest.fn().mockReturnValue({
    principalAmt: 157000
  }),
  totalProfitCalc: jest.fn().mockReturnValue({
    totalProfit: 38800
  }),
  ROI: jest.fn().mockReturnValue({
    PercROI: 19.4,
    CashROI: 51.2
  })
}));

describe('flipFunction', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('should calculate property flip metrics correctly', () => {
    // Input parameters
    const purchasePrice = { value: 200000, isCashPurchase: false };
    const downPay = { value: 20, isDollar: false };
    const interestRate = { value: 5, isInterestOnly: false };
    const loanTerm = 30;
    const propTax = { value: 1.2, isDollar: false };
    const closingCost = { value: 2.5, isDollar: false };
    const rehabCost = 20000;
    const afterRev = 280000; // After repair value
    const rehabTime = 6; // months
    const agentCommish = { value: 3, isDollar: false }; // 3% agent commission
    const operatingExpenses = {
      isActive: true,
      expenses: [
        { name: 'Insurance', cost: 1200, frequency: 'Annually' },
        { name: 'Utilities', cost: 200, frequency: 'Monthly' }
      ]
    };

    // Call the function
    const result = flipFunction(
      purchasePrice,
      downPay,
      interestRate,
      loanTerm,
      propTax,
      closingCost,
      rehabCost,
      afterRev,
      rehabTime,
      agentCommish,
      operatingExpenses
    );

    // Check that the core functions were called with correct parameters
    expect(CoreFunctions.operatingExpense).toHaveBeenCalledWith(operatingExpenses);
    expect(CoreFunctions.propertyTax).toHaveBeenCalledWith(purchasePrice, propTax);
    expect(CoreFunctions.downPayment).toHaveBeenCalledWith(purchasePrice, downPay);
    expect(CoreFunctions.mortgageCalculation).toHaveBeenCalledWith(
      purchasePrice, 160000, 20, interestRate, loanTerm
    );
    expect(CoreFunctions.closingCosts).toHaveBeenCalledWith(purchasePrice, closingCost);
    expect(CoreFunctions.holdingExpenses).toHaveBeenCalledWith(rehabTime, 1300);
    expect(CoreFunctions.agentCommission).toHaveBeenCalledWith(afterRev, agentCommish);
    expect(CoreFunctions.principalLeft).toHaveBeenCalledWith(160000, interestRate, rehabTime, 800);
    expect(CoreFunctions.totalProfitCalc).toHaveBeenCalledWith(
      purchasePrice, afterRev, 75800, 8400, 157000
    );
    expect(CoreFunctions.ROI).toHaveBeenCalledWith(38800, purchasePrice, 75800);

    // Verify the output array
    expect(result).toEqual([
      '800.00',              // mortgageCost
      '67000.00',            // totalCashDown
      '200.00',              // monthlyPropTax
      '300.00',              // totalMonthlyExpenses
      '75800.00',            // totalCashCost
      '19.40',               // PercROI
      '51.20',               // CashROI
      '38800.00'             // totalProfit
    ]);
  });
}); 