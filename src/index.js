import './styles/index.scss'

import Home from './pages/home'

let home = new Home();
var render = home.render();

document.body.replaceChild(render, document.getElementById("root"));

home.initializeActionListeners();
