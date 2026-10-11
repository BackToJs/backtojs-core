export class DIContainer {
  constructor() {
    this.classes = new Map();
    this.instances = new Map();
    this.routes = new Map(); // Maps string routes to class names
    this.fallbackRoute = null;
    this.forceInitialRoute = null;
  }

  /**
   * Registers all classes exported from a Webpack require.context.
   * @param {Object} context - The result of require.context()
   */
  registerContext(context) {
    context.keys().forEach((key) => {
      const module = context(key);
      // Register all exported classes in the module
      Object.keys(module).forEach((exportName) => {
        const exportedClass = module[exportName];
        if (typeof exportedClass === 'function' && exportedClass.prototype) {
          this.classes.set(exportName, exportedClass);
          if (exportedClass.route) {
            this.routes.set(exportedClass.route, exportName);
          }
          if (exportedClass.fallback) {
            this.fallbackRoute = exportedClass.route || exportName;
          }
          if (exportedClass.redirect_on_refresh) {
            this.forceInitialRoute = exportedClass.route || exportName;
          }
        }
      });
    });
  }

  getFallbackRoute() {
    return this.fallbackRoute;
  }

  getForceInitialRoute() {
    return this.forceInitialRoute;
  }

  /**
   * Resolves a dependency by name, recursively resolving its dependencies.
   * @param {string} name - The name of the class to resolve.
   * @returns {Object} The instantiated class.
   */
  resolve(name) {
    if (this.instances.has(name)) {
      return this.instances.get(name);
    }

    const targetClass = this.classes.get(name);
    if (!targetClass) {
      throw new Error(`DIContainer Error: Cannot resolve dependency '${name}'. Class not found.`);
    }

    // Resolve dependencies recursively
    const dependencies = targetClass.inject || [];
    const resolvedDependencies = dependencies.map((depName) => this.resolve(depName));

    // Instantiate and store
    const instance = new targetClass(...resolvedDependencies);
    this.instances.set(name, instance);

    return instance;
  }

  /**
   * Resolves a dependency by route path (e.g. '/login').
   * @param {string} routePath - The route string.
   * @returns {Object} The instantiated class.
   */
  resolveRoute(routePath) {
    const className = this.routes.get(routePath);
    if (className) {
      return this.resolve(className);
    }
    
    // Fallback: Check if the routePath matches a class name exactly
    if (this.classes.has(routePath)) {
      return this.resolve(routePath);
    }
    
    throw new Error(`DIContainer Error: Cannot resolve route '${routePath}'. Route not found.`);
  }
}
