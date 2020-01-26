const Home = require('../../pages/home')
const Map = require('../../pages/map')
const Navigation = require('../../navigation')

function ModulesFactory() {
  this.context = [];
}

module.exports = ModulesFactory;

ModulesFactory.prototype.discover = function () {
  this.context['home'] = new Home();
  this.context['map'] = new Map();
  this.context['navigation'] = new Navigation();

  this.context['home'].navigation = this.context['navigation'];

  this.context['navigation'].home = this.context['home'];
  this.context['navigation'].map = this.context['map'];
  this.context['navigation'].main();
};


ModulesFactory.prototype.lookup = function (moduleId) {
  return this.context[moduleId];
};
