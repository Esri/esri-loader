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
  });

  describe('when loading the css', function () {
    describe('with a url', function () {
      var url = 'https://js.arcgis.com/4.8/esri/css/main.css';
      var link;
      beforeAll(function () {
        spyOn(document.head, 'appendChild').and.stub();
        spyOn(document, 'querySelector');
        link = esriLoader.loadCss(url);
      });
      it('should have checked if the link was already appended', function() {
        expect(document.querySelector.calls.argsFor(0)[0]).toEqual(`link[href*="${url}"]`);
      });
      it('should have set the href', function () {
        expect(link.href).toEqual(url);
      });
      it('should not have set the rel', function () {
        expect(link.rel).toEqual('stylesheet');
      });
    });
    describe('when called twice', function () {
      describe('when loading the same url', function () {
        var url = 'https://js.arcgis.com/4.8/esri/css/main.css';
        var link, link2;
        beforeAll(function () {
          spyOn(document.head, 'appendChild').and.stub();
          link = esriLoader.loadCss(url);
          spyOn(document, 'querySelector').and.returnValue(link);
          link2 = esriLoader.loadCss(url);
        });
        it('should return the link if it is already loaded', function () {
          expect(link2).toEqual(link);
        });
        it('should not have tried to append the link a second time', function () {
          expect(document.head.appendChild.calls.count()).toEqual(1);
        });
      });
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
        spyOn(document.head, 'appendChild');
        esriLoader.loadScript()
        .then((script) => {
          // hold onto script element for assertions below
          scriptEl = script;
          done();
        });
      });
      it('should default to latest version', function () {
        expect(scriptEl.src).toEqual('https://js.arcgis.com/4.8/');
      });
      it('should not have set dojoConfig', function () {
        expect(window.dojoConfig).not.toBeDefined();
      });
      it('should not have called loadCss', function () {
        expect(document.head.appendChild.calls.any()).toBeFalsy();
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
          url: 'https://js.arcgis.com/3.25'
        })
        .then((script) => {
          // hold onto script element for assertions below
          scriptEl = script;
          done();
        });
      });
      it('should load different version', function () {
        expect(scriptEl.src).toEqual('https://js.arcgis.com/3.25');
      });
      it('should not have set dojoConfig', function () {
        expect(window.dojoConfig).not.toBeDefined();
      });
    });
    describe('with css option', function () {
      var cssUrl = 'https://js.arcgis.com/4.8/esri/css/main.css';
      beforeAll(function (done) {
        spyOn(document.body, 'appendChild').and.callFake(function (el) {
          // trigger the onload event listeners
          el.dispatchEvent(new Event('load'));
        });
        spyOn(document.head, 'appendChild').and.stub();
        esriLoader.loadScript({
          css: cssUrl
        })
        .then((script) => {
          done();
        });
      });
      it('should have called loadCss with the url', function () {
        expect(document.head.appendChild.calls.argsFor(0)[0].href).toEqual(cssUrl);
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
