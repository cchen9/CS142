"use strict";


function cs142MakeMultiFilter(originalArray) {
  var currentArray = originalArray;
  function arrayFilterer(filterCriteria, callback) {
    // If filterCriteria is not a function, the returned function (arrayFilterer)
    // should immediately return the value of currentArray with no filtering performed.
    if (typeof filterCriteria !== 'function'){
      return currentArray;
    }
    var newArray = [];
    for (var i = 0; i < currentArray.length; i++){
      if (filterCriteria(currentArray[i])){
        newArray.push(currentArray[i]);
      }
    }
    currentArray = newArray;
    if (typeof callback === 'function'){
      // Accessing this inside the callback function should reference the value of originalArray
      // In JavaScript strict mode, the first argument becomes the value of "this" in the invoked
      // function, even if the argument is not an object.
      // https://www.w3schools.com/js/js_function_apply.asp
      // why does apply not work? why have to change to call?
      //callback.call(originalArray, currentArray);
      callback.call(originalArray, newArray);
    }
    // the arrayFilterer function should return itself unless filterCriteria
    // parameter is not specified in which case it should return the currentArray.
    // https://stackoverflow.com/questions/6959426/can-a-javascript-function-return-itself
    return arrayFilterer;
  }
  return arrayFilterer;
}
