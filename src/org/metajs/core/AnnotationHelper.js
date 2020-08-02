const fs = require('fs');
const pathUtil = require('path');
var lineNumber = require('line-number');

function AnnotationHelper() {

}

//deprecated
AnnotationHelper.getLine = function(fileContent, line, internalAnnotations) {
  var lines = fileContent.split("\n");
  console.log("getting var of annotation");
  console.log("file content");
  console.log(lines);
  console.log("anottation initial line:"+line);
  if(line >= lines.length){
    throw new Error('File end reached without finding line');
  }
  //TODO volver a llamar a egtLIne +1
  console.log("internalAnnotations:"+internalAnnotations);
  console.log("line:"+lines[line+1]);
  var annotationsMatchs = AnnotationHelper.regex(internalAnnotations, lines[line+1]);
  console.log("annotationsMatchs:"+annotationsMatchs);
  if(annotationsMatchs && annotationsMatchs.length > 0){
    console.log("line is not a var, is an annotation");
    return AnnotationHelper.getLine(fileContent, line+2, internalAnnotations)
  }else{
    return lines[line+1];
  }
};

AnnotationHelper.getVarOrFunctionLineOfAnnotationInThisIndexLine = function(lines, line, internalAnnotationsRegexString) {

  console.log("getting var/function of annotation");
  console.log("file content is");
  console.log(JSON.stringify(lines, null, 4));
  console.log("lines:"+lines.length);
  console.log("annotation is in index line:"+line);
  if(line >= lines.length){
    throw new Error('File end reached without finding line');
  }

  console.log("regex to determine if this line is an annotation:"+internalAnnotationsRegexString);
  console.log("line index to analize is +1:"+line+1);
  console.log("line to analize is:"+lines[line+1]);
  // var annotationsMatchs = AnnotationHelper.createRegexFromAnnotations(internalAnnotations, lines[line+1]);
  var annotationsMatchs = lines[line+1].match(new RegExp(internalAnnotationsRegexString, "g"));
  console.log("line contains or is an annotation?:"+annotationsMatchs);
  //if this line is an annotation, execute again with next line
  if(annotationsMatchs && annotationsMatchs.length > 0){
    console.log("line is not a var/function, is an annotation. Recursive starts");
    return AnnotationHelper.getVarOrFunctionLineOfAnnotationInThisIndexLine(lines, line+1, internalAnnotationsRegexString)
  }else{
    //return raw line var
    return {
      line: lines[line+1],
      index:line+1
    };
  }
};

//deprecated
AnnotationHelper.getLineNumbersOfRegexInContent = function(regex, fileContent) {
  var annotationMatchs = lineNumber(fileContent, new RegExp(regex, "g"));
  return annotationMatchs;
};


AnnotationHelper.getAnnotationsByVariableFromFile = function(fileLines, internalAnnotationsArray) {
  var internalAnnotationsRegexString = AnnotationHelper.createRegexFromAnnotations(internalAnnotationsArray);

  var variables = {};
  var functions = {};

  for(var i=0; i<fileLines.length; i++){
    var line = fileLines[i];
    console.log("\nline index:"+i);
    var annotationsMatchs = line.match(new RegExp(internalAnnotationsRegexString, "g"));
    console.log("line contains or is an annotation?:"+annotationsMatchs);
    if(annotationsMatchs && annotationsMatchs.length > 0){
      console.log("is an annotation");
      var rawLineData = AnnotationHelper.getVarOrFunctionLineOfAnnotationInThisIndexLine(fileLines, i, internalAnnotationsRegexString);
      var rawLine = rawLineData.line;
      console.log("var or function raw line is:"+rawLine);
      if(AnnotationHelper.isVariable(rawLine)){
        var variableName = AnnotationHelper.getVariableNameFromRawLine(rawLine);
        console.log("var is : "+variableName);
        var rawAnnotations = AnnotationHelper.getRawAnnotationsOfSingleVarLineIndex(fileLines, rawLineData.index, internalAnnotationsRegexString);
        console.log("raw annotations");
        console.log(rawAnnotations);
        var parsedAnnotations = [];
        rawAnnotations.forEach(function(rawAnnotation, i){
          var annotationMetadata = AnnotationHelper.getAnnotationMetadataFromRawAnnotationLine(rawAnnotation);
          console.log(annotationMetadata);
          parsedAnnotations.push(annotationMetadata);
        });
        variables[variableName] = parsedAnnotations;
      }else if(AnnotationHelper.isFunction(rawLine)){
        var functionName = AnnotationHelper.getFunctionNameFromRawLine(rawLine);
        console.log("function is : "+functionName);
        var rawAnnotations = AnnotationHelper.getRawAnnotationsOfSingleVarLineIndex(fileLines, rawLineData.index, internalAnnotationsRegexString);
        console.log("raw annotations");
        console.log(rawAnnotations);
        var parsedAnnotations = [];
        rawAnnotations.forEach(function(rawAnnotation, i){
          console.log("analizing:"+rawAnnotation);
          var annotationMetadata = AnnotationHelper.getAnnotationMetadataFromRawAnnotationLine(rawAnnotation);
          console.log(annotationMetadata);
          parsedAnnotations.push(annotationMetadata);
        });

        functions[functionName] = parsedAnnotations;
      }
    }else{
      console.log("is not an annotation");
    }
  }

  return {variables:variables,functions:functions};

};

AnnotationHelper.getRawAnnotationsOfSingleVarLineIndex = function(fileLines, rawVarLineIndex, internalAnnotationsRegexString) {

  console.log("getting annotations of this raw var/function:"+fileLines[rawVarLineIndex]);
  console.log("in this line:"+rawVarLineIndex);
  console.log("file content is");
  console.log(JSON.stringify(fileLines, null, 4));
  console.log("lines:"+fileLines.length);

  if(AnnotationHelper.isEmptyLine(fileLines[rawVarLineIndex])){
    console.log("empty line");
    return;
  }

  console.log("regex to determine if this line is an annotation:"+internalAnnotationsRegexString);

  var foundRawAnnotations = [];

  for(var i=rawVarLineIndex-1; i>0; i-- ){
    console.log("# line index to analize is : "+i);
    console.log("line to analize is:"+fileLines[i]);

    if(AnnotationHelper.isEmptyLine(fileLines[i])){
      console.log("empty line");
      break;
    }

    var annotationsMatchs = fileLines[i].match(new RegExp(internalAnnotationsRegexString, "g"));
    console.log("line contains or is an annotation?:"+annotationsMatchs);
    if(annotationsMatchs && annotationsMatchs.length > 0){
      console.log("push");
      foundRawAnnotations.push(fileLines[i])
    }
  }

  return foundRawAnnotations;

};

/*
Get line of file using number
input: string content of file, line to lookup
output: string line
*/
AnnotationHelper.createRegexFromAnnotations = function(annotationsArray) {
  var regexString="";
  for(let i=0;i<annotationsArray.length;i++){
    regexString+="@"+annotationsArray[i]+"\\(.+\\)"
    if(i<annotationsArray.length-1){
      regexString+="|"
    }
  }
  return regexString;
}


AnnotationHelper.haveHeadAnnotation = function(fileContent, headAnnotations) {
  var stringRegex = AnnotationHelper.createRegexFromAnnotations(headAnnotations);
  console.log("regex:"+stringRegex);
  var regexMatches = fileContent.match(new RegExp(stringRegex, "g"));
  console.log("Detected head annotations: "+regexMatches);
  if(!regexMatches || regexMatches.length == 0){
    console.log("Does not have any of header annotations");
    return false;
  }else{
    return true;
  }
};

AnnotationHelper.isVariable = function(line) {
  var regexMatches = line.match(new RegExp('\\s*var\\s+[a-zA-Z][\\w_]+\\s*\\;', "g"));
  if(regexMatches && regexMatches.length > 0){
    return true;
  }else{
    return false;
  }
};

AnnotationHelper.isFunction = function(line) {
  var regexMatches = line.match(new RegExp('\\s*const\\s*[a-zA-Z][\\w_]+\\s+[=]\\s+\\((\\s*[a-zA-Z][\\w_]*\\s*,?\s*)*\\)\\s+[=][>]\\s+{\\s*', "g"));
  if(regexMatches && regexMatches.length > 0){
    return true;
  }else{
    return false;
  }
};

AnnotationHelper.isEmptyLine = function(line) {
   return (!line || /^\s*$/.test(line));
};

AnnotationHelper.getVariableNameFromRawLine = function(line) {
   var regexMatches = line.match(new RegExp('\\s*var\\s+[a-zA-Z][\\w_]+', "g"));
   return regexMatches[0].replace("var","").replace(/ /g,'');
};

AnnotationHelper.getFunctionNameFromRawLine = function(line) {
   var regexMatches = line.match(new RegExp('\\s*const\\s*[a-zA-Z][\\w_]+', "g"));
   return regexMatches[0].replace("const","").replace(/ /g,'');
};

AnnotationHelper.getAnnotationMetadataFromRawAnnotationLine = function(line) {
  var rawArguments = line.match(new RegExp('[a-zA-Z]+=\\"[a-zA-Z/_-]+\\"', "g"));
  var annotationArguments = {};
  rawArguments.forEach(function(rawArgument) {
      var argumentArray = rawArgument.split("=");
      var key = argumentArray[0];
      var value = argumentArray[1].replace(new RegExp("\"", 'g'),"");
      annotationArguments[key] = value;
  });
  var name = AnnotationHelper.getAnnotationNameFromRawAnnotation(line);
  return {
    name:name,
    arguments:annotationArguments
  };
};

AnnotationHelper.getAnnotationNameFromRawAnnotation = function(rawAnnotation) {
   return rawAnnotation.substring(rawAnnotation.indexOf("@")+1, rawAnnotation.indexOf("("));
};



module.exports = AnnotationHelper;
