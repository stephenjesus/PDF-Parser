const INDEX = 0;

const fetchNetProfit = (element , text) => {
   const result = element[INDEX].split(text);
   if (result && result[1] === '') { return "0" }
   return result && result[1];
}

const fetchRevenue= (element , text) => {
  let result = element[INDEX].split(text);
  if (result && result[1] === '') { return "0" }
  return result && result[1];
}

const fetchaccountsReceivables = (element , text , index) => {
  let result = element[index].split(text);
  if (result && result[1] === '') { return 0 }
  return result && result[1];
}

const fetchCurrentLiabilities = (element, text) => {
  let result = element[INDEX].split(text);
  if (result && result[1] && result[1].includes('\neNet current assets(3c - 3diii)3e0')) {
    result[1] = result[1].replace('\neNet current assets(3c - 3diii)3e0', "");
  }
  if (result && result[1] === '') { return 0 }
  return result && result[1];
}

const fetchtotalWages = (element , text , index) => {
  let result = element[index].split(text);
  if (result && result[1] === '') { return 0 }
  return result && result[1];
}

const fetchSundryCreditors = (element , text , index) => {
  let result = element[index].split(text);
  if (result && result[1] && result && result[1].includes("\nB.Liability for leased assetsiB")) {
    result = result[1].split("\nB.Liability for leased assetsiB")[0]
  }
  if (result && result[1] === '') { return 0 }
  return result ? result : 0;
}

const fetchtotalLiabiltiies = (element , text , index) => {
   let result = element[index].split(text);
  if (result && result[1].includes("\neNet current assets(3c - 3diii)3e")) {
    result = result[1].split("\neNet current assets(3c - 3diii)3e")[0]
  }
  if (result && result[1] === '') { return 0 }
  return result ? result : 0;
}

module.exports = { fetchNetProfit, fetchRevenue , fetchaccountsReceivables, 
  fetchCurrentLiabilities, fetchtotalWages, fetchSundryCreditors, fetchtotalLiabiltiies }