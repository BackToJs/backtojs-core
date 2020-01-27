![](https://raw.githubusercontent.com/jrichardsz/static_resources/master/lassie/lassie-tittle-2.0.png)

# Lassie.js framework BETA
---

A JavaScript framework for creating web applications in an fast, simple and intuitive way focus on productivity inspired in swing, spring and my beloved java.

# Dependency Injection

coming soon

# Template Engine

Lassie.js applications are built by composing a series of simple components. By convention, modules are made up of a vanilla JavaScript class, with a corresponding HTML template in **pages** folder.

Example : Home page

```
src/pages/home/index.js
src/pages/home/index.html
```

- index.js is a simple module related to inxed.html
- index.html contains a clean html code , related to its index.html

This html will be injected to the index.js, so when this page is called, html will be renderized.

# Action Listeners

You don't need to manually bind onclick function to an html element.

You just need

- add **ls-scan=true** in your html template

```html
<div class="home">
  <div class="head">
    <h2>Pets vs Aliens</h2>
  </div>
  <button id="homeButton" ls-scan=true class="button" >New Game</button>
</div>
```
- add a function with the same name of html id element with **OnClick** suffix in the index.js file

```js
_this.homeButtonOnClick = function(e) {
  console.log("i am the click on home");
}
```

- this funcion will be called when user click on `<button id="homeButton" >`

# Entrypoint

You just need to instantiate ModulesFactory.

```
import './styles/index.scss'
import ModulesFactory from './autoconfigure/factory'

let modulesFactory = new ModulesFactory();
modulesFactory.discover();
```

# Hello world

Coming soon.

# Run

- npm install
- npm run dev
- go to http://localhost:8080

You will see the html of /src/pages/home as welcome page and if you click on **new game** button you will be redirected to /src/pages/map html

With this we will demonstrate:

- Simple page rendering of html
- Simple onclick functionality
- Simple navigation


# Coming Soon

- Create src/autoconfigure/factory/index.js dynamically using https://github.com/jrichardsz/dependency-injection-4nodejs (with new webpack loader called dependency-injection-loader)
- Create src/navigation/index.js dynamically (with new webpack loader called lassie-navigation-loader)
- Create 3 repository for this loaders
- Code refactor
- Unit tests
- Package as library
- Create more default ui components and layout

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
