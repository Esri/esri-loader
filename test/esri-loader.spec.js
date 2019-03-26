// helper functions
// stub require function
function stubRequire() {
  window.require = function (moduleNames, callback) {
    if (callback) {
      // call the callback w/ the modulenames that were passed in
      callback.apply(this, moduleNames);
    }
  }
  window.require.on = function(name, callback) {
    return {
      remove: function() {}
    }
  }
}
// remove script tags added by esri-loader
function removeScript() {
  const script = document.querySelector('script[data-esri-loader]');
  if (script) {
    script.parentElement.removeChild(script);
  }
}
// remove previously stubbed require function
function removeRequire() {
  delete window.require;
}

describe('esri-loader', function () {
  const jaspi3xUrl = 'base/test/mocks/jsapi3x.js';
  describe('when loading modules', function () {
    var expectedModuleNames = ['esri/map', 'esri/layers/VectorTileLayer'];
    describe('when script has been loaded', function() {
      beforeEach(function () {
        // stub window require
        stubRequire();
      });
      it('should have registered an error handler', function (done) {
        spyOn(window.require, 'on').and.callThrough();
        esriLoader.loadModules(expectedModuleNames)
        .then(() => {
          expect(window.require.on.calls.argsFor(0)[0]).toEqual('error');
          done();
        })
        .catch(err => {
          done.fail('call to loadScript should not have failed with: ' + err);
        });
      });
      it('should call require w/ correct args', function (done) {
        spyOn(window, 'require').and.callThrough();
        esriLoader.loadModules(expectedModuleNames)
        .then(() => {
          expect(window.require.calls.argsFor(0)[0]).toEqual(expectedModuleNames);
          done();
        })
        .catch(err => {
          done.fail('call to loadScript should not have failed with: ' + err);
        });
      });
      afterEach(function () {
        // clean up
        removeRequire();
      });
    });
    describe('when the script has not yet been loaded', function() {
      beforeEach(function() {
        // uh oh, not sure why this is needed
        // seems like some test above did not clean up after itself
        // but I can't find where
        // TODO: remove this line
        removeRequire();
        // w/o it, test fails w/
        // TypeError: Cannot read property 'argsFor' of undefined
        // b/c require is defined so it's not trying to add the script
        // and doesn't enter the appendChild spyOn() block below
      });
      describe('when there has been no attempt to load the script yet', function () {
        it('should not reject', function (done) {
          spyOn(document.body, 'appendChild').and.callFake(function (el) {
            stubRequire();
            spyOn(window, 'require').and.callThrough();
            // trigger the onload event listeners
            el.dispatchEvent(new Event('load'));
          });
            esriLoader.loadModules(expectedModuleNames, {
            url: jaspi3xUrl
          })
          .then(() => {
            expect(window.require.calls.argsFor(0)[0]).toEqual(expectedModuleNames);
            done();
          })
          .catch(err => {
            done.fail('call to loadScript should not have failed with: ' + err);
          });
        });
      });
      describe('when the script is still loading', function () {
        it('should not reject', function (done) {
          let scriptEl;
          spyOn(document.body, 'appendChild').and.callFake(function (el) {
            scriptEl = el;
            // setTimeout(function () {
              stubRequire();
              spyOn(window, 'require').and.callThrough();
              // trigger the onload event listeners
              el.dispatchEvent(new Event('load'));
            // }, 1000);
          });
          spyOn(document, 'querySelector').and.callFake(function() {
            return scriptEl;
          });
          // load script using a non-default url
          esriLoader.loadScript({
            url: jaspi3xUrl
          });
          // don't wait for the script to load before trying to load modules
          esriLoader.loadModules(expectedModuleNames)
          .then(() => {
            expect(window.require.calls.argsFor(0)[0]).toEqual(expectedModuleNames);
            done();
          })
          .catch(err => {
            done.fail('call to loadScript should not have failed with: ' + err);
          });
        });
      });
      afterEach(function () {
        // clean up
        removeRequire();
      });
    });
  });
});
