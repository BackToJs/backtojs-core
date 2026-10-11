export class Router {
  static inject = ['DIContainer']; // The router needs the container to resolve controllers

  constructor(diContainer) {
    this.diContainer = diContainer;
    this.viewContainer = null;
    this.currentController = null;
  }

  init() {
    // 1. Ensure DOM is ready, then grab the target section for views
    this.viewContainer = document.getElementById('router-view');
    if (!this.viewContainer) {
      console.warn("Router warning: '#router-view' not found in DOM.");
    }

    // 2. Listen for internal app navigation requests
    document.addEventListener('framework:navigate', (e) => {
      const targetRoute = e.detail?.route || e.detail?.controller;
      if (targetRoute) {
        // This triggers a 'hashchange' event natively in the browser
        window.location.hash = targetRoute; 
      }
    });

    // 3. Listen for actual URL changes (includes manual URL typing by user)
    window.addEventListener('hashchange', () => this.handleHashChange());

    // 4. Handle initial load
    const forceRoute = this.diContainer.getForceInitialRoute();
    if (forceRoute && window.location.hash !== '#' + forceRoute) {
      window.location.hash = forceRoute; // This triggers hashchange automatically
    } else {
      this.handleHashChange();
    }
  }

  handleHashChange() {
    // Extract the fragment
    let hash = window.location.hash.replace('#', '');
    
    try {
      if (!hash) {
        const fallback = this.diContainer.getFallbackRoute();
        hash = fallback ? fallback : '/';
        // Use replaceState to update the URL without triggering an async hashchange event
        window.history.replaceState(null, null, '#' + hash); 
        // We do NOT return here, so it continues to render the default route synchronously
      }

      // Resolve the controller from the DI container using the route string
      const controller = this.diContainer.resolveRoute(hash);
      
      // Cleanup previous controller if necessary (optional teardown lifecycle)
      if (this.currentController && typeof this.currentController.destroy === 'function') {
        this.currentController.destroy();
      }

      this.currentController = controller;

      // Clear only the view section
      this.viewContainer.innerHTML = '';

      // Support the pure initView lifecycle (returns String or Node)
      if (typeof controller.initView === 'function') {
        const viewOutput = controller.initView();
        if (typeof viewOutput === 'string') {
          this.viewContainer.innerHTML = viewOutput;
        } else if (viewOutput instanceof Node) {
          this.viewContainer.appendChild(viewOutput);
        } else {
          throw new Error(
            `Framework Error: initView() in ${controller.constructor.name} must return a String or a DOM Node. ` +
            `Instead, it returned: ${typeof viewOutput}`
          );
        }
      } else if (typeof controller.render === 'function') {
        // Fallback for older controllers that still use render(target)
        controller.render(this.viewContainer);
      }
      
      // Trigger the async updateView lifecycle (or fallback to onInit)
      if (typeof controller.updateView === 'function') {
        controller.updateView(this.viewContainer);
      } else if (typeof controller.onInit === 'function') {
        controller.onInit();
      }
      
    } catch (err) {
      console.error(`Failed to navigate to ${hash}:`, err);
      const fallback = this.diContainer.getFallbackRoute();
      if (fallback && hash !== fallback) {
        // Redirect to fallback
        window.location.hash = fallback;
      }
    }
  }
}
