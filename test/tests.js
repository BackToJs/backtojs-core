require('nodejs-import-helper');

//tests
include('test/org/metajs/core/AnnotationHelper/AnnotationHelper_isVariable.js');
include('test/org/metajs/core/AnnotationHelper/AnnotationHelper_isFunction.js');
include('test/org/metajs/core/AnnotationHelper/AnnotationHelper_isEmptyLine.js');
include('test/org/metajs/core/AnnotationHelper/AnnotationHelper_getHeadAnnotationMetadata.js');
include('test/org/metajs/core/AnnotationHelper/AnnotationHelper_getRawAnnotationsOfSingleVarLineIndex.js');
include('test/org/metajs/core/AnnotationHelper/AnnotationHelper_getVariableNameFromRawLine.js');
include('test/org/metajs/core/AnnotationHelper/AnnotationHelper_getFunctionNameFromRawLine.js');
include('test/org/metajs/core/AnnotationHelper/AnnotationHelper_getAnnotationMetadataFromRawAnnotationLine.js');
include('test/org/metajs/core/AnnotationHelper/AnnotationHelper_getVarOrFunctionLineOfAnnotationInThisIndexLine.js');
include('test/org/metajs/core/AnnotationHelper/AnnotationHelper_getAnnotationNameFromRawAnnotation.js');
include('test/org/metajs/core/AnnotationHelper/AnnotationHelper_getDependecyAnnotationsGroupByVariableOrFunction.js');

include('test/org/metajs/core/DependencyHelper/DependencyHelper_getDependecies.js');
