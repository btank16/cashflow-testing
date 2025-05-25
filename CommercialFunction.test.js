const { CommercialCalc } = require('../cashflow/app/Calculations/CommercialFunction.Js');
const CoreFunctions = require('../cashflow/app/Calculations/CoreFunctions.Js');

// Mock all CoreFunctions to isolate testing
jest.mock('../cashflow/app/Calculations/CoreFunctions.Js', () => ({
  downPayment: jest.fn().mockReturnValue({
    downPaymentCash: 60000,
    downPaymentPercent: 25,
    loanAmount: 180000
  }),
  mortgageCalculation: jest.fn().mockReturnValue({
    mortgageCost: 950
  }),
  propertyTax: jest.fn().mockReturnValue({
    monthlyPropTax: 300
  }),
  capEx: jest.fn().mockReturnValue({
    monthlyCapEx: 150
  }),
  operatingExpense: jest.fn().mockReturnValue({
    totalMonthlyExpenses: 500,
    totalFixedExpenses: 3000
  }),
  sum: jest.fn()
    .mockImplementationOnce(() => ({ total: 800 })) // Operating expenses
    .mockImplementationOnce(() => ({ total: 1900 })) // Total monthly expenses
    .mockImplementationOnce(() => ({ total: 75000 })), // Total acquisition costs
  NOICalc: jest.fn().mockReturnValue({
    NOI: 25000
  }),
  DSCRCalc: jest.fn().mockReturnValue({
    DSCR: '2.19'
  }),
  closingCosts: jest.fn().mockReturnValue({
    closingCostTotal: 6000
  }),
  acquisitionCosts: jest.fn().mockReturnValue({
    realAcquisitionCosts: 6000
  }),
  cashFlow: jest.fn().mockReturnValue({
    monthlyCashflow: 1100,
    annualCashflow: 11880
  }),
  cashOnCashCalc: jest.fn().mockReturnValue({
    cashOnCash: 15.84
  }),
  capRateCalc: jest.fn().mockReturnValue({
    capRate: 4.95
  }),
  monthsToEvenCalc: jest.fn().mockReturnValue({
    monthsToEven: 68
  })
}));

describe('CommercialCalc', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('should calculate commercial property metrics correctly', () => {
    // Input parameters
    const purchasePrice = 240000;
    const downPay = { value: 25, isDollar: false };
    const acquisitionCost = { value: 2.5, isDollar: false };
    const interestRate = { value: 5.5, isInterestOnly: false };
    const closingCost = { value: 2.5, isDollar: false };
    const loanTerm = 20;
    const grossRent = 30000; // Annual
    const rentFees = 6000; // Annual
    const vacancy = 5;
    const capExEst = { value: 4, isDollar: false };
    const propTax = { value: 1.5, isDollar: false };
    const operatingExpenses = {
      isActive: true,
      expenses: [
        { name: 'Insurance', cost: 2400, frequency: 'Annually' },
        { name: 'Maintenance', cost: 300, frequency: 'Monthly' }
      ]
    };

    // Call the function
    const result = CommercialCalc(
      purchasePrice,
      downPay,
      acquisitionCost,
      interestRate,
      closingCost,
      loanTerm,
      grossRent,
      rentFees,
      vacancy,
      capExEst,
      propTax,
      operatingExpenses
    );

    // Check that the proper purchase price object was created
    const expectedPurchasePrice = { value: 240000, isCashPurchase: false };
    
    // Check that core functions were called with correct parameters
    expect(CoreFunctions.downPayment).toHaveBeenCalledWith(expectedPurchasePrice, downPay);
    expect(CoreFunctions.mortgageCalculation).toHaveBeenCalledWith(
      expectedPurchasePrice, 180000, 25, interestRate, loanTerm
    );
    expect(CoreFunctions.propertyTax).toHaveBeenCalledWith(expectedPurchasePrice, propTax);
    
    // Check that monthly rent was calculated correctly (36000 / 12 = 3000)
    expect(CoreFunctions.capEx).toHaveBeenCalledWith(3000, capExEst);
    expect(CoreFunctions.operatingExpense).toHaveBeenCalledWith(operatingExpenses);
    expect(CoreFunctions.NOICalc).toHaveBeenCalledWith(3000, 800, vacancy);
    expect(CoreFunctions.DSCRCalc).toHaveBeenCalledWith(expectedPurchasePrice, 25000, 950);
    expect(CoreFunctions.closingCosts).toHaveBeenCalledWith(expectedPurchasePrice, closingCost);
    expect(CoreFunctions.acquisitionCosts).toHaveBeenCalledWith(expectedPurchasePrice, acquisitionCost);

    // Verify the output array
    expect(result).toEqual([
      '950.00',              // mortgageCost
      '75000.00',            // totalAcquisitionCosts
      '2.19',                // DSCR
      '300.00',              // monthlyPropTax
      '150.00',              // monthlyCapEx
      '500.00',              // totalMonthlyExpenses
      '15.84',               // cashOnCash
      '4.95',                // capRate
      68,                    // monthsToEven
      '11880.00'             // annualCashflow
    ]);
  });
}); 