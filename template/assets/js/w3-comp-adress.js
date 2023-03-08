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

function displayExplanation_compromised(obj) {
  const risks = [];
  if (obj.honeypot_related_address == "1") {
    risks.push({
      Value: 'Honeypot related',
      Explanation: "mean the creators or owners of the honeypot tokens.This is a dangerous address if the address is ralated to honeypot tokens.",
    });
  }
  if (obj.phishing_activities == "1") {
    risks.push({
      Value: 'Phishing activities',
      Explanation: "this address has implemented phishing activities.",
    });
  }
  if (obj.blackmail_activities == "1") {
    risks.push({
      Value: 'Blachmail activities',
      Explanation: "this address has implemented blackmail activities.",
    });
  }
  if (obj.stealing_attack == "1") {
    risks.push({
      Value: 'Stealing attack',
      Explanation: "this address has implemented stealing attacks.",
    });
  }
  if (obj.fake_kyc == "1") {
    risks.push({
      Value: 'Fake KYC',
      Explanation: "this address is involved in fake KYC.",
    });
  }
  if (obj.malicious_mining_activities == "1") {
    risks.push({
      Value: 'Malicious mining activities',
      Explanation: "this address is involved in malicious mining activities.",
    });
  }
  if (obj.darkweb_transactions == "1") {
    risks.push({
      Value: 'Darkweb transactions',
      Explanation: "this address is involved in darkweb transactions.",
    });
  }
  if (obj.cybercrime == "1") {
    risks.push({
      Value: 'Cybercrime',
      Explanation: "this address is involved in cybercrime.",
    });
  }
  if (obj.money_laundering == "1") {
    risks.push({
      Value: 'Money laundering',
      Explanation: "this address is involved in money laundering.",
    });
  }
  if (obj.financial_crime == "1") {
    risks.push({
      Value: 'Financial crime',
      Explanation: "this address is involved in financial crime.",
    });
  }
  if (obj.blacklist_doubt == "1") {
    risks.push({
      Value: 'Blacklist doubt',
      Explanation: "this address is suspected of malicious behavior.",
    });
  }
  if (obj.mixer == "1") {
    risks.push({
      Value: 'Mixer',
      Explanation: "this address is coin mixer address.",
    });
  }
  if (obj.sanctioned == "1") {
    risks.push({
      Value: 'Sanctioned',
      Explanation: "this address is sanctioned.",
    });
  }
  if (risks.length === 0) {
    risks.push({
      Value: 'No risk identified',
      Explanation: "No potential risks were identified for this dApp.",
    });
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
async function callDappSecurityAPI_compromised(Value) {
  try {
    const corsProxyUrl = 'https://';
    const url = 'warm-forest-96154.herokuapp.com/addressSecurity';
    const body = {
      chain: "250",
      address: Value,
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    console.log("addressasked", Value)
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
  const onboardButton = document.getElementById('connectButton_comp');
  const getAccountsButton = document.getElementById('connectButton_comp');
  const getAccountsResult = document.getElementById('walletAddress_comp');
  const Disconnect = document.getElementById('disconnect_comp');

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

      async function getWalletTransactions_comp(walletAddress) {
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

      getWalletTransactions_comp(account).then((transactions) => {
        // Filter transactions with non-empty logs
        const filteredTransactions = transactions.result.filter(
          (transaction) => transaction.logs.length == 0
        );
        console.log("filtered", filteredTransactions);
        const transactionData = [];
        const seenToAddresses = new Set();
        filteredTransactions.forEach(async (txWithLog) => {
          const toAddress = txWithLog._data.to._value;
          const fromAddress = txWithLog._data.from._value;
          if (!seenToAddresses.has(toAddress) && !seenToAddresses.has(fromAddress)) {
            transactionData.push({
              toAddress,
              fromAddress,
              timeStamp: txWithLog._data.blockTimestamp,
              gasUsed: txWithLog._data.cumulativeGasUsed.value,
              hash: txWithLog._data.hash,
            });
            seenToAddresses.add(toAddress);
          }
        });

        // Log the array of objects as a table
        console.table(transactionData);
        //Create table
        const approvalsTable = document.getElementById('Approvals');
        transactionData.forEach(async (txData) => {
          const newRow = approvalsTable.insertRow();
          newRow.insertCell().innerText = txData.toAddress;
          newRow.insertCell().innerText = txData.fromAddress;
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
            try {
             if (txData.toAddress = accounts[0]) {
              const riskLevel = await callDappSecurityAPI_compromised(txData.fromAddress);
              console.log("riskleve", riskLevel);
              const expl = displayExplanation_compromised(riskLevel);
              console.log("explenation",expl);
              const riskDiv = document.createElement('div');
              riskDiv.className = 'risk-badges';
              for (const riskLevel of expl) {
                if (riskLevel.Value === 'No risk identified') {
                  const badge = document.createElement('div');
                  badge.className = 'badge badge-outline-success';
                  badge.textContent = riskLevel.Value;
                  badge.title = riskLevel.Explanation;
                  riskDiv.appendChild(badge);
                 }
                 else {
                   const badge = document.createElement('div');
                   badge.className = 'badge badge-outline-danger';
                   badge.textContent = riskLevel.Value;
                   badge.title = riskLevel.Explanation;
                   riskDiv.appendChild(badge);
                 }
              }
              riskCell.innerHTML = '<td style="max-width: 100px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + riskDiv.outerHTML + '</td>';
             }
             elif (txData.fromAddress = accounts[0]); {
               const riskLevel = await callDappSecurityAPI_compromised(txData.toAddress);
               console.log("riskleve", riskLevel);
               const expl = displayExplanation_compromised(riskLevel);
               console.log("explenation",expl);
               const riskDiv = document.createElement('div');
               riskDiv.className = 'risk-badges';
               for (const riskLevel of expl) {
                if (riskLevel.Value === 'No risk identified') {
                 const badge = document.createElement('div');
                 badge.className = 'badge badge-outline-success';
                 badge.textContent = riskLevel.Value;
                 badge.title = riskLevel.Explanation;
                 riskDiv.appendChild(badge);
                }
                else {
                  const badge = document.createElement('div');
                  badge.className = 'badge badge-outline-danger';
                  badge.textContent = riskLevel.Value;
                  badge.title = riskLevel.Explanation;
                  riskDiv.appendChild(badge);
                }
                
               }
               riskCell.innerHTML = '<td style="max-width: 100px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + riskDiv.outerHTML + '</td>';
             }
            } catch (error) {
          //   console.error(error);
          //   riskCell.innerText = 'Not available';
          //   if (nameCell.innerText === 'Loading...') {
          //     nameCell.innerText = 'Not available';
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

