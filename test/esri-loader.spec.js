describe('esri-loader', function () {
  describe('when has not yet been loaded', function () {
    beforeEach(function() {
      // remove previously stubbed require function
      delete window.require;
      // esri-loader script has not yet been loaded
      spyOn(document, 'querySelector').and.returnValue(null);
    });
    it('isLoaded should be false', function () {
      expect(esriLoader.isLoaded())
    });
    it('should throw error when trying to load modules', function() {
      function loadModules () {
        esriLoader.dojoRequire(['esri/map', 'esri/layers/VectorTileLayer'], function (Map, VectorTileLayer) {});
      }
      expect(loadModules).toThrowError('The ArcGIS API for JavaScript has not been loaded. You must first call esriLoader.bootstrap()');
    });
  });

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
    describe('when called twice', function () {
      var scriptEl;
      var context = {
        bootstrapCallback: function () {}
      };
      describe('w/ a callback', function () {
        beforeAll(function () {
          spyOn(document.body, 'appendChild').and.callFake(function (el) {
            // hold onto script element for assertions below
            scriptEl = el;
            // call the onload callback
            el.onload();
          });
          spyOn(document, 'querySelector').and.callFake(function() {
            console.log('querySelector', scriptEl);
            return scriptEl;
          });
          spyOn(context, 'bootstrapCallback');
        });
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
  });

  describe('when loading modules', function () {
    var expectedModuleNames = ['esri/map', 'esri/layers/VectorTileLayer'];
    var context = {
      requireCallback: function () {}
    };
    var actualModuleNames;
    beforeAll(function () {
      // mock window require
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
