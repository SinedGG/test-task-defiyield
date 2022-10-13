const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://mainnet.infura.io/v3/a5064750a7094694934a875b873a9f3e`
  )
);

const express = require("express");
const app = express();

app.get("/:wallet", async (req, res) => {
  const wallet = req.params.wallet;
  if (web3.utils.isAddress(wallet)) {
    res.json(await main(wallet));
  } else {
    res.json({ message: "Inwalid wallet adress" });
  }
});

function main(wallet) {
  return new Promise(async (resolve) => {
    var result = [];
    const eth = await web3.eth.getBalance(wallet);
    const eth_balance = web3.utils.fromWei(eth);
    result.push({
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
          result.push({
            name: token[i].name,
            symbol: token[i].symbol,
            balance: format_balance,
          });
        }
      } catch (error) {}
    }
    resolve(result);
  });
}

const server = app.listen(process.env.PORT || 8080, () => {
  console.log("Listening on port %d", server.address().port);
});
