function ApplicationContext() {

  var _this = this;
  _this.context = {};

  _this.start = function () {

    const Home = require('/home/jrichardsz/Github/lassiejs/src/pages/home/index.js')
    const Map = require('/home/jrichardsz/Github/lassiejs/src/pages/map/index.js')
    const Navigation = require('/home/jrichardsz/Github/lassiejs/src/navigation/index.js')

    _this.context.home = new Home();
    _this.context['map'] = new Map();
    _this.context['navigation'] = new Navigation();

    _this.context['home'].navigation = this.context['navigation'];

    _this.context['navigation'].home = this.context['home'];
    _this.context['navigation'].map = this.context['map'];
    _this.context['navigation'].main();
  };

}

module.exports = ApplicationContext;
