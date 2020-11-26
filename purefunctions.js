const INDEX = 0;

const fetchNetProfit = (element , text) => {
   const result = element[INDEX].split(text);
   if (result && result[1] === '') { return 0 }
   return result && result[1];
}

const fetchRevenue= (element , text) => {
  let result = element[INDEX].split(text);
  if (result && result[1] === '') { return 0 }
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

module.exports = { fetchNetProfit, fetchRevenue , fetchaccountsReceivables, fetchCurrentLiabilities }