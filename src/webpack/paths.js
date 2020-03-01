const path = require('path')
const appPath = process.cwd();
const lassiejsHomePath = path.resolve(__dirname, '..', '..');
console.log("workspace:"+appPath);
console.log("lassiejsHomePath:"+lassiejsHomePath);
module.exports = {
  src: appPath + '/src', // source files
  build: appPath + '/dist', // production build files
  lassiejsHomePath: lassiejsHomePath, // production build files
  // static: path.resolve(__dirname, '../public'), // static files to copy to build folder
}
