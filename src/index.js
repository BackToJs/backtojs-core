import style from './style.css'
import Div from './org/lassiejs/components/basic/Div.js'
import HorizontalLayout from './org/lassiejs/layout/HorizontalLayout.js'
import VerticalLayout from './org/lassiejs/layout/VerticalLayout.js'
import FlowLayout from './org/lassiejs/layout/FlowLayout.js'
import DockerAppInfo from './DockerAppInfo.js'
import Controller from './Controller.js'

let container = new Div();

let breadCrumb = new Div();
let appDetails = new Div();

let verticalLayout = new VerticalLayout();
verticalLayout.disableDefaultHeight(false);
container.setLayout(verticalLayout);

container.add({component:breadCrumb,height:"10%"});
container.add({component:appDetails,height:"90%"});

let app1 = new DockerAppInfo();
let app2 = new DockerAppInfo();
let app3 = new DockerAppInfo();
let app4 = new DockerAppInfo();
let app5 = new DockerAppInfo();
let app6 = new DockerAppInfo();
let app7 = new DockerAppInfo();

app1.setData({name:"osums",technology:"php",port:"8080"});
app2.setData({name:"openxava",technology:"java",port:"8081"});
app3.setData({name:"simple-proxy",technology:"nodejs",port:"8082"});
app4.setData({name:"starcraft",technology:"c++",port:"8083"});
app5.setData({name:"lassiejs",technology:"javascript",port:"8084"});
app6.setData({name:"bet-web",technology:"nodejs",port:"8085"});
app7.setData({name:"bet-api",technology:"java",port:"8086"});

appDetails.add({component:app1});
appDetails.add({component:app2});
appDetails.add({component:app3});
appDetails.add({component:app4});
appDetails.add({component:app5});
appDetails.add({component:app6});
appDetails.add({component:app7});

let controller = new Controller(app7);

let layout = new FlowLayout();
appDetails.setLayout(layout);

document.body.replaceChild(container.render(), document.getElementById("root"));
