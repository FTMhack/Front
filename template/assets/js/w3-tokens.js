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

// call marco's API
async function callDappSecurityAPI(linkValue) {
  try {
    const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const url = 'warm-forest-96154.herokuapp.com/tokenSecurity';
    const body = {
      dapp: linkValue
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    const response = await fetch((corsProxyUrl + url), options);
    console.log(response)
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
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

        async function getWalletTokens(walletAddress) {
          const options = {
            address: walletAddress,
            chain: '0xfa',
          };

          const transactions = await Moralis.EvmApi.token.getWalletTokenBalances(options);
          //console.log(transactions);
          return transactions;
        }
        getWalletTokens(account).then((transactions) => {
          // Filter transactions with non-empty logs
            const filteredTransactions = transactions.result
            //console.log("filtered",filteredTransactions);
            const transactionData = [];
            const seenToAddresses = new Set();
            filteredTransactions.forEach( async (tx) => {
              const toAddress = tx._token._value.contractAddress._value;
              //console.log("toAddress",toAddress);
              if (!seenToAddresses.has(toAddress)) {
                transactionData.push({
                  Address: toAddress,
                  Symbol: tx._token._value.symbol,
                  Name: tx._token._value.name,
                  Decimals: tx._token._value.decimals,
                  Value: tx._value.amount.value,
                });
                seenToAddresses.add(toAddress);
              }
            });
          
            // Log the array of objects as a table
            console.table("thxdataend",transactionData);
              // Create table
              const approvalsTable = document.getElementById('Approvals');
              transactionData.forEach(async (txData) => {
                const newRow = approvalsTable.insertRow();
                newRow.insertCell().innerText = txData.Address;
                newRow.insertCell().innerText = txData.Symbol;
                newRow.insertCell().innerText = txData.Name;
                //newRow.insertCell().innerText = Number(txData.Value / BigInt(10 ** txData.Decimals));;
                newRow.insertCell().innerText = (txData.Value / BigInt(10 ** txData.Decimals)); 
                const riskCell = newRow.insertCell();
                riskCell.innerText = 'Loading...';
                try {
                  const riskLevel = await callDappSecurityAPI(txData.Address);
                  riskCell.innerText = riskLevel;
                } catch (error) {
                  console.error(error);
                  riskCell.innerText = 'Not available';
                }
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

