require('nodejs-import-helper');

//tests
include('test/org/metajs/core/AnnotationHelper_isVariable.js');
include('test/org/metajs/core/AnnotationHelper_isFunction.js');
include('test/org/metajs/core/AnnotationHelper_isEmptyLine.js');
include('test/org/metajs/core/AnnotationHelper_haveHeadAnnotation.js');
include('test/org/metajs/core/AnnotationHelper_getRawAnnotationsOfSingleVarLineIndex.js');
include('test/org/metajs/core/AnnotationHelper_getVariableNameFromRawLine.js');
include('test/org/metajs/core/AnnotationHelper_getFunctionNameFromRawLine.js');
include('test/org/metajs/core/AnnotationHelper_getAnnotationMetadataFromRawAnnotationLine.js');
include('test/org/metajs/core/AnnotationHelper_getVarOrFunctionLineOfAnnotationInThisIndexLine.js');
include('test/org/metajs/core/AnnotationHelper_getAnnotationNameFromRawAnnotation.js');
include('test/org/metajs/core/AnnotationHelper_getAnnotationsByVariableFromFile.js');
