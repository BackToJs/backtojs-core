import './styles/index.scss'

import Home from './pages/home'

let home = new Home();
document.body.replaceChild(home.render(), document.getElementById("root"));
