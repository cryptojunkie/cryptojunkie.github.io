var alertApi = "http://cryptojunkie.io/alerts.json";
var linkApi = "http://cryptojunkie.io/links.json";
var imageUrl = "http://api.screenshotlayer.com/api/capture?access_key=72cfbd767bdf2b0a7a26dc1b6ace791f&viewport=1280x1024&width=1280&fullpage=1&delay=5&ttl=604800&url=";
var tmpLinks = [];

$(function() {

  // EVENTS
  $(document).on("click", ".js-add-link", addLink);
  $(document).on("click", ".js-output", clickOutput);
  $(document).on("change", ".js-toggle-link", toggleLink);
  $(document).on("change", ".js-data-source", changeDataSource);

  // start the process
  function start(){
    localStorage.clear();
    setLinks();
  }

  function changeDataSource(){
    data = $(event.currentTarget).val();

    if (data === "links"){
      setLinks();
    }else{
      setAlerts();
    }
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

  // fetch the json file of links 
  function setLinks(){
    hitApi(linkApi, function(error, data) {
      if (error) {
        console.log('there was an error fetching links', error);
      } else {
        renderLinks(data);
      }
    });
  }

  function setAlerts(){
    hitApi(alertApi, function(error, data) {
      if (error) {
        console.log('there was an error fetching alerts', error);
      } else {
        renderAlerts(data);
      }
    });    
  }

  function addLink(link){
    link = {url: $('.js-new-link').val()}
    tmpLinks.unshift(link);
    rendorJSONOutput(tmpLinks);

    // update ui  
    $('.js-grid').prepend(helperLinkView(link.url));
    $('.js-new-link').val('');

    // copy json to clipboard
    document.execCommand(JSON.stringify(tmpLinks));
  }

  function toggleLink(event){
    alert('not working yet');
    // link = {url: $(event.currentTarget).data('link')};
    // todo: need logic here for knowing if the checkbox was turned on or off
    // tmpLinks = _.without(tmpLinks, link);
    // rendorJSONOutput(tmpLinks);
  }

  function renderLinks(links){
    tmpLinks = links;
    $.each(links, function(i, link) {
      $('.js-grid').append(helperLinkView(link.url));
    });
    rendorJSONOutput(tmpLinks);
  }

  function renderAlerts(alerts){
    // todo
  }

  function rendorJSONOutput(json){
    $('.js-output').val(JSON.stringify(json));
  }

  function helperLinkView(link){
    return '<tr class="link"><td><input type="checkbox" class="js-toggle-link" checked id="' + link + '" data-link="' + link + '" /> <label for="' +  link + '">' + link + '</label><div style="margin-left: 23px; margin-top:4px"><a href="' + link + '" target="_blank">View URL</a> &nbsp; <a href="' + imageUrl + link + '" target="_blank">View generated image</a></div></td></tr>';
  }

  function clickOutput(){
    this.select();
  }

  // start cryptojunkie builder
  start();
});