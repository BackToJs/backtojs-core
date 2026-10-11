
import { DIContainer } from './DIContainer.js';
import { Router } from './Router.js';

document.addEventListener("DOMContentLoaded", () => {
  const container = new DIContainer();

  // Register all controllers dynamically using Webpack's require.context
  // 'controllers' and 'api' will be resolved from the target project's src directory
  const controllerContext = require.context('controllers', true, /\.js$/);
  container.registerContext(controllerContext);

  // Auto-discover and register API clients
  const apiContext = require.context('api', true, /\.js$/);
  container.registerContext(apiContext);

  // Initialize the router
  const router = new Router(container);
  router.init();
});
