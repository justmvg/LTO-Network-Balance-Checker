var getBalance = () => {
  return new Promise((resolve,reject) => {
      let addr = document.getElementById('walletAddress').value
      if (addr){
      let xhr = new XMLHttpRequest();
      xhr.open(
       'GET',
       'https://nodes.lto.network/addresses/balance/'+addr
      );
      xhr.send();
      xhr.onload = function() {
        if (xhr.status != 200) {
          console.log("An error has occured: "+ xhr.status)
        } else {
          var response = JSON.parse(xhr.response);
          document.getElementById('balance').textContent = formatBalance(response.balance);
          document.getElementsByClassName('symbolrow')[0].style.display = "contents";
          chrome.storage.local.set({balance: response.balance, address: addr});
          resolve(response.balance)
          usdValue(response.balance)
        }
      }
      xhr.onerror = function() {
        console.log("Error while executing http call.")
      }
    }
});
}

var usdValue = (amount) => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open(
      'GET',
      'https://min-api.cryptocompare.com/data/pricemulti?fsyms=LTO&tsyms=BTC,USD,EUR,ETH'
    )
    xhr.send()
    xhr.onload = function() {
      if (xhr.status != 200) {
        console.log("An error has occured: "+ xhr.status)
      } else {
        var response = JSON.parse(xhr.response);
        usdval = response.LTO.USD * formatBalance(amount)
        eurval = response.LTO.EUR * formatBalance(amount)
        btcval = response.LTO.BTC * formatBalance(amount)
        ethval = response.LTO.ETH * formatBalance(amount)
        document.getElementById('eur').textContent = eurval.toFixed(2).replace('.', ',');
        document.getElementById('usd').textContent = usdval.toFixed(2);
        document.getElementById('btc').textContent = btcval.toFixed(8);
        document.getElementById('eth').textContent = ethval.toFixed(8);
      }
    }
    xhr.onerror = function() {
      console.log("Error while executing http call.")
    }
  })
}
document.getElementById('doSubmit').onclick = getBalance

function formatBalance(raw){
  return raw / 1e8;
}

chrome.storage.local.get(['balance', 'address'], (res) => {
  if(res.balance){
    document.getElementById('balance').textContent = formatBalance(res.balance);
  }
  if(res.address){
    document.getElementById('walletAddress').value = res.address;
    getBalance()
  }

})
