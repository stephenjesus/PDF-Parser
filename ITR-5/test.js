const pdf2base64 = require('pdf-to-base64');

const pdf_table_json = require("../index");

const { fetchNetProfit, fetchRevenue, fetchaccountsReceivables, fetchCurrentLiabilities, fetchtotalWages, fetchSundryCreditors, fetchtotalLiabiltiies } = require("./purefunctions");


const consts = {
  netProfit: 'iiiTotal Profit (65(i)d + 65(ii)d)65iii',
  totalRevenue: 'DTotal Revenue from operations (A(iv) + B +C(ix))D',
  accountsReceivables: 'C.Total Sundry DebtorsiiC',
  currentLiabilities: 'iiiTotal (iG + iiD)diii',
  totalWages: "xiTotal compensation to employees(total of 22i to 22x)xi",
  grossTotalIncome: "Gross Total income (7 – 8)9",
  totalAssets: "Total(av + biv)3c",
  sundryCreditors: "Total (1 + 2)A3",
  immediateAndCashEquivalents: "Total Cash and cash equivalents (iiiA + iiiB + iiiC)iiiD",
  ebitda: "Profit before interest, depreciation and taxes [15 – (16 to 21 + 22xi + 23v + 24 to 29 + 30iii + 31iii + 32iii\n+ 33 to 43 + 44x + 45 + 46 + 47iii + 48iv + 49 + 50)]",
  interestPayable: "Total (ia + ib + iia + iib)",
  totalInterestPaid: "Total (ia + ib + iia + iib)",
  totalDebt: "c.Total Loan Funds(aiii + biii)2c",
  totalEquity: "c.Total partners\' / members\' fund (a + bvi)1c",
  depreciation: "Depreciation and amortisation.",
  totalLiabiltiies: "iiiTotal (iG + iiD)diii",
  totalSecuredLoan: "iiiTotal secured loans (ai + iiC)aiii",
  totalUnsecuredLoan: "iiiTotal unsecured loans(bi + iiD)biii"
}

const S3URL = `https://actyv-assets.s3.ap-south-1.amazonaws.com/test-images/msme/ITR5.pdf`;

pdftoBase64(S3URL);

async function pdftoBase64(S3URL) {

  const result = await pdf2base64(S3URL);

  const uintArray = base64ToUint8Array(result);

  const response = await pdf_table_json(uintArray, false);

  pdfParser(response);

}

const base64ToUint8Array = (base64) => {
  var raw = atob(base64);
  var uint8Array = new Uint8Array(raw.length);
  for (var i = 0; i < raw.length; i++) {
    uint8Array[i] = raw.charCodeAt(i);
  }
  return uint8Array;
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

  const ITR5 = formatITR5Object();

  finalResult = mergePDFTables(result);

  for (let index = 0; index < finalResult.length; index++) {

    const element = finalResult[index];

    if (checkElementExists(element, consts.netProfit, 0)) {
      const textString = removeEmptyString(element);
      ITR5.netProfit = fetchNetProfit(textString, consts.netProfit);
    }

    if (checkElementExists(element, consts.totalRevenue, 0)) ITR5.totalRevenue = fetchRevenue(element, consts.totalRevenue);

    if (checkElementExists(element, consts.accountsReceivables, 2)) ITR5.accountsReceivables = fetchaccountsReceivables(element, consts.accountsReceivables, 2);

    if (checkElementExists(element, consts.currentLiabilities, 0)) ITR5.currentLiabilities = fetchCurrentLiabilities(element, consts.currentLiabilities);

    if (checkElementExists(element, consts.totalWages, 1)) ITR5.totalWages = fetchtotalWages(element, consts.totalWages, 1);

    if (checkElementExists(element, consts.grossTotalIncome, 1)) ITR5.grossTotalIncome = fetchtotalWages(element, consts.grossTotalIncome, 1);

    if (checkElementExists(element, consts.totalAssets, 2)) ITR5.totalAssets = fetchtotalWages(element, consts.totalAssets, 2);

    if (checkElementExists(element, consts.sundryCreditors, 2)) ITR5.sundryCreditors = fetchSundryCreditors(element, consts.sundryCreditors, 2);

    if (checkElementExists(element, consts.immediateAndCashEquivalents, 2)) ITR5.immediateAndCashEquivalents = fetchtotalWages(element, consts.immediateAndCashEquivalents, 2);

    if (checkElementExists(element, consts.ebitda, 1)) ITR5.ebitda = element[element.length - 1]

    if (checkElementExists(element, consts.interestPayable, 2)) ITR5.interestPayable = element[element.length - 1];

    if (checkElementExists(element, consts.totalInterestPaid, 2)) ITR5.totalInterestPaid = element[element.length - 1];

    if (checkElementExists(element, consts.totalDebt, 1)) ITR5.totalDebt = fetchtotalWages(element, consts.totalDebt, 1);

    if (checkElementExists(element, consts.totalEquity, 1)) ITR5.totalEquity = fetchtotalWages(element, consts.totalEquity, 1);

    if (checkElementExists(element, consts.depreciation, 1)) ITR5.depreciation = element[element.length - 1];

    if (checkElementExists(element, consts.totalLiabiltiies, 0)) ITR5.totalLiabiltiies = fetchtotalLiabiltiies(element, consts.totalLiabiltiies, 0);

    if (checkElementExists(element, consts.totalSecuredLoan, 1)) ITR5.totalSecuredLoan = fetchtotalWages(element, consts.totalSecuredLoan, 1);

    if (checkElementExists(element, consts.totalUnsecuredLoan, 1)) ITR5.totalUnsecuredLoan = fetchtotalWages(element, consts.totalUnsecuredLoan, 1);

  }

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
    accountsReceivables: 0,
    currentLiabilities: 0,
    currentAssets: 0,
    totalAssets: 0,
    totalLiabiltiies: 0,
    totalWages: 0,
    grossProfitMargin: 0,
    grossTotalIncome: 0,
    incentives: 0,
    immediateAndCashEquivalents: 0,
    ebitda: 0,
    interestPayable: 0,
    netProfit: 0,
    debtorDays: 0,
    creditorDays: 0,
    totalDebt: 0,
    totalEquity: 0,
    pbit: 0,
    totalInterestPaid: 0,
    goodsSoldPrice: 0,
    sundryCreditors: 0,
    itrFilingGap: 0,
    revenueGrowth: 0,
    turnOver: 0,
    depreciation: 0,
    totalSecuredLoan: 0,
    totalUnsecuredLoan: 0,
    inventory: 0,
    totalIncome: 0,
  }
}