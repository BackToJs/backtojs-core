function Div() {
  this.components = [];
  this.layout = null;
  this.template = null;
  this.data = null;
}

Div.prototype.setLayout = function(layout) {
  this.layout = layout;
}

Div.prototype.add = function(component) {
  this.components.push(component);
}

/*
https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
*/
Div.prototype.render = function() {

  let div = document.createElement("div");

  if (this.layout) {
    this.layout.apply(div, this.components);
    div.outerHTML = this.layout.render();
    return div;
  } else {
    if (this.template) {
      let generic = document.createElement("template");
      generic.innerHTML = this.template;
      console.log(generic.content);
      return generic.content;
    } else {
      return div;
    }

  }
}


module.exports = Div;
