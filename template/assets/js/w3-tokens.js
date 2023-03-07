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
async function callDappSecurityAPI(addressx) {
  try {
    const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const url = 'warm-forest-96154.herokuapp.com/tokenSecurity';
    const body = {
      chain: "250",
      address: [addressx]
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
  if (json[key].is_proxy === "1") {
    risks.push( {
      Value: 'Proxy',
      Explaination: "Most Proxy contracts are accompanied by modifiable implementation contracts, and implementation contracts may contain significant potential risk. When the contract is a Proxy, we will stop detecting other risk items.",
    });
    console.log(risks);
  }

  if (json[key].is_mintable === "1") {
    risks.push( {
      Value: 'Have mint function',
      Explaination: "Mint function will directly trigger a massive sell-off, causing the coin price to plummet. It is extremely risky. This function generally relies on ownership. When the contract does not have an owner (or if the owner is a black hole address) and the owner cannot be retrieved, this function will most likely be disabled.",
    });
    console.log(risks);
  }
  if (json[key].can_take_back_ownership === "1") {
    risks.push( {
        Value: 'Can take back ownership',
        Explaination: "Ownership is mostly used to adjust the parameters and status of the contract, such as minting, modification of slippage, suspension of trading, setting blacklist, etc. When the contract does not have an owner (or if the owner is a black hole address) and the owner cannot be retrieved, these functions will most likely be disabled.",
      }); 
      console.log(risks);
   }
  if (json[key].owner_change_balance === "1") {
    risks.push( {
      Value: 'Can change balance',
      Explaination: "Token with this feature means that the owner can modify anyone's balance, resulting in an asset straight to zero or a massive minting and sell-off. This function generally relies on ownership. When the contract does not have an owner (or if the owner is a black hole address) and the owner cannot be retrieved, this function will most likely be disabled.",
    }); 
    console.log(risks);
  }
  if (json[key].hidden_owner === "1") {
    risks.push( {
      Value: 'Hidden owner',
      Explaination: "Hidden owner is often used by developers to hide ownership and is often accompanied by malicious functionality. When the hidden owner exists, it is assumed that ownership has not been abandoned.",
    }); 
    console.log(risks);
  }
  if (json[key].selfdestruct === "1") {
    risks.push( {
      Value: 'Can self-destruct',
      Explaination: "When the self-destruct function is triggered, this contract will be destroyed, all functions will be unavailable, and all related assets will be erased.",
    });
    console.log(risks);
  }
  if (json[key].external_call === "1") {
    risks.push( {
      Value: 'Have external call',
      Explaination: "External call would cause the implementation of this contract to be highly dependent on other external contracts, which may be a potential risk.",
    });
    console.log(risks);
  }
  if (json[key].buy_tax != undefined && json[key].buy_tax != 0) {
    risks.push( {
      Value: 'Have buy tax',
      Explaination: "Buy tax is " + json[key].buy_tax + ". Buy tax will cause the actual value received when buying a token to be less than expected, and too much buy tax may lead to heavy losses.",
    });
    console.log(risks);
  }
  if(json[key].buy_tax != undefined && json[key].buy_tax != 0){
    risks.push( {
      Value: 'Have sell tax',
      Explaination: "Sell tax is" + json[key].sell_tax + "Sell tax will cause the actual value received when selling a token to be less than expected, and too much buy tax may lead to large losses.",
    });
    console.log(risks);
     }
  if(json[key].cannot_sell_all ==="1"){
    risks.push( {
      Value: "Can't sell all",
      Explaination: "This feature means that you will not be able to sell all your tokens in a single sale. Sometimes you need to leave a certain percentage of the token, e.g. 10%, sometimes you need to leave a fixed number of token, such as 10 token.",
    });
    console.log(risks);
    }
  if(json[key].slippage_modifiable ==="1"){
    risks.push( {
      Value: "modifiable slippage",
      Explaination: "Token with modifiable tax means that the contract owner can modify the buy tax or sell tax of the token. This may cause some losses, especially since some contracts have unlimited modifiable tax rates, which would make the token untradeable. ",
    });
    console.log(risks);
    }
  if(json[key].is_honeypot ==="1"){
    risks.push( {
      Value: "Honey pot",
      Explaination: "Honeypot is a contract that is designed to be exploited. It is often used to attract users to buy tokens, and then the contract will be exploited by the owner. ",
    });
    console.log(risks);
    }
  if(json[key].transfer_pausable ==="1"){
    risks.push( {
      Value: "Transfer pausable",
      Explaination: "Token with this feature means that the contract owner can pause the transfer function, which will cause the token to be untradeable. ",
    });
    console.log(risks);
    }
  if(json[key].is_blacklisted ==="1"){
    risks.push( {
      Value: "Blacklisted",
      Explaination: "Token with this feature means that the contract owner can add addresses to the blacklist, which will cause the token to be untradeable. ",
    });
    console.log(risks);
    }
  if(json[key].is_personal_slippage_modifiable ==="1"){
    risks.push( {
      Value: "Slippage modifiable",
      Explaination: "The contract owner may set a very outrageous tax rate for assigned address to block it from trading. Abuse of this funtcion will lead to great risks. ",
    });
    console.log(risks);
    }
  if(json[key].is_true_token ==="0"){
    risks.push( {
      Value: "Not a true token",
      Explaination: "This token is not a true token. It is a contract that is designed to be exploited. It is often used to attract users to buy tokens, and then the contract will be exploited by the owner. ",
    });
    console.log(risks);
    }
  if(json[key].is_airdrop_scam ==="1"){
    console.log("This token is a scam. It is often used to attract users to buy tokens, and then the contract will be exploited by the owner. ")
    risks.push( {
      Value: "Airdrop scam",
      Explaination: "This token is a scam. It is often used to attract users to buy tokens, and then the contract will be exploited by the owner. ",
    });
    console.log(risks);
    }
  if(json[key].trust_list ==="0"){
    risks.push( {
      Value: "Is not in trust list",
      Explaination: "It describes whether the token is a famous and trustworthy one. it's not famous or tristworhty",
    });
    console.log(risks);
    }
  if(json[key].other_potential_risks ==="1"){
    risks.push( {
      Value: "Other potential risks",
      Explaination: "This token has other potential risks. Please be careful.",
    });
    console.log(risks);
    } 
  }
  return risks;
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
                  const riskLevels = await displayExplanation(await callDappSecurityAPI(txData.Address));
                  const riskDiv = document.createElement('div');
                  riskDiv.className = 'risk-badges';
                  for (const riskLevel of riskLevels) {
                    const badge = document.createElement('div');
                    badge.className = 'badge badge-outline-danger';
                    badge.textContent = riskLevel.Value;
                    badge.title = riskLevel.Explanation;
                    riskDiv.appendChild(badge);
                  }
                  riskCell.innerHTML = '<td style="max-width: 100px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + riskDiv.outerHTML + '</td>';                  
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
