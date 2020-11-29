const pdf_table_json = require("../index");

pdf_table_json("./ITR-3.pdf").then(res => {
  console.log(res.pageTables[4].tables);
  pdfParser(res);
});

const formatITR5Object = () => {
  return {
    totalRevenue: 0,
    accountsReceivables: 0,
    currentLiabilities: 0,
    totalSalaries: 0,
    grossTotalIncome: 0,
    currentAssets: 0,
    totalCurrentAssets: 0,
    totalCurrentLiabilities: 0,
    totalWages: 0,
    grossProfitMargin: 0,
    incentives: 0,
    immediateAndCashEquivalents: 0,
    ebitda: 0,
    interestPayable: 0,
    borrowings: 0,
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
    totalAssets: 0,
    totalSecuredLoans: 0,
    totalUnSecuredLoans: 0
  }
}

const conditionStatements = [
  { propertyName: 'totalRevenue', indexPosition: 0, pattern: 'DTotal Revenue from operations (Aiv + B+Cix)1D' },
  { propertyName: 'accountReceivables', indexPosition: 1, pattern: 'iiSundry Debtorsaii' },
  { propertyName: 'currentLiabilities', indexPosition: 1, pattern: 'iiiTotal(iE + iiD)diii' },
  { propertyName: 'totalSalaries', indexPosition: 1, pattern: 'xiTotal compensation to employees (14i + 14ii + 14iii + 14iv + 14v + 14vi + 14vii + 14viii +14ix +\n' + '14x)\n' + '14xi' },
  { propertyName: 'grossTotalIncome', indexPosition: 1, pattern: 'Gross Total income (8 - 9) (5xiv of Schedule BFLA + 5b)10' },
  { propertyName: 'totalCurrentAssets', indexPosition: 1, pattern: 'cTotal of current assets, loans and advances (av + biv)3c' },
  { propertyName: 'totalCurrentLiabilities', indexPosition: 1, pattern: 'iiiTotal(iE + iiD)diii' },
  { propertyName: 'immediateAndCashEquivalents', indexPosition: 1, pattern: 'C.Total(iiiA + iiiB)iiiC' },
  {
    propertyName: 'ebitda', indexPosition: 0, pattern: '42.Profit before interest, depreciation and taxes [4 – (5iv + 6 + 7xii + 8 to 13 + 14xi + 15v + 16 to 21 + 22iii +\n' +
      '23iii + 24iii + 25 to 35 + 36x + 37 + 38iii + 39vi + 40 + 41)]\n' + '42'
  },
  { propertyName: 'interestPayable', indexPosition: 0, pattern: 'iii.Total (i + ii)43iii' },
  { propertyName: 'borrowings', indexPosition: 1, pattern: 'cTotal investments(aiii + biv)2c' },
  { propertyName: 'netProfit', indexPosition: 0, pattern: '48Profit after tax ( 45 - 46 - 47).48' },

  { propertyName: 'fixedAssets', indexPosition: 0, pattern: 'eTotal(1c + 1d)1e' },
  { propertyName: 'loansAndAdvances', indexPosition: 1, pattern: 'iiDeposits,loans and advances to corporates and othersbii' },
  { propertyName: 'inventoryAssets', indexPosition: 1, pattern: 'E.Total(iA + iB + iC + iD)iE' },
  { propertyName: 'depreciationAndAmortisation', indexPosition: 0, pattern: '44Depreciation and amortisation.44' },

  { propertyName: 'totalInterestPaid', indexPosition: 0, pattern: 'iii.Total (i + ii)43iii' },

  { propertyName: 'openingStock', indexPosition: 0, pattern: 'ivTotal (5i + 5ii + 5iii)5iv' },
  { propertyName: 'purchases', indexPosition: 0, pattern: '6Purchases (net of refunds and duty or tax, if any)6' },
  { propertyName: 'directExpenses', indexPosition: 0, pattern: 'xiiTotal (7i + 7ii + 7iii + 7iv + 7v + 7vi + 7vii+ 7viii + 7ix + 7x + 7xi)  7xii' },
  { propertyName: 'closingStock', indexPosition: 0, pattern: 'Total (3i + 3ii + 3iii)3iv' },

  { propertyName: 'sundryCreditors', indexPosition: 1, pattern: 'A.Sundry CreditorsiA' },
  { propertyName: 'totalSecuredLoans', indexPosition: 0, pattern: 'iii.Total(ai + iiC)aiii' },
  { propertyName: 'totalUnSecuredLoans', indexPosition: 0, pattern: 'iii.Total(bi + bii)biii' },
]

/**
 * @description Function for concatinating the entire table data into a single table
 * @name mergePDFTables
 */
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

/**
 * @description Function for checking whether the pattern is present in the particular index or not
 * @name checkElementExists
 * @param {Array} element 
 * @param {String} text 
 * @param {Number} index 
 * @returns {Boolean}
 */
const checkElementExists = (element, text, index) => {
  return element && element[index] && element[index].includes(text)
}

/**
 * @description Function which returns extracted values from the patterns it gots matched.
 * @name extractValueFromPattern
 * @param {Array} element 
 * @param {String} text 
 * @param {Number} index 
 * @returns {Number}
 */
const extractValueFromPattern = (element, text, index = 0) => {
  const result = element[index].split(text);
  if (result && result[1] === '') { return 0 }
  return result && result[1];
}

/**
 * @description Function returns final ITR - 3 object with all the extracted values...
 * @name pdfParser
 * @param {Object} result 
 */
const pdfParser = (result) => {

  let finalResult = [];

  let ITR5 = formatITR5Object();

  finalResult = mergePDFTables(result);

  conditionStatements.map(item => {
    for (let index = 0; index < finalResult.length; index++) {
      const element = finalResult[index];
      if (checkElementExists(element, item.pattern, item.indexPosition)) {
        return ITR5[`${item.propertyName}`] = extractValueFromPattern(element, item.pattern, item.indexPosition)
      }
    }
  })

  ITR5.totalAssets = Number(ITR5.fixedAssets) + Number(ITR5.loansAndAdvances) + Number(ITR5.inventoryAssets);

  ITR5.pbit = Number(ITR5.ebitda) - Number(ITR5.depreciationAndAmortisation);

  ITR5.goodsSoldPrice = Number(ITR5.openingStock) + Number(ITR5.purchases) + Number(ITR5.directExpenses) - Number(ITR5.closingStock);

  console.log(ITR5, 'ITR5');

  return ITR5;

}

