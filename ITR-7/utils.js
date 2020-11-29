const INDEX = 0;

const fetchNetProfit = (element, text) => {
  const result = element[INDEX].split(text);
  if (result && result[1] === '') { return "0" }
  return result && result[1];
}

//Pending
const fetchRevenue= (element , text) => {
  let result = element[INDEX].split(text);
  return element[0]
//   if (result && result[1] === '') { return "0" }
//   return result && result[1];
}

const fetchCurrentLiabilities = (element, text, index) => {
  if (element[index] === '') {
    return 0
  }
  return element[index]
}

const fetchtotalWages = (element, text, index) => {
  let result = element[index]
  if (result === '') { return 0 }
  result = result.slice(1)
  return result
}

const fetchtotalAssets = (element, text, index) => {
  let result = element[index]
  if (result === '') { return 0 }
  return result
}

const fetchtotalEquity = (element, text, index) => {
  let result = element[index]
  if (element[index].includes('Total expenses')) {
    result = result.split('Total expenses')
    return result[1]
  }
  else if (element[index].includes(text)) {
    result = result.split(text)
    return result[1]
  }
  if (result === '') { return 0 }
  return result

}

module.exports = {
  fetchNetProfit, fetchRevenue, fetchCurrentLiabilities, fetchtotalWages, fetchtotalAssets, fetchtotalEquity
}