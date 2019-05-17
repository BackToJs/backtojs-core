function Generic() {
  this.components = [];
  this.layout = null;
  this.template = null;
  this.data = null;
  this.sourceDomObject = null;
  this.text = null;
}

Generic.prototype.setLayout = function(layout) {
  this.layout = layout;
}

Generic.prototype.add = function(component) {
  if(this.components == undefined){
    this.components = [];
  }
  this.components.push(component);
}

/*
https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
*/
Generic.prototype.render = function() {

  if (this.layout) {
    this.layout.apply(this.sourceDomObject, this.components);
    this.sourceDomObject.outerHTML = this.layout.render();
    return this.sourceDomObject;
  } else {
    if (this.template) {
      let generic = document.createElement("template");
      generic.innerHTML = this.template;
      return generic.content;
    } else {

      for (let key in this.components) {
        let component = this.components[key].component.render();
        this.sourceDomObject.appendChild(component);
      }

      return this.sourceDomObject;
    }

  }
}


module.exports = Generic;
