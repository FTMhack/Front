//token abi
const tokenAbi = [
  // ERC-20 standard methods
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name":"","type":"string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name":"","type":"string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name":"","type":"uint8"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name":"spender","type":"address"},
      {"name":"value","type":"uint256"}
    ],
    "name": "approve",
    "outputs": [{"name":"","type":"bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {"name":"owner","type":"address"},
      {"name":"spender","type":"address"}
    ],
    "name": "allowance",
    "outputs": [{"name":"","type":"uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name":"to","type":"address"},
      {"name":"value","type":"uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name":"","type":"bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name":"who","type":"address"}],
    "name": "balanceOf",
    "outputs": [{"name":"","type":"uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

function scrapeWebsite(ftmaddress) {
  const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const url = `https://ftmscan.com/address/${ftmaddress}`;
  const scrapedData = [];
  
  fetch(corsProxyUrl + url)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(data, "text/html");
      const nameTagElement = htmlDoc.querySelector("[data-toggle='tooltip'][title='Public Name Tag (viewable by anyone)']");
      const nameTagValue = nameTagElement.textContent;
      scrapedData.push(nameTagValue);
      console.log(nameTagValue);
      const linkElement = nameTagElement.nextElementSibling;
      const linkValue = linkElement.href;
      scrapedData.push(linkValue);
      console.log(linkValue);      
      // Do something with the scraped data from the htmlDoc object
    })
    .catch(error => console.error(error));
}



const initialize = () => {
  //Basic Actions Section
  const onboardButton = document.getElementById('connectButton');
  const getAccountsButton = document.getElementById('connectButton');
  const getAccountsResult = document.getElementById('walletAddress');
  const Disconnect = document.getElementById('disconnect');

  //Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      await ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      //We take the first address in the array of addresses and display it
      const account = accounts[0];
      const accountLength = account.length;
      const truncatedAccount = accountLength > 8 ? account.slice(0, 4) + "..." + account.slice(accountLength - 4) : account;
      getAccountsResult.innerHTML = "<a href='https://ftmscan.com/address/" + accounts[0] + "' target='_blank'>" + truncatedAccount + "</a>" || 'Not able to get accounts';
      getAccountsButton.remove();
      Disconnect.innerHTML = '<p style="font-size: 12px; font-weight: 400; color: #6c7293; margin-top: 20px;">You are connected to your wallet</p>';
      
      // extract all the smart contract dapps address that have interacted with the wallet
        Moralis.start({
          apiKey: 'jLi9qnff5zpDilqiq1zGxEJsDG8808RHaYRhVjr2Ice5b8cjfHESCtUx3ZvLtP5q'
        });

        async function getWalletTransactions(walletAddress) {
          const options = {
            chain: '0xfa',
            address: walletAddress,
          };

          const transactions = await Moralis.EvmApi.transaction.getWalletTransactionsVerbose(options);
          console.log(transactions);
          return transactions;
        }

        getWalletTransactions(account).then((transactions) => {
          // Filter transactions with non-empty logs
            const filteredTransactions = transactions.result.filter(
              (transaction) => transaction.logs.length != 0
            );

            const transactionData = [];
            const seenToAddresses = new Set();
            filteredTransactions.forEach((txWithLog) => {
              const toAddress = txWithLog._data.to._value;
              if (!seenToAddresses.has(toAddress)) {
                transactionData.push({
                  toAddress,
                  timeStamp: txWithLog._data.blockTimestamp,
                  gasUsed: txWithLog._data.cumulativeGasUsed.value,
                  hash: txWithLog._data.hash
                });
                seenToAddresses.add(toAddress);
              }
            });
          
            // Log the array of objects as a table
            console.table(transactionData);
              // Create table
              const approvalsTable = document.getElementById('Approvals');
              transactionData.forEach((txData) => {
                const newRow = approvalsTable.insertRow();
                newRow.insertCell().innerText = txData.toAddress;
                const hashCell = newRow.insertCell();
                const hashLink = document.createElement('a');
                hashLink.href = `https://ftmscan.com/tx/${txData.hash}`;
                hashLink.target = '_blank';
                hashLink.rel = 'noopener noreferrer';
                hashLink.innerText = "hash";
                hashCell.appendChild(hashLink);
                const formattedTimeStamp = new Date(txData.timeStamp).toLocaleString('en-US', {
                  month: 'numeric',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: false
                });
                newRow.insertCell().innerText = formattedTimeStamp;
                newRow.insertCell().innerText = txData.gasUsed;
                newRow.insertCell().innerText = 'Low'; // add the function that calls marco's api
                scrapeWebsite(txData.toAddress);
              });
          });
    } catch (error) {
      console.error(error);
    }
  }; 
  
  function MetaMaskClientCheck() {
  //Now we check to see if Metmask is installed
  if (!isMetaMaskInstalled()) {
    //If it isn't installed we ask the user to click to install it
    onboardButton.innerText = 'Click here to install MetaMask!';
    //When the button is clicked we call th is function
    onboardButton.onclick = onClickInstall;
    //The button is now disabled
    onboardButton.disabled = false;
  } else {
    //if metamask is connected to another netwrok that is not 250 switch to 250
    if (ethereum.networkVersion != 250) {
      ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xfa' }], // chainId must be in hexadecimal numbers
      });
    }
    //If MetaMask is installed we ask the user to connect to their wallet
    onboardButton.innerText = 'Connect Wallet';
    //When the button is clicked we call this function to connect the users MetaMask Wallet
    onboardButton.onclick = onClickConnect;
    //The button is now disabled
    onboardButton.disabled = false;
    
  }
  };

  MetaMaskClientCheck();
  console.log('MetaMaskClientCheck called')
};

window.addEventListener('DOMContentLoaded', initialize);