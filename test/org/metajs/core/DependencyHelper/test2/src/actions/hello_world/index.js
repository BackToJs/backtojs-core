var LinksStartJsDomUtil = require('linkstartjs-nerve-utils').LinksStartJsDomUtil

@DefaultAction(name="helloWorldAction", entrypoint="true", route="hello"  )
function HelloWorldAction() {

  @Autowire(location="pages/helloWorld")
  var helloWorldPage;

  @Autowire(name="acmeApiClient")
  var acmeApiClient;

}

module.exports = ClickCounterAction;
