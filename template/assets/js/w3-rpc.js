const initialize = () => {
  //Basic Actions Section
  const apikey = "P15VH8DXKCN3ZRDS66RDT9KVY9KJ3FTUV4";

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
      //RPCs data
      // Retrieve the chain ID of the currently selected network
      // const chainId0 = await ethereum.request({ method: 'net_version' });
      // const provider = window.ethereum;
      // const chainId = chainId0-1;
      // const chainListResponse = await fetch('https://chainid.network/chains.json');
      // const chainList = await chainListResponse.json();
      // console.log(chainId0, chainId, chainList);
      // //chech if the chain ID is inside the chain list and print the chain info corrispondent to the chain id
      // if (chainList[chainId]) {
      //   const chainInfo = chainList[chainId];
      //   console.log(chainInfo);
      //   console.log(chainInfo.name);
      //   console.log(chainInfo.chainId);
      //   console.log(chainInfo.icon);
      //   console.log(chainInfo.explorers[0].url);
      //   document.getElementById('chainNameRpc').innerHTML = chainInfo.name;
      //   document.getElementById('chainIdRpc').innerHTML = chainInfo.chainId;
      //   document.getElementById('chainIconRpc').innerHTML = "<img src='" + chainInfo.icon + "' alt='chain icon' style='width: 20px; height: 20px;'>";
      //   document.getElementById('chainExplorerRpc').innerHTML = "<a href='" + chainInfo.explorer + "' target='_blank'>View on explorer</a>";
      // } else {
      //   console.log('Chain ID not found');
      // }
      const provider = window.ethereum;
      const networkId = await provider.request({ method: 'eth_chainId' });
      const networkIdDecimal = parseInt(networkId, 16);
      const networkListening = await provider.request({ method: 'net_listening' });
      const chainData = await getChainData(networkIdDecimal);
      
      console.log('Chain ID:', chainData.chainId);
      console.log('Chain name:', chainData.name);
      console.log('RPC URL:', chainData.rpcUrl);
      console.log('Native currency:', chainData.nativeCurrencyName);
      console.log('Symbol:', chainData.nativeCurrencySymbol);
      console.log('Decimals:', chainData.nativeCurrencyDecimals);
      console.log('Block explorer URL:', chainData.blockExplorerUrl);
      console.log('Listening:', networkListening);
      
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