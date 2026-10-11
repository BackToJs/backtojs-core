# Back2Js Core Framework

Welcome to the custom, highly-optimized Vanilla JS Framework! This framework leverages Modern JavaScript and Webpack to give you an architecture similar to Angular or Vue, but with zero overhead and full control over the DOM.

## 1. Creating a Controller

Controllers are the backbone of the framework. You create them simply by placing a new JavaScript file into the `src/controllers/` directory.

The framework uses a custom Webpack loader to support C#-style annotations for routing and Dependency Injection.

```javascript
[Controller]
[Inject("ApiClient", "AudioService")]
export class HomeController {
  
  constructor(apiClient, audioService) {
    this.apiClient = apiClient;
    this.audioService = audioService;
  }
  
  // ... lifecycles go here
}
```
*Because of auto-discovery, you **never** need to manually register this controller anywhere!*

### Controller Route Options

By default, omitting the `route` parameter makes the class name itself the route (e.g., `#HomeController`). You can also specify advanced routing options:
```javascript
[Controller(fallback = true, redirect_on_refresh = true)]
export class SplashController { ... }
```
- `route="/path"`: Overrides the default class-name route.
- `fallback = true`: Sets this controller as the default route if the URL hash is empty or invalid.
- `redirect_on_refresh = true`: Forces the application to load this route initially, ignoring any existing URL hash.

## 2. The Lifecycle Methods

To ensure strict separation of concerns and lightning-fast performance, the framework enforces a two-step drawing lifecycle:

### `initView()` (Pure Function)

This method is called by the Router first. It **cannot** touch the DOM. It must return either an HTML String or a natively created DOM Node (e.g., `document.createElement`).

```javascript
initView() {
  return `
    <div>
      <h1 id="title">Hello World</h1>
      <button id="click-me">Click Me</button>
    </div>
  `;
}
```

### `updateView(targetElement)` (DOM Manipulation)

This method is called immediately after your string/node is injected into the live browser DOM. You will use this to bind events, instantiate child components, and fetch data.

```javascript
async updateView(targetElement) {
  // 1. Bind events safely
  targetElement.querySelector('#click-me').addEventListener('click', () => {
    alert("Clicked!");
  });

  // 2. Fetch data asynchronously
  const data = await this.apiClient.fetchData();
  targetElement.querySelector('#title').textContent = data.title;
}
```

## 3. Services and Dependency Injection

Any class automatically discovered by Webpack (e.g., inside `src/api/` or `src/audio/`) is registered as a Singleton in the Dependency Injection (DI) Container. 

To use a service, simply add its class name to your controller's `[Inject(...)]` annotation, and it will be passed directly into your constructor.

```javascript
// In src/api/ApiClient.js
export class ApiClient {
  fetchData() { return []; }
}

// In src/controllers/LoginController.js
[Controller]
[Inject("ApiClient")]
export class LoginController {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }
}
```

## 4. Routing and Navigation

The Router listens to standard URL Hash changes. To programmatically navigate between controllers, dispatch a global `framework:navigate` event:

```javascript
document.dispatchEvent(new CustomEvent('framework:navigate', {
  detail: { route: 'HomeController' }
}));
```

## 5. Inter-Controller Communication (Global Event Bus)

To keep your controllers completely decoupled, avoid passing callbacks. Instead, use the native DOM Event Bus to broadcast and listen for changes.

**Broadcasting an event:**
```javascript
document.dispatchEvent(new CustomEvent('todo:added', { 
  detail: { taskName: "New Task" } 
}));
```

**Listening for an event (in a Controller's constructor):**
```javascript
constructor() {
  document.addEventListener('todo:added', (e) => {
    console.log("A task was added somewhere in the app:", e.detail.taskName);
  });
}
```
*Since Controllers are Singletons, it is safe to bind event listeners inside the `constructor()` without causing memory leaks upon route changes.*
