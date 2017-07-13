var currency = localStorage.settingsCurrency ? localStorage.settingsCurrency : 'USD';
var currencySymbol = localStorage.settingsCurrencySymbol ? localStorage.settingsCurrencySymbol : '$';
var alertApi = "http://cryptojunkie.io/alerts.json";
var linkApi = "http://cryptojunkie.io/links.json";
var tickerApi = "https://api.coinmarketcap.com/v1/ticker/?convert=" + currency + "&limit=20";
var imageUrl = "http://api.screenshotlayer.com/api/capture?access_key=72cfbd767bdf2b0a7a26dc1b6ace791f&viewport=1280x1024&width=1280&fullpage=1&delay=5&ttl=604800&url=";
var imageMobileUrl = "http://api.screenshotlayer.com/api/capture?access_key=72cfbd767bdf2b0a7a26dc1b6ace791f&viewport=640x1024&width=640&fullpage=1&delay=5&ttl=604800&url=";
var appUrl = 'https://chrome.google.com/webstore/detail/cpgjdheihpmldnkbbonjjlebkacaeecg';

$(function() {
  // EVENTS
  $(document).on("change", "#settings-currency", settingsCurrency);
  $(document).on("click", "#settings-autoplay-videos", settingsAutoPlayVideos);
  $(document).on("click", ".js-settings-save", reloadPage);
  $(document).on("click", ".js-settings", toggleSettings);
  $(document).on("click", ".js-overlay", toggleSettings);
  $(document).on("click", ".install", install);

  // start the process
  function start(){
    ! localStorage.links ? localStorage.setItem('links', []) : '';
    ! localStorage.alerts ? localStorage.setItem('alert', []) : '';
    ! localStorage.prices ? localStorage.setItem('prices', []) : '';

    setSettings();
    setLinks();
    setTickerPrices();
    setAlert();
    setPluginPrompt();

    twemoji.parse(document.body);
  }

  function setPluginPrompt(){
    $.browser.chrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase()); 

    if(!$.browser.chrome || !$.browser.desktop){
      $('.try-chrome-plugin').hide();
    }
  }

  function install(){
    chrome.webstore.install(appUrl, installed, failed);
  }

  function installed() {
    alert("Try opening a new tab. You'll see crypto updates each time now. 🤘🤘");
  }

  function failed(error) {
  }

  function hitApi(url, callback) {
    var req = new XMLHttpRequest();

    req.addEventListener('load', onLoad);
    req.addEventListener('error', onFail);
    req.addEventListener('abort', onFail);
    req.open('GET', url);
    req.send();

    function onLoad(event) {
      if (req.status >= 400) {
        onFail(event);
      } else {
        var json = JSON.parse(this.responseText);
        callback(null, json);
      }
    }

    function onFail(event) {
      callback(new Error('...'));
    }
  }

  function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // rendor links
  function renderLinks(){
    var links = _.shuffle(JSON.parse(localStorage.links));

    $.each(links, function(i, item) {
      renderLink(item);
    });
  }

  // render a link 
  function renderLink(item){
    if (item.url.includes("youtube.com/watch")){
      var height = $( window ).width() > 641 ? '600px' : '240px';
      var videoId = item.url.replace("https://www.youtube.com/watch?v=", "");
      $('.js-links').append('<div class="link js-link"><iframe width="100%" height="' + height + '" src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe></div>');
    }else{
      var screenshotUrl = $( window ).width() > 641 ? imageUrl : imageMobileUrl;
      if (item.url.includes(".png") || item.url.includes(".gif") || item.url.includes(".jpg")){
        $('.js-links').append('<div class="link js-link"><a title="View full link" target="_blank" href="' + item.url + '"><img src="' + item.url + '" /></a></div>');
      }else{
        $('.js-links').append('<div class="link js-link"><a title="View full link" target="_blank" href="' + item.url + '"><img src="' + screenshotUrl + item.url + '" /></a></div>');
      }
    }
  }

  // render alert
  function renderAlert(){
    var item = _.first(_.shuffle(JSON.parse(localStorage.alerts)));
    var img = new Image();
    img.src = item.avatar;
    img.onload = function() {
      $('.js-alert .avatar').css('background-image', 'url(' + item.avatar + ')');
      $('.js-alert .message').html(item.message);  
      $('.alert').fadeTo('fast', 1);
    }
  }

  function renderTicker(){
    $.each(JSON.parse(localStorage.prices), function(i, item) {
      var color = item.percent_change_24h > 0 ? '#4dcc53' : '#f51919'; 
      var onFire = item.percent_change_24h >= 10 ? '&#128293;' : ''; 
      var cold = item.percent_change_24h <= -10 ? '&#127784;' : ''; 
      var price;
      var cap;
      
      switch(currency.toLowerCase()){
        case 'usd':
          price = parseFloat(item.price_usd).toFixed(3);
          cap = item.market_cap_usd;
          break;
        case 'aud':
          price = parseFloat(item.price_aud).toFixed(3);
          cap = item.market_cap_aud;
          break;
        case 'brl':
          price = parseFloat(item.price_brl).toFixed(3);
          cap = item.market_cap_brl;
          break;
        case 'cad':
          price = parseFloat(item.price_cad).toFixed(3);
          cap = item.market_cap_cad;
          break;
        case 'chf':
          price = parseFloat(item.price_chf).toFixed(3);
          cap = item.market_cap_chf;
          break;
        case 'cny':
          price = parseFloat(item.price_cny).toFixed(3);
          cap = item.market_cap_cny;
          break;
        case 'eur':
          price = parseFloat(item.price_eur).toFixed(3);
          cap = item.market_cap_eur;
          break;
        case 'gbp':
          price = parseFloat(item.price_gbp).toFixed(3);
          cap = item.market_cap_gbp;
          break;
        case 'hkd':
          price = parseFloat(item.price_hkd).toFixed(3);
          cap = item.market_cap_hkd;
          break;
        case 'idr':
          price = parseFloat(item.price_idr).toFixed(3);
          cap = item.market_cap_idr;
          break;
        case 'inr':
          price = parseFloat(item.price_inr).toFixed(3);
          cap = item.market_cap_inr;
          break;
        case 'jpy':
          price = parseFloat(item.price_jpy).toFixed(3);
          cap = item.market_cap_jpy;
          break;
        case 'mxn':
          price = parseFloat(item.price_mxn).toFixed(3);
          cap = item.market_cap_mxn;
          break;
        case 'rub':
          price = parseFloat(item.price_rub).toFixed(3);
          cap = item.market_cap_rub;
          break;
      }

      $('.js-crypto-prices').append('<a href="http://coinmarketcap.com/currencies/' + item.id + '/"  target="_blank" title="' + item.name + ' (' + item.price_btc + ' BTC. Market cap: ' + currencySymbol + numberWithCommas(cap) + '. Past 24h: ' + item.percent_change_24h + '%)"><div" class="ticker-' + item.id + ' ticker"><img src="img/icon-' + item.id + '.png" /><span class="price" style="color: ' + color + ' !important">' + currencySymbol + numberWithCommas(price) + '</span></div</a>' + onFire + '' + cold);
    });
    $('.crypto-prices').fadeTo('fast', 1);
  }

  // fetch the json file of links 
  function setLinks(){
    hitApi(linkApi, function(error, data) {
      if (error) {
        console.log('there was an error fetching links', error);
      } else {
        saveToLocalStorage(data, 'links');
      }
      renderLinks();
    });
  }

  function setAlert(){
    hitApi(alertApi, function(error, data) {
      if (error) {
        console.log('there was an error fetching alerts', error);
      } else {
        saveToLocalStorage(data, 'alerts');
      }
      renderAlert();
    });    
  }

  function setTickerPrices(){
    // var socket = io.connect('http://socket.coincap.io/');

    // socket.on('trades', function (tradeMsg) {
    //     // console.log(tradeMsg);
    //     console.log(tradeMsg.message.coin);
    // })

    // socket.on('global', function (globalMsg) {
    //     console.log(globalMsg);
    // })

    hitApi(tickerApi, function(error, data) {
      if (error) {
        console.log('there was an error fetching ticker prices', error);
      } else {
        saveToLocalStorage(data, 'prices');
      }
      renderTicker();
    });
  }

  function setSettings(){
    if(localStorage.settingsAutoplayVideos){
      var autoplay = localStorage.settingsAutoplayVideos == "true" ? true : false;
      $('#settings-autoplay-videos').prop('checked', autoplay);
    }

    if(localStorage.settingsCurrency){
      $("#settings-currency").val(localStorage.settingsCurrency);
    }
  }

  function saveToLocalStorage(items, type){
    var tmpItems = []; 
    $.each( items, function( index, value ) {
      tmpItems.push(value);
    });
    localStorage.setItem(type, JSON.stringify(tmpItems)); 
  }

  // SETTINGS
  function settingsCurrency(){
    var currency = $('#settings-currency').val();
    var currencySymbol = $('#settings-currency').find(':selected').data('symbol');
    localStorage.setItem('settingsCurrency', currency);
    localStorage.setItem('settingsCurrencySymbol', currencySymbol);
  }

  function settingsAutoPlayVideos(){
    if ($('#settings-autoplay-videos:checked').length > 0) {
      localStorage.setItem('settingsAutoplayVideos', true);
    }else{
      localStorage.setItem('settingsAutoplayVideos', false);
    }
  }

  function reloadPage(){
    location.reload();
  }

  function toggleSettings(){
    if($('.modal').css('display') == 'none'){
      $('#overlay').show();
      $('.modal').show();
    }else{
      $('#overlay').hide();
      $('.modal').hide();
    }
  }

  // start cryptojunkie
  start();
});