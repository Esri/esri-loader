export const jaspi3xUrl = 'base/test/mocks/jsapi3x.js';

// test helper functions

// stub global require function
export function stubRequire() {
  window.require = function(moduleNames, callback) {
    if (callback) {
      // call the callback w/ the module names that were passed in
      callback.apply(this, moduleNames);
    }
  };
  window.require.on = (name, callback) => {
    return {
      /* tslint:disable no-empty */
      remove() {}
      /* tslint:enable no-empty */
    };
  };
}

// remove previously stubbed require function
export function removeRequire() {
  delete window.require;
}
