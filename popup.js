function getBalance(){
      let addr = document.getElementById('walletAddress').value
      if (addr !== ""){
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
          chrome.storage.local.set({balance: response.balance, address: addr});
        }
      }
      xhr.onerror = function() {
        console.log("Error while executing http call.")
      }
    }
}
document.getElementById('doSubmit').onclick = getBalance;

function formatBalance(raw){
  return raw / 1e8;
}

chrome.storage.local.get(['balance', 'address'], (res) => {
  if(res.balance){
    document.getElementById('balance').textContent = formatBalance(res.balance);
  }
  if(res.address){
    document.getElementById('walletAddress').value = res.address;
    getBalance();
  }

})
