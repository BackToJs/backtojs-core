@DefaultAction(name="htmlElementAction", route="htmlElementAction" page="htmlElement" )
function HtmlElementAction() {

  @HtmlElement(id="textbox")
  this.textbox;

  @HtmlElement(id="textarea")
  this.textarea;

  this.postBinding = () => {

    var bindedElements = {
      "textbox": this.textbox,
      "textarea": this.textarea
    };
    var infoElements = {};
    for(name in bindedElements){
      var element1Attributes={}
      element1Attributes["tagName"]=bindedElements[name].tagName;
      for (var att, i = 0, atts = bindedElements[name].attributes, n = atts.length; i < n; i++){
          att = atts[i];
          element1Attributes[att.nodeName]=att.nodeValue;
      }
      infoElements[name] = element1Attributes;
    }
    console.log("htmlElementAction :"+JSON.stringify(infoElements, null));
  };

}

module.exports = HtmlElementAction;
