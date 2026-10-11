import { DIContainer } from './DIContainer.js';
import { Router } from './Router.js';

document.addEventListener("DOMContentLoaded", async () => {
  const container = new DIContainer();

  // Register all controllers dynamically using Webpack's require.context
  // 'controllers', 'api', and 'config' will be resolved from the target project's src directory
  const controllerContext = require.context('controllers', true, /\.js$/);
  container.registerContext(controllerContext);

  const apiContext = require.context('api', true, /\.js$/);
  container.registerContext(apiContext);

  const serviceContext = require.context('services', true, /\.js$/);
  container.registerContext(serviceContext);

  const configContext = require.context('config', true, /\.js$/);
  container.registerContext(configContext);

  // Instantiate and run all [Configuration] classes before the router boots
  for (const className of container.classes.keys()) {
    const clazz = container.classes.get(className);
    if (clazz.isConfiguration) {
      const configInstance = container.resolve(className);
      if (typeof configInstance.onInit === 'function') {
        await configInstance.onInit();
      }
    }
  }

  // Initialize the router
  const router = new Router(container);
  router.init();
});
