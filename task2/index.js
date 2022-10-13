const fs = require("fs");
const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://mainnet.infura.io/v3/a5064750a7094694934a875b873a9f3e`
  )
);

const js = require("./config.json");

for (let i = 0; i < js.wallets.length; i++) {
  get_info(js.wallets[i]);
}

async function get_info(wallet) {
  const eth = await web3.eth.getBalance(wallet);
  const eth_balance = web3.utils.fromWei(eth);
  add({
    time: get_date(),
    wallet: wallet,
    name: "Ethereum",
    symbol: "ETH",
    balance: eth_balance,
  });

  const token = require("../token/data.json");
  const abi = require("../token/abi.json");
  for (var i = 0; i < token.length; i++) {
    try {
      const contract = new web3.eth.Contract(abi, token[i].contract);
      const token_balance = await contract.methods.balanceOf(wallet).call();
      const format_balance = web3.utils.fromWei(token_balance);
      if (format_balance > 0) {
        add({
          time: get_date(),
          wallet: wallet,
          name: token[i].name,
          symbol: token[i].symbol,
          balance: format_balance,
        });
      }
    } catch (error) {}
  }
  setTimeout(() => {
    get_info(wallet);
  }, 60 * 1000);
}

function add(item) {
  //console.log(item);
  var json_file = require("./out.json");
  console.log(json_file);
  json_file.push(item);
  fs.writeFileSync("./task2/out.json", JSON.stringify(json_file));
}

function get_date() {
  var date = new Date();
  var str =
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds() +
    " " +
    date.getDate() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getFullYear();
  return str;
}
