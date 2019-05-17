function VerticalLayout() {
  this.container;
  this.defaultHeight = true;
  this.name = 'VerticalLayout';
}

function getDynamicHeight(length) {
  return window.innerHeight / length;
}

VerticalLayout.prototype.apply = function(parent, components) {

  this.container = parent;

  if (this.defaultHeight === true) {
    if(components.length === 0){
      return;
    }
    let dynamicHeight = getDynamicHeight(components.length) + "px";
    for (let key in components) {
      let component = components[key].component.render();
      component.style.width = "100%";
      component.style.height = dynamicHeight;
      this.container.appendChild(component);
    }
  } else {

    if(components.length === 0){
      return;
    }

    for (let key in components) {
      let component = components[key].component.render();
      let height = components[key].height;
      component.style.width = "100%";
      component.style.height = height;
      this.container.appendChild(component);
    }
  }
}

VerticalLayout.prototype.render = function() {
  return this.container.outerHTML;
}

VerticalLayout.prototype.disableDefaultHeight = function(defaultHeight) {
  this.defaultHeight = defaultHeight;
}


module.exports = VerticalLayout;
