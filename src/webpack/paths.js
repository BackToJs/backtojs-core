const path = require('path')
const appPath = process.cwd();
const linkStartJsHomePath = path.resolve(__dirname, '..', '..');
console.log("workspace:"+appPath);
console.log("linkStartJsHomePath:"+linkStartJsHomePath);
module.exports = {
  src: appPath + '/src', // source files
  build: appPath + '/dist', // production build files
  linkStartJsHomePath: linkStartJsHomePath, // production build files
  // static: path.resolve(__dirname, '../public'), // static files to copy to build folder
}
