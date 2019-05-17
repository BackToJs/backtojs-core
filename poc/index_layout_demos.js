
import style from './style.css'
import Div from './org/lassiejs/components/basic/Div.js'
import HorizontalLayout from './org/lassiejs/layout/HorizontalLayout.js'
import VerticalLayout from './org/lassiejs/layout/VerticalLayout.js'

let body = new Div();

let sidebar = new Div();
let content = new Div();

body.add({component:sidebar,width:"20%"});
body.add({component:content,width:"80%"});

let layout = new HorizontalLayout();
layout.disableDefaultWidth(false);
body.setLayout(layout);

let verticalLayout = new VerticalLayout();
verticalLayout.disableDefaultHeight(false);
content.setLayout(verticalLayout);

let headContent = new Div();
let mainContent = new Div();
content.add({component:headContent,height:"10%"});
content.add({component:mainContent,height:"90%"});

document.body.appendChild(body.render());
