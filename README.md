![](https://raw.githubusercontent.com/jrichardsz/static_resources/master/lassie/lassie-tittle-2.0.png)

# Lassie.js framework BETA
---

A JavaScript framework for creating web applications in an fast, simple and intuitive way focus on productivity inspired in swing, spring and my beloved java.

# Template Engine

Lassie.js applications are built by composing a series of simple components. By convention, components are made up of a vanilla JavaScript class, with a corresponding HTML template.

```
function DockerAppInfo() {
  this.data = null;
  this.template = `
  <div>
      <span id="name"></span><br>
      <span id="technology"></span><br>
      <span id="port"></span>
  </div>
  `;
}
```

# Programmatic UI

If you don't want to use templates, you can create your ui components explicitly.

```
let container = new DockerAppInfo();
let spanName = new Span();
let spanTechnology = new Span();
let spanPort = new Span();

container.add({component:spanName});
container.add({component:spanTechnology});
container.add({component:spanPort});
```

Do you remember swing java framework?

# Layouts

No more complex development, you can use:

- Vertical Layout : If you want to add ui components in vertical order
- Horizontal Layout : If you want to add ui components in Horizontal order
- Flow Layout : If you want to add ui components with dynamic append.

```
let layout = new FlowLayout();
body.setLayout(layout);
```

# Hello world

This demo show us how to create a simple gallery of divs with fictitious data:


```

import style from './style.css'
import Div from './org/lassiejs/components/basic/Div.js'
import HorizontalLayout from './org/lassiejs/layout/HorizontalLayout.js'
import VerticalLayout from './org/lassiejs/layout/VerticalLayout.js'
import FlowLayout from './org/lassiejs/layout/FlowLayout.js'
import DockerAppInfo from './DockerAppInfo.js'

let body = new Div();

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

body.add({component:app1});
body.add({component:app2});
body.add({component:app3});
body.add({component:app4});
body.add({component:app5});
body.add({component:app6});
body.add({component:app7});


let layout = new FlowLayout();
body.setLayout(layout);

document.body.appendChild(body.render());
```

Result:

![https://raw.githubusercontent.com/jrichardsz/static_resources/master/lassiejs-demo.png](https://raw.githubusercontent.com/jrichardsz/static_resources/master/lassiejs-demo.png)

# Coming Soon

- Add store for complex behaviors
- Research about dependencies injection like java spring-framework
- Code refactor
- Unit tests
- Package as library
- Create more default ui components and layout
- a lot of work!!

# Contributors

Thanks goes to these wonderful people :

<table>
  <tbody>
    <td>
      <img src="https://avatars0.githubusercontent.com/u/3322836?s=460&v=4" width="100px;"/>
      <br />
      <label><a href="http://jrichardsz.github.io/">Richard Leon</a></label>
      <br />
    </td>    
  </tbody>
</table>
