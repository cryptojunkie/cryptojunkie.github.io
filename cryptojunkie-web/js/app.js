var appUrl = '';

$(function() {

  $.browser.chrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase()); 

  if(!$.browser.chrome || !$.browser.desktop){
    $('.install').hide();
    $('.get-chrome').show();
  }

  $('.install, .try-again').click(function(e) {
    chrome.webstore.install(appUrl, installed, failed);
  });

  function installed() {
    alert("Try opening a new tab. You'll see crypto updates each time now. 🤘🤘");
  }

  function failed(error) {
    alert("Something went wrong, plesae try again.");
  }
});