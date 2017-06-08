var appUrl = 'https://chrome.google.com/webstore/detail/cpgjdheihpmldnkbbonjjlebkacaeecg';

$(function() {

  $.browser.chrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase()); 

  if(!$.browser.chrome || !$.browser.desktop){
    $('.install').hide();
    $('.reminder').show();
  }

  $('.install, .install1').click(function(e) {
    chrome.webstore.install(appUrl, installed, failed);
  });

  function installed() {
    alert("Try opening a new tab. You'll see crypto updates each time now. 🤘🤘");
  }

  function failed(error) {
  }
});
