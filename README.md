
<img src="https://raw.githubusercontent.com/jrichardsz/static_resources/master/lassie/lassie-tittle-2.0.png" alt="alt text" width="300">


# Lassie.js framework BETA
---

A JavaScript framework for creating web applications in an fast, simple and intuitive way focus on productivity inspired in swing, spring and my beloved java.

Lassie.js applications are built by composing a series of simple html page templates + javascript page listener.

# Features

- @Annotattions like java
- Dependency Injection
- Template Engine with pure html. Forgot strange <tags>
- Automatic onclick bindings
- Automatic router binding

# Sample requirement

- Create a web with to pages : home and win.
- Home page must have a title "Pets vs Aliens" and a button called "new game"
- When "new game" button is clicked, a new page must be loaded : Win page
- Win page must have a message : "You win" and a button "exit"
- When "exit" button is clicked, initial page must be loaded: Home page

# Implementation with Lassie.js

- Create 2 html files

**/src/pages/home/index.html**
```html
<div class="page">
  <div class="head">
    <h2>Pets vs Aliens</h2>
  </div>
  <button id="homeButton" ls-scan=true class="button" >New Game</button>
</div>
```

**/src/pages/win/index.html**
```html
<div class="page">
  <div class="head">
      <h2>You win</h2>
  </div>
  <button id="backButton" ls-scan=true class="button" >Exit</button>
</div>
```

- Create 2 js modules annotated with @PageListener.

**/src/pages/home/index.js**
```js
//@PageListener(name="home", mainPage="true")
function Home() {
  var _this = this;
  _this.homeButtonOnClick = function(e) {
    window.location = '#win'
  }
}
module.exports = Home;
```

**/src/pages/win/index.js**
```js
//@PageListener("win")
function Win() {
  var _this = this;
  _this.backButtonOnClick = function(e) {
    window.location = '#home'
  }
}
module.exports = Win;
```

- Create the startup module

**src/startup/index.js**

```js
function LassieStartupApplication() {
  var _this = this;
  _this.context = {};
}
module.exports = LassieStartupApplication;
```

- Launch the startup module

```js
import './styles/index.scss'
import LassieStartupApplication from './context'

let lassieStartupApplication = new LassieStartupApplication();
lassieStartupApplication.start();
```

# Run

- npm install
- npm run dev
- go to http://localhost:8080

You will see the home page and if you click on **new game** button you will be redirected to win page with "You win" message

# How it works?

- Coming Soon


# Road map

- Externalize loaders and autumnframework source code as new git repositories
- Create 3 repository for this loaders
- Code refactor
- Unit tests
- Package as library
- Create more default ui components and layout

# Contributors

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
