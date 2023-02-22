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
      const chainId = await ethereum.request({ method: 'eth_chainId' });

      // Retrieve the RPC URL for the selected network
      const rpcUrl = await ethereum.request({
        method: 'net_version',
        params: [chainId]
      });
      console.log(rpcUrl, chainId);

      
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