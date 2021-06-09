require('nodejs-require-enhancer');

let SomeTest = require("org/linkstartjs/webpack/scripts/WebpackBuildTest.js");
// let instancedTest = new SomeTest();
// instancedTest.run();

// var log = console.log;
//
// var tests = [
//   // 'org/linkstartjs/webpack/util/WebpackUtilTest.js',
//   'org/linkstartjs/webpack/scripts/WebpackBuildTestPupeter.js',
// ];
//
// var testLog = "";
// // console.log = function(message) {
// //   // testLog = testLog.concat("\n").concat(message);
// //   log(message);
// // }
//
// for(test of tests){
//   try{
//     testLog = "";
//     let SomeTest = require(test);
//     let instancedTest = new SomeTest();
//     instancedTest.run();
//     // instancedTest.run(function(){
//     //   log('\x1b[32m', `✓\t${test}`);
//     //   log(testLog);
//     // });
//   }catch(err){
//     log('\x1b[31m', `x\t${test}`);
//     log(err);
//     log(testLog);
//   }
// }



// process.env.LINK_START_LOG_LEVEL = 'debug'
// // process.env.META_JS_LOG_LEVEL = 'debug'
// process.env.NODE_ENV = 'production'
// process.env.LINKS_START_TEST_PATH = __dirname+"/app"
// const WebpackBuild = require('org/linkstartjs/webpack/scripts/WebpackBuild.js')
// var webpackBuild = new WebpackBuild();
// webpackBuild.run(function(){
//   console.log("#######################");
// });
// //tests
// require('org/metajs/core/AnnotationHelper/AnnotationHelper_isClassicVariable.js');
