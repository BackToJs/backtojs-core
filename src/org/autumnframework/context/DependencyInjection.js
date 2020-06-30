const fs = require('fs');
const pathUtil = require('path');
var lineNumber = require('line-number');

function DependencyInjection() {

}

DependencyInjection.getDependecies = function(rootPath, expectedExtensions, excludes) {

  var dependencyAnnotations = ["Page","Action"]
  var internalAnnotations = ["Autowire","DomElement","Render"]

  var dependencyRegexString=createRegexFromAnnotations(dependencyAnnotations)
  var internalRegexString=createRegexFromAnnotations(internalAnnotations)

  console.log(dependencyRegexString);


  console.log("dependencyRootPath: "+rootPath);

  var files = [];
  var dependencies = [];
  getJsFiles(rootPath, files, expectedExtensions, excludes)

  console.log("\nRaw dependencies");

  for (var key in files) {
    var file = files[key];
    console.log("file:"+file);
    var contents = fs.readFileSync(file, 'utf8');
    var dependencyMetadata = getDependencyAndItsAnnotations(contents,file,dependencyRegexString, internalRegexString);
    if(dependencyMetadata){
      dependencies.push(dependencyMetadata);
    }
  }

  return dependencies;
};

/*
Perform instantation and injection
input:   detectede dependencies, global express;
output: controller
*/
var performDependencyInjetion = function(dependencies) {

  var instancedDependecies = {};

  console.log("\nPerform instantation...");
  for(dependency of dependencies){
    console.log("Detected dependency:"+dependency.location);
    var functionRequire = require(dependency.location);
    var functionInstance = new functionRequire();
    console.log("Saving as instanced dependency:"+dependency.name);
    instancedDependecies[dependency.name] = functionInstance;
  }

  console.log("\nPerform injection...");
  for(dependency of dependencies){
    var functionInstance = instancedDependecies[dependency.name];
    console.log("Dependency:"+dependency.name);
    if(dependency.variablesToInject && dependency.variablesToInject.length >0){
      for(variableToInject of dependency.variablesToInject){
        if(variableToInject == "express"){
          console.log("Injecting :"+variableToInject);
          functionInstance["express"] = express;
        }else if(!instancedDependecies[variableToInject]){
          console.error(variableToInject+" was not found.");
        }else{
          console.log("Injecting :"+variableToInject);
          functionInstance[variableToInject] = instancedDependecies[variableToInject];
        }
      }
    }else{
      console.log(">"+dependency.name+" does not have variables to inject.");
    }

    functionInstance.main();
  }

}

var getDependencyAndItsAnnotations = function(fileContent, file, dependencyRegexString, internalAnnotationsRegexString) {

  var dependency = {};

  //lookup @Page @Action annotations
  // var dependencyMatchs = fileContent.match(new RegExp('@Page\\(.+\\)|@Action\\(.+\\)', "g"));
  var dependencyMatchs = fileContent.match(new RegExp(dependencyRegexString, "g"));
  console.log("Detected annotations: "+dependencyMatchs);
  if(dependencyMatchs && dependencyMatchs.length == 1){
    dependency.type = getDependecyType(dependencyMatchs[0]);
    dependency.location = file;
    dependency.arguments = parseDependencyAnnotation(dependencyMatchs[0]);
  }

  //continue if this is a valid dependency
  if(!dependency.location){
    return;
  }

  //lookup @Autowire annotations
  var re = /@Autowire/g;
  var autowireMatchs = lineNumber(fileContent, re);//get regex matches and its line number starting in 1
  var variablesToInject = [];
  if(autowireMatchs){
    for(autowire of autowireMatchs){
      if(autowire.number >= 0){
        //line detect by lineNumber is by position
        //we assume that variable data is just the next line to @Autowire
        var rawLine = getLine(fileContent, autowire.number, internalAnnotationsRegexString);
        variablesToInject.push(parseAutowireAnnotation(rawLine));
      }
    }
  }

  dependency.variablesToInject = variablesToInject;

  return dependency;
}

/*
Get name of var to autowire.
input:   var controller;
output: controller
*/
var getDependecyType = function(stringAnnotationRawData) {
  var ini = stringAnnotationRawData.indexOf("@");
  var end = stringAnnotationRawData.indexOf("(");
  return stringAnnotationRawData.substring(ini+1, end);
}

/*
Get name of var to autowire.
input:   var controller;
output: controller
*/
var parseAutowireAnnotation = function(stringAnnotationRawData) {
  var match = stringAnnotationRawData.match(new RegExp('\\s+\\w+\\;', "g"));
  if(match && match.length == 1){
    return match[0].replace(" ","").replace(";","");
  }
}

/*
Get name of Dependency.
input: @Dependency("Properties")
output: Properties
*/
var parseDependencyAnnotation = function(stringAnnotationRawData) {
  var annotationPayload = getAnnotationPayload(stringAnnotationRawData);

  if(new RegExp('^\\"\\w+\\"$', "g").test(annotationPayload)){
    var startIndex =  stringAnnotationRawData.indexOf("\"");
    var lastIndex =  stringAnnotationRawData.lastIndexOf("\"");
    var dependencyName = stringAnnotationRawData.substring(startIndex+1,lastIndex);
    var dependencyNameCamelCase = dependencyName.charAt(0).toLowerCase() + dependencyName.slice(1);
    return {"name":dependencyNameCamelCase};
  }else{

    var rawArguments = stringAnnotationRawData.match(new RegExp('\\w+=\\"\\w+\\"', "g"));
    var annotationArguments = {};
    rawArguments.forEach(function(rawArgument) {
        var argumentArray = rawArgument.split("=");
        var key = argumentArray[0];
        var value = argumentArray[1].replace(new RegExp("\"", 'g'),"");
        annotationArguments[key] = value;
    });
    return annotationArguments;
  }
}

/*
Get clean body of annotation.
input: @Dependency("Properties")
output: Properties
*/
var getAnnotationPayload = function(stringAnnotationRawData) {
  var annotationPayload =  stringAnnotationRawData.replace("@Page(","")
  .replace("@Action(","")
  .replace(")","").replace(")","")
  return annotationPayload;
}

/*
Get list of js files in the main project, without excludes
input: main path
output: string[]
*/
var getJsFiles = function(path, files, expectedExtensions, excludes) {

  fs.readdirSync(path).forEach(function(file) {
    var absolutePath = path + '/' + file;
    if (fs.lstatSync(absolutePath).isDirectory()) {
      if (absolutePath.includes("node_modules") || absolutePath.includes(".git")) {
        return;
      }
      getJsFiles(absolutePath, files, expectedExtensions, excludes);
    } else {
      var ext = pathUtil.extname(file);
      if ((expectedExtensions.indexOf(ext) < 0) || isExcludeFile(absolutePath, excludes)) {
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
function getLine(fileContent, line, internalAnnotations) {
    console.log("get line");
    var lines = fileContent.split("\n");
    if(line >= lines.length){
      throw new Error('File end reached without finding line');
    }
    //TODO volver a llamar a egtLIne +1
    console.log(internalAnnotations);
    console.log(lines[line]);
    var annotationsMatchs = lines[line].match(new RegExp(internalAnnotations, "g"));
    console.log(annotationsMatchs);
    if(annotationsMatchs && annotationsMatchs.length > 0){
      console.log(annotationsMatchs);
      return getLine(fileContent, line+1, internalAnnotations)
    }else{
      return lines[line];
    }

}

/*
Get line of file using number
input: string content of file, line to lookup
output: string line
*/
function isExcludeFile(file, excludes) {

  for(let key in excludes){
    if(file.endsWith(excludes[key])){
      return true;
    }
  }

  return false;
}

/*
Get line of file using number
input: string content of file, line to lookup
output: string line
*/
function createRegexFromAnnotations(annotationsArray) {
  var regexString="";
  for(let i=0;i<annotationsArray.length;i++){
    regexString+="@"+annotationsArray[i]+"\\(.+\\)"
    if(i<annotationsArray.length-1){
      regexString+="|"
    }
  }
  return regexString;
}


module.exports = DependencyInjection;
