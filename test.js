const pdf_table_json = require("./index.js");

const INDEX = 0;

const { fetchNetProfit, fetchRevenue , fetchaccountsReceivables , fetchCurrentLiabilities } = require("./purefunctions");

pdf_table_json("./ITR-5.pdf").then(res => {
  console.log(res.pageTables[7].tables);
  pdfParser(res);

});


const consts = {
  netProfit : 'iiiTotal Profit (65(i)d + 65(ii)d)65iii',
  totalRevenue: 'DTotal Revenue from operations (A(iv) + B +C(ix))D',
  accountsReceivables: 'C.Total Sundry DebtorsiiC',
  currentLiabilities: 'iiiTotal (iG + iiD)diii'


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

    if (checkElementExists(element , consts.netProfit , 0)) {
      const textString = removeEmptyString(element);
      ITR5.netProfit = fetchNetProfit(textString , consts.netProfit);
    }

    if (checkElementExists(element, consts.totalRevenue , 0)) {
      ITR5.totalRevenue = fetchRevenue(element, consts.totalRevenue);
    }

    if (checkElementExists(element, consts.accountsReceivables , 2)) {
      ITR5.accountsReceivables =  fetchaccountsReceivables(element, consts.accountsReceivables , 2) 
    }
    if (checkElementExists(element, consts.currentLiabilities , 0)) {
      console.log(fetchCurrentLiabilities(element, consts.currentLiabilities) , 'element');

      ITR5.currentLiabilities = fetchCurrentLiabilities(element, consts.currentLiabilities);
      
      // ITR5.accountsReceivables =  fetchaccountsReceivables(element, consts.accountsReceivables , 2) 
    }

    

    

    // (Part A-BS)-B-3-a-ii-C

    // (Part A )-4-D

  }
  console.log(ITR5 , 'ITR5');
  
  return ITR5;
  
}

removeEmptyString = (element) => {
  const result = element.filter(Boolean);
  return result;
}

checkElementExists = (element , text , index) => {
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
    incentives: 0,
    immediateAndCashEquivalents: 0,
    ebitda: 0,
    interestPayable: 0,
    currentLiabilities: 0,
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
  }
}