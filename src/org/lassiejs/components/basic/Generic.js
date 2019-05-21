function Generic() {
  this.components = [];
  this.layout = null;
  this.template = null;
  this.data = null;
  this.sourceDomObject = null;
  this.text = null;
  this.clickListener = null;
  this.domElementUniqueIds = null;
}

Generic.prototype.setLayout = function(layout) {
  this.layout = layout;
}

Generic.prototype.add = function(component) {
  if (this.components == undefined) {
    this.components = [];
  }
  this.components.push(component);
}

/*
https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
*/
Generic.prototype.render = function() {

  this.domElementUniqueIds  = {};

  if (this.layout) {
    this.layout.apply(this.sourceDomObject, this.components);
    this.sourceDomObject.outerHTML = this.layout.render();
    if (this.clickListener) {
      this.sourceDomObject.addEventListener("click", this.clickListener);
    }
    return this.sourceDomObject;
  } else {
    if (this.template) {
      let generic = document.createElement("template");
      generic.innerHTML = this.template;
      bindDataToTemplate(generic.content, this.data, this.domElementUniqueIds);
      this.sourceDomObject = document.createElement('div');
      this.sourceDomObject.appendChild(generic.content.cloneNode(true));
      if (this.clickListener) {
        this.sourceDomObject.addEventListener("click", this.clickListener);
      }
      return this.sourceDomObject;
    } else {

      for (let key in this.components) {
        let component = this.components[key].component.render();
        this.sourceDomObject.appendChild(component);
      }

      if (this.clickListener) {
        this.sourceDomObject.addEventListener("click", this.clickListener);
      }
      return this.sourceDomObject;
    }

  }
}

Generic.prototype.setData = function(data) {
  this.data = data;
}

Generic.prototype.setClickListener = function(clickListener) {
  this.clickListener = clickListener;
}

Generic.prototype.getElementByName = function(name) {
  var uniqueId = this.domElementUniqueIds[name];
  var element = document.querySelector('[uniqueid="'+uniqueId+'"]');
  return element;
}


function bindDataToTemplate(component, data, domElementUniqueIds) {

  if(!data || (typeof data !== typeof {})){
    return;
  }

  var childNodes = component.childNodes;
  for (let key in childNodes) {
    //only ui objects instead #text in documentFragment
    if (typeof childNodes[key] === typeof {} && !(childNodes[key].data)) {
      var uiNodes = childNodes[key].childNodes;
      //searching children
      for (objectKey in uiNodes) {
        if (typeof uiNodes[objectKey] === typeof {} && !(uiNodes[objectKey].data)) {
          if (data && uiNodes[objectKey].id) {
            let uniqueId = Math.floor(Math.random() * 100001);
            domElementUniqueIds[uiNodes[objectKey].id] = uniqueId;
            uiNodes[objectKey].setAttribute('uniqueid', uniqueId);
            if (uiNodes[objectKey].tagName == "SPAN") {
              uiNodes[objectKey].innerHTML = data[uiNodes[objectKey].id];
            }
          }
        }
      }
    }
  }
}



module.exports = Generic;
