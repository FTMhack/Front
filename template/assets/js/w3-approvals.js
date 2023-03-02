
//remove token approvals
async function removeApproval(tokenAddress, spenderAddress) {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  // Get the contract instance for the token
  const web3 = new Web3(window.ethereum);
  const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);

  // Remove the approval
  await tokenContract.methods.approve(spenderAddress, 0).send({ from: accounts[0] });
}

//remove all token approvals
function removeAllApprovals() {
  const approvalsTable = document.getElementById('approvals');
  const rows = approvalsTable.getElementsByTagName('tr');
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName('td');
    const contractAddress = cells[2].textContent;
    const xspender = cells[3].textContent;
    removeApproval(contractAddress, xspender);
  }
}

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

const initialize = () => {
  //Basic Actions Section
  const onboardButton = document.getElementById('connectButton');
  const getAccountsButton = document.getElementById('connectButton');
  const getAccountsResult = document.getElementById('walletAddress');
  const Disconnect = document.getElementById('disconnect');
  const apikey = "P15VH8DXKCN3ZRDS66RDT9KVY9KJ3FTUV4";

  //Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };
  const isMetaMaskInstalledRpc = () => {
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
      //infinite approvals
      //Query transaction history
      const lastTxForSpenderAndContract = {};
      fetch(`https://api.ftmscan.com/api?module=account&action=txlist&address=${accounts[0]}&apikey=${apikey}`)
      .then(response => response.json())
      .then(data => {
        //Look for ERC-20 token approval transactions and decode the data field
        const approvalTxs = data.result.filter(tx => tx.input.startsWith('0x095ea7b3')); //&& tx.input.endsWith('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'));
        approvalTxs.forEach(tx => {
          const contractAddress = tx.to;
          const data = tx.input;
          const spender = data.slice(34, 74);
          const value = data.slice(74, 138);
          const decimalValue = parseInt(value, 16);
          xspender = "0x"+spender;
          console.log(tx.input, tx.timeStamp);
          //console.log(`Token approval of ${decimalValue} tokens granted to ${xspender} for contract ${contractAddress}`);
          //remove all the values tx.input that ends with "0000000000000000000000000000000000000000000000000000000000000000" and tx.timeStamp is the nearest to the current time
          // Check if this is the latest transaction for this spender and contract address
          if (!tx.input.endsWith('0000000000000000000000000000000000000000000000000000000000000000')) {
          // Create a new table row and insert data
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${new Date(tx.timeStamp * 1000).toLocaleString()}</td>
            <td><a href="https://ftmscan.com/tx/${tx.hash}" target="_blank">hash</a></td>
            <td>${tx.to}</td>
            <td>${xspender}</td>
            <td>${value === "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" ? "∞" :decimalValue}</td>
            <td><button type="button" class="btn btn-inverse-warning btn-fw" onclick="removeApproval('${contractAddress}', '${xspender}')">Remove approval</button></td>
          `;

          // Append the row to the table
          document.getElementById('approvals').appendChild(row);
          } else {
            // Remove all transactions that have the same xspender and tx.to with approval set to 0
            const approvalsTable = document.getElementById('approvals');
            const rows = approvalsTable.getElementsByTagName('tr');
            for (let i = 0; i < rows.length; i++) {
              const row = rows[i];
              const cells = row.getElementsByTagName('td');
              if (cells[2].textContent === tx.to && cells[3].textContent === xspender) {
                approvalsTable.removeChild(row);
              }
            }
          }

        });
        })
        
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