const Home = require('../../../pages/home')
const Map = require('../../../pages/map')
const Navigation = require('../../../navigation')

function Di4js() {
  this.context = [];
}

module.exports = Di4js;

Di4js.prototype.discover = function () {
  this.context['home'] = new Home();
  this.context['map'] = new Map();
  this.context['navigation'] = new Navigation();

  this.context['home'].navigation = this.context['navigation'];

  this.context['navigation'].home = this.context['home'];
  this.context['navigation'].map = this.context['map'];
  this.context['navigation'].main();
};


Di4js.prototype.lookup = function (moduleId) {
  return this.context[moduleId];
};
