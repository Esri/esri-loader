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
  describe('when has not yet been loaded', function () {
    beforeEach(function() {
      removeRequire();
      removeScript();
    });
    it('isLoaded should be false', function () {
      expect(esriLoader.isLoaded()).toBeFalsy();
    });
    it('should throw error when trying to load modules w/ dojoRequire', function() {
      function loadModules () {
        esriLoader.dojoRequire(['esri/map', 'esri/layers/VectorTileLayer'], function (Map, VectorTileLayer) {});
      }
      expect(loadModules).toThrowError('The ArcGIS API for JavaScript has not been loaded. You must first call esriLoader.bootstrap()');
    });
    afterEach(function() {
      removeRequire();
      removeScript();
    });
  });

  describe('when loading the script', function () {
    describe('with defaults', function () {
      var scriptEl;
      beforeAll(function (done) {
        spyOn(document.body, 'appendChild').and.callFake(function (el) {
          // trigger the onload event listeners
          el.dispatchEvent(new Event('load'));
        });
        esriLoader.loadScript()
        .then((script) => {
          // hold onto script element for assertions below
          scriptEl = script;
          done();
        });
      });
      it('should default to latest version', function () {
        expect(scriptEl.src).toEqual('https://js.arcgis.com/4.5/');
      });
      it('should not have set dojoConfig', function () {
        expect(window.dojoConfig).not.toBeDefined();
      });
    });
    describe('with different API version', function () {
      var scriptEl;
      beforeAll(function (done) {
        spyOn(document.body, 'appendChild').and.callFake(function (el) {
          // trigger the onload event listeners
          el.dispatchEvent(new Event('load'));
        });
        esriLoader.loadScript({
          url: 'https://js.arcgis.com/3.20'
        })
        .then((script) => {
          // hold onto script element for assertions below
          scriptEl = script;
          done();
        });
      });
      it('should load different version', function () {
        expect(scriptEl.src).toEqual('https://js.arcgis.com/3.20');
      });
      it('should not have set dojoConfig', function () {
        expect(window.dojoConfig).not.toBeDefined();
      });
    });
    describe('with dojoConfig option', function () {
      var dojoConfig = {
        async: true,
        packages: [
          {
            location: 'path/to/somelib',
            name: 'somelib'
          }
        ]
      };
      beforeAll(function (done) {
        spyOn(document.body, 'appendChild').and.callFake(function (el) {
          // trigger the onload event listeners
          el.dispatchEvent(new Event('load'));
        });
        esriLoader.loadScript({
          dojoConfig: dojoConfig
        })
        .then((script) => {
          done();
        });
      });
      it('should have set global dojoConfig', function () {
        expect(window.dojoConfig).toEqual(dojoConfig);
      });
      afterAll(function() {
        window.dojoConfig = undefined;
      });      
    });
    describe('when already loaded by some other means', function () {
      beforeAll(function () {
        stubRequire();
      });
      it('should reject', function (done) {
        esriLoader.loadScript({
          url: jaspi3xUrl
        })
        .then(script => {
          done.fail('call to loadScript should have failed');
        })
        .catch(err => {
          expect(err.message).toEqual(`The ArcGIS API for JavaScript is already loaded.`);
          done();
        });
      });
      afterAll(function () {
        // clean up
        removeRequire();
      });
    });
    describe('when loading an invalid url', function () {
      it('should pass an error to the callback', function (done) {
        esriLoader.loadScript({
          url: 'not a valid url'
        })
        .then(script => {
          done.fail('call to loadScript should have failed');
        })
        .catch(err => {
          expect(err.message.indexOf('There was an error attempting to load')).toEqual(0);
          done();
        });
      });
      afterAll(function () {
        // clean up
        removeScript();
      });
    });
    describe('when called twice', function () {
      describe('when loading the same script', function () {
        it('should resolve the script if it is already loaded', function (done) {
          esriLoader.loadScript({
            url: jaspi3xUrl
          })
          .then(firstScript => {
            // try loading the same script after the first one has already loaded
            esriLoader.loadScript({
              url: jaspi3xUrl
            })
            .then(script => {
              expect(script.getAttribute('src')).toEqual(jaspi3xUrl);
              done();
            })
            .catch(err => {
              done.fail('second call to loadScript should not have failed with: ' + err);
            });
          })
          .catch(() => {
            done.fail('first call to loadScript should not have failed');
          });
        });
        it('should resolve an unloaded script once it loads', function (done) {
          esriLoader.loadScript({
            url: jaspi3xUrl
          })
          .catch(() => {
            done.fail('first call to loadScript should not have failed');
          });
          // try loading the same script again
          esriLoader.loadScript({
            url: jaspi3xUrl
          })
          .then(script => {
            expect(script.getAttribute('src')).toEqual(jaspi3xUrl);
            done();
          })
          .catch(err => {
            done.fail('second call to loadScript should not have failed with: ' + err);
          });
        });
      });
      describe('when loading different scripts', function () {
        it('should reject', function (done) {
          esriLoader.loadScript({
            url: jaspi3xUrl
          })
          .catch(() => {
            done.fail('first call to loadScript should not have failed');
          });
          // try loading a different script
          esriLoader.loadScript({
            url: 'base/test/mocks/jsapi4x.js'
          })
          .then(script => {
            done.fail('second call to loadScript should have failed');
          })
          .catch(err => {
            expect(err.message).toEqual(`The ArcGIS API for JavaScript is already loaded (${jaspi3xUrl}).`);
            done();
          });
        });
      });
      afterEach(function () {
        // clean up
        removeRequire();
        removeScript();
      });
    });
  });

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
      afterEach(function () {
        // clean up
        removeRequire();
        removeScript();
      });
    });
  });

  // TODO: remove the following suites once the APIs they test have been removed
  describe('when bootstraping the API', function () {
    describe('with defaults', function () {
      var scriptEl;
      beforeAll(function () {
        spyOn(document.body, 'appendChild').and.callFake(function (el) {
          // hold onto script element for assertions below
          scriptEl = el;
          // call the onload callback
          el.onload();
        });
        esriLoader.bootstrap();
      });
      it('should default to latest version', function () {
        expect(scriptEl.src).toEqual('https://js.arcgis.com/4.5/');
      });
      it('should not have set dojoConfig', function () {
        expect(window.dojoConfig).not.toBeDefined();
      });
    });
    describe('with different API version', function () {
      var scriptEl;
      var context = {
        bootstrapCallback: function () {}
      };
      beforeAll(function () {
        spyOn(document.body, 'appendChild').and.callFake(function (el) {
          // hold onto script element for assertions below
          scriptEl = el;
          // call the onload callback
          el.onload();
        });
        spyOn(context, 'bootstrapCallback');
        esriLoader.bootstrap(context.bootstrapCallback, {
          url: 'https://js.arcgis.com/3.20'
        });
      });
      it('should load different version', function () {
        expect(scriptEl.src).toEqual('https://js.arcgis.com/3.20');
      });
      it('should have called callback', function () {
        expect(context.bootstrapCallback).toHaveBeenCalledTimes(1);
      });
    });
    describe('with dojoConfig option', function () {
      var dojoConfig = {
        async: true,
        packages: [
          {
            location: 'path/to/somelib',
            name: 'somelib'
          }
        ]
      };
      beforeAll(function () {
        spyOn(document.body, 'appendChild').and.callFake(function (el) {
          // call the onload callback
          el.onload();
        });
        esriLoader.bootstrap(undefined, {
          dojoConfig: dojoConfig
        });
      });
      it('should have set global dojoConfig', function () {
        expect(window.dojoConfig).toEqual(dojoConfig);
      });
      afterAll(function() {
        window.dojoConfig = undefined;
      });
    });
    describe('when called twice', function () {
      var scriptEl;
      var context = {
        bootstrapCallback: function () {}
      };
      beforeAll(function () {
        spyOn(document.body, 'appendChild').and.callFake(function (el) {
          // hold onto script element for assertions below
          scriptEl = el;
          // call the onload callback
          el.onload();
        });
        spyOn(document, 'querySelector').and.callFake(function() {
          return scriptEl;
        });
        spyOn(context, 'bootstrapCallback');
      });
      describe('w/ a callback', function () {
        it('should pass an error to the callback', function () {
          esriLoader.bootstrap(context.bootstrapCallback, {
            url: 'https://js.arcgis.com/3.20'
          });
          esriLoader.bootstrap(context.bootstrapCallback, {
            url: 'https://js.arcgis.com/3.20'
          });
          expect(context.bootstrapCallback.calls.argsFor(1)[0].message).toEqual('The ArcGIS API for JavaScript is already loaded.');
        });
      });
      describe('w/o a callback', function () {
        it('should not throw when called w/o a callback', function () {
          esriLoader.bootstrap(null, {
            url: 'https://js.arcgis.com/3.20'
          });
          esriLoader.bootstrap(null, {
            url: 'https://js.arcgis.com/3.20'
          });
          expect(1).toEqual(1);
        });
      });
    });
    describe('when loading an invalid url', function () {
      it('should pass an error to the callback', function (done) {
        esriLoader.bootstrap((err) => {
          expect(err.message.indexOf('There was an error attempting to load')).toEqual(0);
          done();
        }, {
          url: 'not a valid url'
        });
      });
      afterAll(function () {
        // clean up
        removeScript();
      });
    });
  });

  describe('when loading modules w/ dojoRequire', function () {
    var expectedModuleNames = ['esri/map', 'esri/layers/VectorTileLayer'];
    var context = {
      requireCallback: function () {}
    };
    var actualModuleNames;
    beforeAll(function () {
      // stub window require
      window.require = function (names, callback) {
        actualModuleNames = names;
        callback();
      };
      var esriLoaderScript = document.createElement('script');
      spyOn(document, 'querySelector').and.returnValue(esriLoaderScript);
      spyOn(context, 'requireCallback');
      esriLoader.dojoRequire(expectedModuleNames, context.requireCallback);
    });
    it('should call require w/ correct args', function () {
      expect(actualModuleNames).toEqual(expectedModuleNames);
    });
    it('should call callback', function () {
      expect(context.requireCallback).toHaveBeenCalledTimes(1);
    });
  });
});
