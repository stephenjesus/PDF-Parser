const pdf_table_json = require("../index");

const { fetchNetProfit, fetchRevenue, fetchCurrentLiabilities, fetchtotalWages, fetchtotalAssets, fetchtotalEquity } = require("./utils.js");

pdf_table_json("./ITR-7.pdf").then(res => {
  // console.log(res.pageTables[11].tables);
  pdfParser(res);
});


const consts = {
  totalRevenue: '10Total',
  currentLiabilities: ['Less: Total liability of trust/institution', 'Liability in respect of assets at 4 above'],
  totalWages: "3Compensation to employees",
  // grossTotalIncome: "Gross Total income (7 – 8)9", Doubt
  staffWelfareExpenses: '5Workmen and staff welfare expenses',
  totalAssets: "Net value of assets (1 - 2)",
  interestExpenses: ['8Interest payable u/s 115TE8', '10Additional income-tax and interest payable10', '11Tax and interest paid11'],
  totalEquity: ['1Addition to Capital work in progress (for which exemption u/s 11(1A) has not been claimed)', '2Acquisition of capital asset (not claimed as application of income and for which exemption u/s 11(1A) has not been\n' +
    'claimed)'
    , '3Cost of new asset for claim of Exemption u/s 11(1A) (restricted to the net consideration)', 'Total expenses', '5Total capital expenses (1 + 2 + 3 + 4)5'],
}

mergePDFTables = (result) => {
  let finalResult = [];

  if (result.pageTables && result.pageTables.length) {
    for (let index = 0; index < result.pageTables.length; index++) {
      const element = result.pageTables[index];
      finalResult = finalResult.concat(element && element.tables);
    }
  }
  return finalResult;
}

pdfParser = (result) => {

  let finalResult = [];
  var currentLiabilities = []
  var interestExpenses = []
  var totalEquity = []

  const ITR5 = formatITR5Object();

  finalResult = mergePDFTables(result);

  for (let index = 0; index < finalResult.length; index++) {
    const element = finalResult[index];
    if (checkElementExists(element, consts.netProfit, 0)) {
      const textString = removeEmptyString(element);
      ITR5.netProfit = fetchNetProfit(textString, consts.netProfit);
    }


    // const elementVal = finalResult[11];
    if (checkElementExists(element, consts.totalRevenue, 0)) ITR5.totalRevenue = fetchRevenue(element, consts.totalRevenue);

    if (checkElementExists(element, consts.currentLiabilities[0], 1)) currentLiabilities[0] = parseInt(fetchCurrentLiabilities(element, consts.currentLiabilities[0], 7));

    if (checkElementExists(element, consts.currentLiabilities[1], 1)) currentLiabilities[1] = parseInt(fetchCurrentLiabilities(element, consts.currentLiabilities[1], 7));

    if (checkElementExists(element, consts.totalWages, 0)) ITR5.totalWages = fetchtotalWages(element, consts.totalWages, 5);

    if (checkElementExists(element, consts.staffWelfareExpenses, 0)) ITR5.staffWelfareExpenses = fetchtotalWages(element, consts.staffWelfareExpenses, 5);

    if (checkElementExists(element, consts.totalAssets, 1)) ITR5.totalAssets = fetchtotalAssets(element, consts.totalAssets, 7);


    if (checkElementExists(element, consts.interestExpenses[0], 0)) interestExpenses[0] = parseInt(fetchtotalAssets(element, consts.interestExpenses[0], 19));

    if (checkElementExists(element, consts.interestExpenses[1], 0)) interestExpenses[1] = parseInt(fetchtotalAssets(element, consts.interestExpenses[1], 19));

    if (checkElementExists(element, consts.interestExpenses[2], 0)) interestExpenses[2] = parseInt(fetchtotalAssets(element, consts.interestExpenses[2], 19));

    for (let i = 0; i < 3; i++) {
      if (checkElementExists(element, consts.totalEquity[i], 0)) totalEquity[i] = parseInt(fetchtotalEquity(element, consts.totalEquity[i], 6));
    }

    for (let i = 3; i < 5; i++) {
      if (checkElementExists(element, consts.totalEquity[i], 0)) totalEquity[i] = parseInt(fetchtotalEquity(element, consts.totalEquity[i], 0));
    }
  }

  ITR5.currentLiabilities = currentLiabilities[0] + currentLiabilities[1]
  ITR5.interestExpenses = interestExpenses[0] + interestExpenses[1] + interestExpenses[2]
  ITR5.totalEquity = totalEquity[0] + totalEquity[1] + totalEquity[2] + totalEquity[3] + totalEquity[4]
  ITR5.totalBorrowings = ITR5.currentLiabilities
  ITR5.totalDebt = ITR5.currentLiabilities
  ITR5.totalLiabiltiies = ITR5.currentLiabilities

  console.log(ITR5, 'ITR5');
  return ITR5;
}

removeEmptyString = (element) => {
  const result = element.filter(Boolean);
  return result;
}

checkElementExists = (element, text, index) => {
  return element && element[index] && element[index].includes(text)
}

formatITR5Object = () => {
  return {
    totalRevenue: 0,
    currentLiabilities: 0,
    totalAssets: 0,
    totalLiabiltiies: 0,
    interestExpenses: 0,
    staffWelfareExpenses: 0,
    totalBorrowings: 0,
    totalDebt: 0,
    totalWages: 0,
    totalEquity: 0,

    grossTotalIncome: 0,
    netProfit: 0,
  }
}