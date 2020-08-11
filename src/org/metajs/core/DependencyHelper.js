require('nodejs-import-helper');
const fs = require('fs');
const pathUtil = require('path');
var lineNumber = require('line-number');
var AnnotationHelper = include('src/org/metajs/core/AnnotationHelper.js');


function DependencyHelper() {

}

DependencyHelper.getDependecies = function(rootPath, expectedExtensions, fileExclusions,
                                           headAnnotations, internalAnnotations) {

  console.log("dependencyRootPath: "+rootPath);

  var headAnnotationsStringRegex=AnnotationHelper.createRegexFromAnnotations(headAnnotations)
  var internalAnnotationsStringRegex=AnnotationHelper.createRegexFromAnnotations(internalAnnotations)


  var files = [];
  var dependencies = [];
  DependencyHelper.getJsFiles(rootPath, files, expectedExtensions, fileExclusions)

  console.log("\nRaw dependencies");

  for (var key in files) {
    var file = files[key];
    console.log("file:"+file);
    var contents = fs.readFileSync(file, 'utf8');
    var headAnnotationMetadata = AnnotationHelper.getHeadAnnotationMetadata(contents, headAnnotationsStringRegex);
    console.log(headAnnotationMetadata);
    if(typeof headAnnotationMetadata !== 'undefined'){
      var lines = contents.split("\n");
      var foundAnnotations = AnnotationHelper.getDependecyAnnotationsGroupByVariableOrFunction(lines, internalAnnotationsStringRegex);
      if(foundAnnotations){
        headAnnotationMetadata.location = file;
        foundAnnotations.meta = headAnnotationMetadata;
        dependencies.push(foundAnnotations);
      }
    }

  }

  return dependencies;
};



/*
Get list of js files in the main project, without excludes
input: main path
output: string[]
*/
DependencyHelper.getJsFiles = function(path, files, expectedExtensions, excludes) {

  fs.readdirSync(path).forEach(function(file) {
    var absolutePath = path + '/' + file;
    if (fs.lstatSync(absolutePath).isDirectory()) {
      if (absolutePath.includes("node_modules") || absolutePath.includes(".git")) {
        return;
      }
      DependencyHelper.getJsFiles(absolutePath, files, expectedExtensions, excludes);
    } else {
      var ext = pathUtil.extname(file);
      if ((expectedExtensions.indexOf(ext) < 0) || DependencyHelper.isExcludeFile(absolutePath, excludes)) {
        return;
      }
      files.push(path + '/' + file);
    }
  });
}

/*
Get line of file using number
input: string content of file, line to lookup
output: string line
*/
DependencyHelper.isExcludeFile = function(file, excludes) {

  for(let key in excludes){
    if(file.endsWith(excludes[key])){
      return true;
    }
  }

  return false;
}


module.exports = DependencyHelper;
