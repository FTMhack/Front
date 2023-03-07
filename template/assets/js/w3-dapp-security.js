//token abi
const tokenAbi = [
  // ERC-20 standard methods
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{ "name": "", "type": "string" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "name": "", "type": "string" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "name": "", "type": "bool" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "who", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

function displayExplanation(json) {
  const risks = [];
  for (const key in json) {
    if (json[key].is_open_source === "0") {
      risks.push({
        Value: 'Not open source',
        Explaination: "Un-open-sourced contracts may hide various unknown mechanisms and are extremely risky. When the contract is not open source, we will not be able to detect other risk items.",
      });
      console.log(risks);
    }
    if (json[key].malicious_contract === "1") {
      risks.push({
        Value: 'Malicious contract',
        Explaination: "describes whether the contract is a suspected malicious. Does not mean the address is completely safe. Maybe we just haven't found its malicious behavior.",
      });
      console.log(risks);
    }

    if (json[key].is_audit === "0") {
      risks.push({
        Value: 'no audit found',
        Explaination: "does not mean the dApp was not audited. Maybe we just haven't found audit information for this dApp yet.",
      });
      console.log(risks);
    }
    if (json[key].trust_list === "0") {
      risks.push({
        Value: 'Not in trust list',
        Explaination: "It describes whether the dapp is a famous and trustworthy one.",
      });
      console.log(risks);
    }
  }
  return risks;
}

function scrapeWebsite(ftmaddress) {
  const corsProxyUrl = '';
  const url = `https://ftmscan.com/address/${ftmaddress}`;

  return fetch(corsProxyUrl + url)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(data, "text/html");
      const nameTagElement = htmlDoc.querySelector("[data-toggle='tooltip'][title='Public Name Tag (viewable by anyone)']");
      const nameTagValue = nameTagElement.textContent;
      const linkElement = nameTagElement.nextElementSibling;
      const linkValue = linkElement.href;
      //console.log("scrapedata",nameTagValue,linkValue ) 
      // Return an object with the scraped data
      return {
        nameTag: nameTagValue,
        link: linkValue
      };
    })
    .catch(error => console.error(error));
}
// call marco's API
async function callDappSecurityAPI(linkValue) {
  try {
    const corsProxyUrl = 'https://';
    const url = 'warm-forest-96154.herokuapp.com/DappSecurity';
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

      async function getWalletTransactions(walletAddress) {
        const options = {
          chain: '0xfa',
          address: walletAddress,
        };

        const transactions = await Moralis.EvmApi.transaction.getWalletTransactionsVerbose(options);
        console.log(transactions);
        // const addressesx = transactions.result.flatMap(({ logs }) => logs.map(({ address }) => address));
        // console.log(addressesx);
        return transactions;
      }

      getWalletTransactions(account).then((transactions) => {
        // Filter transactions with non-empty logs
        const filteredTransactions = transactions.result.filter(
          (transaction) => transaction.logs.length != 0
        );
        console.log(filteredTransactions);
        const transactionData = [];
        const seenToAddresses = new Set();
        filteredTransactions.forEach(async (txWithLog) => {
          const toAddress = txWithLog._data.to._value;
          if (!seenToAddresses.has(toAddress)) {
            transactionData.push({
              toAddress,
              timeStamp: txWithLog._data.blockTimestamp,
              gasUsed: txWithLog._data.cumulativeGasUsed.value,
              hash: txWithLog._data.hash,
            });
            seenToAddresses.add(toAddress);
          }
        });

        // Log the array of objects as a table
        console.table(transactionData);
        // Create table
        const approvalsTable = document.getElementById('Approvals');
        transactionData.forEach(async (txData) => {
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
          const riskCell = newRow.insertCell();
          riskCell.innerText = 'Loading...';
          const nameCell = newRow.insertCell();
          nameCell.innerText = 'Loading...';
          try {
            const scrapedData = await scrapeWebsite(txData.toAddress);
            nameCell.innerText = scrapedData.nameTag;
            const riskLevel = await callDappSecurityAPI(scrapedData.link);
            console.log(riskLevel.contracts_security[0].contracts);
            //write json to string
            const json = JSON.stringify(riskLevel.contracts_security[0].contracts);
            //create a table from json array
            const table = document.createElement('table');
            table.setAttribute('class', 'table table-bordered');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');
            const tr = document.createElement('tr');
            const th1 = document.createElement('th');
            th1.innerHTML = 'malicious_creator';
            const th2 = document.createElement('th');
            th2.innerHTML = 'malicious_contract';
            const th3 = document.createElement('th');
            th3.innerHTML = 'openSource';
            tr.appendChild(th1);
            tr.appendChild(th2);
            tr.appendChild(th3);
            thead.appendChild(tr);
            table.appendChild(thead);
            table.appendChild(tbody);
            //create rows
            for (let i = 0; i < riskLevel.contracts_security[0].contracts.length; i++) {
              const tr = document.createElement('tr');
              const td1 = document.createElement('td');
              td1.innerHTML = riskLevel.contracts_security[0].contracts[i].malicious_creator;
              const td2 = document.createElement('td');
              td2.innerHTML = riskLevel.contracts_security[0].contracts[i].malicious_contract;
              const td3 = document.createElement('td');
              td3.innerHTML = riskLevel.contracts_security[0].contracts[i].is_open_source;
              tr.appendChild(td1);
              tr.appendChild(td2);
              tr.appendChild(td3);
              tbody.appendChild(tr);
            }
            riskCell.appendChild(table);

            // riskCell.innerText = json;
            // const risk = await displayExplanation(riskLevel)
            // console.log("risklevels",risk);
          } catch (error) {
            console.error(error);
            nameCell.innerText = 'Not available';
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

