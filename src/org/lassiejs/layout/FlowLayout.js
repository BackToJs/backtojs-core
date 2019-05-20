function FlowLayout() {
  this.container;
  this.defaultHeight = true;
  this.name = 'FlowLayout';
}

FlowLayout.prototype.apply = function(parent, components) {

  this.container = parent;
  this.container.className = "grid_layout";
  for (let key in components) {
    let component = components[key].component.render();
    this.container.appendChild(component);
  }

}

FlowLayout.prototype.render = function() {
  return this.container.outerHTML;
}



module.exports = FlowLayout;
