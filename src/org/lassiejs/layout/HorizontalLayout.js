function HorizontalLayout() {
  this.container;
  this.defaultWidth = true;
  this.name = 'HorizontalLayout';
}

function getDynamicWidth(length) {
  return 100 / length;
}

HorizontalLayout.prototype.apply = function(parent, components) {
  this.container = parent;

  if (this.defaultWidth === true) {
    let dynamicWith = getDynamicWidth(components.length) + "%";
    for (let key in components) {
      let component = components[key].component.render();
      component.style.width = dynamicWith;
      component.style.height = window.innerHeight  + "px";
      component.style.display = "inline-block";
      this.container.appendChild(component);
    }
  } else {
    for (let key in components) {

      let component = components[key].component.render();
      let width = components[key].width;
      component.style.width = width;
      component.style.height = window.innerHeight  + "px";
      component.style.display = "inline-block";

      this.container.appendChild(component);
    }
  }
}

HorizontalLayout.prototype.render = function() {
  return this.container.outerHTML;
}

HorizontalLayout.prototype.disableDefaultWidth = function(defaultWidth) {
  this.defaultWidth = defaultWidth;
}


module.exports = HorizontalLayout;
