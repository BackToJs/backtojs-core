// var div;
// div = document.createElement("template");
// div.innerHTML = "<h1>hello world</h1>";
// return div;


#####

// module.exports = function(content) {
//   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>:");
//   return content;
// };

// module.exports = function(content, map, meta) {
//   console.log(">>>>>>>>>>>>>>");
//   console.log(map);
//   console.log(meta);
//   return content;
// };

// import loaderUtils from 'loader-utils';
const loaderUtils = require("loader-utils");

// export default function loader(content) {
//   const options = loaderUtils.getOptions(this) || {};
//   console.log("##########################");
//   console.log(options);
//   return content;
// }

function loader(content) {
  const options = loaderUtils.getOptions(this) || {};
  console.log("##########################");
  console.log(this.resourcePath);
  console.log(this.context);
  console.log(options);
  return content;
}

module.exports = loader;


##

https://github.com/webpack-contrib/file-loader/blob/master/src/index.js
