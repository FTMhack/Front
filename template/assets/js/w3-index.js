
const initialize = () => {
  //Basic Actions Section
  const onboardButton = document.getElementById('connectButton_index');
  const getAccountsButton = document.getElementById('connectButton_index');
  const getAccountsResult = document.getElementById('walletAddress_index');
  const Disconnect = document.getElementById('disconnect_index');

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

