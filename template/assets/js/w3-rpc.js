//create a new network based on the data extracted from chainlist.json 
async function createNewNetwork(chainData) {
  const params = [
    {
      chainId: `0x${parseInt(chainData.chainId).toString(16)}`,
      chainName: chainData.name,
      nativeCurrency: {
        name: chainData.nativeCurrencyName,
        symbol: chainData.nativeCurrencySymbol,
        decimals: chainData.nativeCurrencyDecimals,
      },
      rpcUrls: [chainData.rpcUrl[0]],
      blockExplorerUrls: [chainData.blockExplorerUrl],
    },
  ];

  try {
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params,
    });
    console.log("Successfully added new network");
  } catch (error) {
    console.error(error);
  }
}

const initialize = () => {
  //Basic Actions Section

  const isMetaMaskInstalledRpc = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  //RPCs
  const onboardButtonRpc = document.getElementById('connectButtonRpc');
  const getAccountsButtonRpc = document.getElementById('connectButtonRpc');
  const getAccountsResultRpc = document.getElementById('walletAddressRpc');
  const DisconnectRpc = document.getElementById('disconnectRpc');
  const onClickRpc = async () => {
    try {
      // Will open the MetaMask UI
      await ethereum.request({ method: 'eth_requestAccounts' });
      const accountsRpc = await ethereum.request({ method: 'eth_accounts' });
      //We take the first address in the array of addresses and display it
      const accountRpc = accountsRpc[0];
      const accountLengthRpc = accountRpc.length;
      const truncatedAccountRpc = accountLengthRpc > 8 ? accountRpc.slice(0, 4) + "..." + accountRpc.slice(accountLengthRpc - 4) : accountRpc;
      getAccountsResultRpc.innerHTML = "<a href='https://ftmscan.com/address/" + accountRpc + "' target='_blank'>" + truncatedAccountRpc + "</a>" || 'Not able to get accounts';
      getAccountsButtonRpc.remove();
      DisconnectRpc.innerHTML = '<p style="font-size: 12px; font-weight: 400; color: #6c7293; margin-top: 20px;">You are connected to your wallet</p>';
      const provider = window.ethereum;
      const networkId = await provider.request({ method: 'eth_chainId' });
      const networkIdDecimal = parseInt(networkId, 16);
      const networkListening = await provider.request({ method: 'net_listening' });
      const chainData = await getChainData(networkIdDecimal);
      
      async function getChainData(networkId) {
        const response = await fetch('https://chainid.network/chains.json');
        const data = await response.json();
        for (const chainData of Object.values(data)) {
          if (chainData.chainId === networkId) {
            return {
              chainId: chainData.chainId,
              name: chainData.name,
              rpcUrl: chainData.rpc,
              nativeCurrencyName: chainData.nativeCurrency.name,
              nativeCurrencySymbol: chainData.nativeCurrency.symbol,
              nativeCurrencyDecimals: chainData.nativeCurrency.decimals,
              blockExplorerUrl: chainData.explorers[0].url,
            };
          }
        }
        throw new Error('Unknown network ID');
      }


      // Create a new table row and insert data
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${chainData.chainId}</td>
        <td>${chainData.name}</td>
        <td>${chainData.blockExplorerUrl}</td>
        <td>${chainData.rpcUrl.join('<br>')}</td>
        <td>${chainData.nativeCurrencySymbol}</td>
        <td>${chainData.nativeCurrencyDecimals}</td>
        <td><button type="button" class="btn btn-inverse-warning btn-fw" onclick="createNewNetwork({
          chainId: '${chainData.chainId}',
          name: '${chainData.name}',
          rpcUrl: ['${chainData.rpcUrl[0]}'],
          nativeCurrencyName: '${chainData.nativeCurrencyName}',
          nativeCurrencySymbol: '${chainData.nativeCurrencySymbol}',
          nativeCurrencyDecimals: ${chainData.nativeCurrencyDecimals},
          blockExplorerUrl: '${chainData.blockExplorerUrl}'
        })">Create Network</button></td>
      `;

      // Append the row to the table
      document.getElementById('rpcInfos').appendChild(row);
    } catch (error) {
      console.error(error);
    }
  };

  function MetaMaskClientCheckRpc() {
    //Now we check to see if Metmask is installed
       if (!isMetaMaskInstalledRpc()) {
         //If it isn't installed we ask the user to click to install it
         onboardButtonRpc.innerText = 'Click here to install MetaMask!';
         //When the button is clicked we call th is function
         onboardButtonRpc.onclick = onClickInstall;
         //The button is now disabled
         onboardButtonRpc.disabled = false;
       } else {
         //If MetaMask is installed we ask the user to connect to their wallet
         onboardButtonRpc.innerText = 'Connect Wallet';
         //When the button is clicked we call this function to connect the users MetaMask Wallet
         onboardButtonRpc.onclick = onClickRpc;
         //The button is now disabled
         onboardButtonRpc.disabled = false;
       }
   };
  MetaMaskClientCheckRpc();
  console.log('MetaMaskClientCheckRpc called')
};

window.addEventListener('DOMContentLoaded', initialize);