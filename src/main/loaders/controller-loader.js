module.exports = function(content) {
  let finalContent = content;

  // Pass 1: Handle [Controller(...)]
  // Match the annotation, followed by any whitespace/newlines or other annotations (middle), 
  // followed by the class declaration.
  const controllerRegex = /\[Controller(?:\(([^)]*)\))?\]([\s\S]*?)(\bexport\s+class\s+[A-Za-z0-9_]+\s*\{)/g;
  finalContent = finalContent.replace(controllerRegex, (match, argsString, middle, classDecl) => {
    // Strip the annotation, but preserve the exact number of newlines it occupied
    const newlines = (match.substring(0, match.indexOf(']') + 1).match(/\n/g) || []).length;
    
    let route = null;
    let fallback = false;
    let redirectOnRefresh = false;

    if (argsString) {
      // Extract key-value pairs
      const pairs = argsString.match(/(\w+)\s*=\s*(["'][^"']*["']|true|false)/g) || [];
      pairs.forEach(pair => {
        const [key, rawValue] = pair.split('=').map(s => s.trim());
        const value = rawValue.replace(/["']/g, ''); // strip quotes
        if (key === 'route') route = value;
        if (key === 'fallback') fallback = value === 'true';
        if (key === 'redirect_on_refresh') redirectOnRefresh = value === 'true';
      });
    }

    let statics = '';
    if (route) statics += ` static route = "${route}"; `;
    if (fallback) statics += ` static fallback = true; `;
    if (redirectOnRefresh) statics += ` static redirect_on_refresh = true; `;

    return '\n'.repeat(newlines) + middle + classDecl + statics;
  });

  // Pass 2: Handle [Inject(...)]
  // Match the annotation, followed by any whitespace/newlines or other annotations (middle),
  // followed by the class declaration.
  const injectRegex = /\[Inject\(([^)]+)\)\]([\s\S]*?)(\bexport\s+class\s+[A-Za-z0-9_]+\s*\{)/g;
  finalContent = finalContent.replace(injectRegex, (match, args, middle, classDecl) => {
    // args will be something like `"TodoStatsController", "TodoListController"`
    const newlines = (match.substring(0, match.indexOf(']') + 1).match(/\n/g) || []).length;
    return '\n'.repeat(newlines) + middle + classDecl + ` static inject = [${args}]; `;
  });

  return finalContent;
};
