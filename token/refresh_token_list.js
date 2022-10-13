const fs = require("fs");
const axios = require("axios");
const data = require("./data.json");

(async () => {
  const data = await axios.get(`https://api.coingecko.com/api/v3/coins/list`);
  for (let i = 0; i < data.data.length; i++) {
    try {
      const token = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${data.data[i].id}`
      );
      if (token.data.hasOwnProperty("contract_address")) {
        add(token.data);
      }
      console.log(`Scanning ${i} of ${data.data.length}`);
    } catch (error) {
      i--;
      await delay(60 * 1000);
    }
  }
  console.log(`done`);
})();

function add(item) {
  var pass = true,
    contract = item.contract_address;
  for (let i = 0; i < data.length; i++) {
    if (data[i].contract == contract) {
      pass = false;
      break;
    }
  }
  if (pass) {
    var temp = { name: item.name, symbol: item.symbol, contract: contract };
    data.push(temp);
  }
  fs.writeFileSync("./token/data.json", JSON.stringify(data));
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
