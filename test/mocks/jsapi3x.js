// stub require function
window.require = function (moduleNames, callback) {
  if (callback) {
    // call the callback w/ the modulenames that were passed in
    callback.apply(this, moduleNames);
  }
}  
