/* tslint:disable only-arrow-functions */
import { jaspi3xUrl, removeRequire, stubRequire } from '../test/helpers';
import { isLoaded, loadScript, setDefaultOptions } from './script';
import * as cssUtils from './utils/css';

declare global {
  /* tslint:disable interface-name */
  interface Window {
    require?: any;
    stubRequire?: any;
  }
  /* tslint:enable interface-name */
}

// allow the mock scripts to emulate that the JSAPI has loaded
window.stubRequire = stubRequire;

// remove script tags added by esri-loader
function removeScript() {
  const script = document.querySelector('script[data-esri-loader]');
  if (script) {
    script.parentElement.removeChild(script);
  }
}

// don't actually load the script or styles
function fakeLoading() {
  spyOn(document.body, 'appendChild').and.callFake(function(el) {
    // trigger the onload event listeners
    el.dispatchEvent(new Event('load'));
  });
  spyOn(cssUtils, 'loadCss').and.stub();
}

describe('isLoaded', function() {
  describe('when has not yet been loaded', function() {
    beforeEach(function() {
      removeRequire();
      removeScript();
    });
    it('isLoaded should be false', function() {
      expect(isLoaded()).toBeFalsy();
    });
  });
});

describe('when loading the script', function() {
  describe('with library defaults', function() {
    let scriptEl;
    beforeAll(function(done) {
      fakeLoading();
      loadScript()
      .then((script) => {
        // hold onto script element for assertions below
        scriptEl = script;
        done();
      });
    });
    it('should default to latest version', function() {
      expect(scriptEl.src).toEqual('https://js.arcgis.com/4.23/');
    });
    it('should not have called loadCss', function() {
      expect((cssUtils.loadCss as jasmine.Spy).calls.any()).toBeFalsy();
    });
  });
  describe('with default loader options explicitly set', function() {
    const scriptUrl = 'http://server/path/to/esri';
    const cssUrl = `${scriptUrl}/css/main.css`;
    let scriptEl;
    beforeAll(function(done) {
      setDefaultOptions({
        url: scriptUrl,
        css: cssUrl
      });
      fakeLoading();
      loadScript()
      .then((script) => {
        // hold onto script element for assertions below
        scriptEl = script;
        done();
      });
    });
    it('should load the specified script url', function() {
      expect(scriptEl.src).toEqual(scriptUrl);
    });
    it('should have called loadCss', function() {
      expect((cssUtils.loadCss as jasmine.Spy).calls.any()).toBeTruthy();
    });
    it('should have called loadCss with the specified CSS url', function() {
      expect((cssUtils.loadCss as jasmine.Spy).calls.argsFor(0)[0]).toEqual(cssUrl);
    });
    afterAll(function() {
      setDefaultOptions(null);
    });
  });
  describe('with a specific version from the CDN', function() {
    const expected = 'https://js.arcgis.com/3.40/';
    let scriptEl;
    beforeAll(function(done) {
      fakeLoading();
      loadScript({
        version: '3.40'
      })
      .then((script) => {
        // hold onto script element for assertions below
        scriptEl = script;
        done();
      });
    });
    it('should load CDN version', function() {
      expect(scriptEl.src).toEqual(expected);
    });
  });
  describe('with a specific url', function() {
    const url = 'http://server/path/to/esri';
    let scriptEl;
    beforeAll(function(done) {
      fakeLoading();
      loadScript({
        url
      })
      .then((script) => {
        // hold onto script element for assertions below
        scriptEl = script;
        done();
      });
    });
    it('should load url', function() {
      expect(scriptEl.src).toEqual(url);
    });
  });
  describe('with css option', function() {
    describe('from default version', () => {
      beforeAll(function(done) {
        fakeLoading();
        loadScript({
          css: true
        })
        .then((script) => {
          done();
        });
      });
      it('should have called loadCss with no arguments', function() {
        expect((cssUtils.loadCss as jasmine.Spy).calls.argsFor(0)[0]).toBeUndefined();
      });
    });
    describe('with a specific version from the CDN', () => {
      const version = '3.40';
      beforeAll(function(done) {
        fakeLoading();
        loadScript({
          version,
          css: true
        })
        .then((script) => {
          done();
        });
      });
      it('should have called loadCss with the version', function() {
        expect((cssUtils.loadCss as jasmine.Spy).calls.argsFor(0)[0]).toEqual(version);
      });
    });
    describe('with a specific url', () => {
      const url = 'http://server/path/to/esri';
      const cssUrl = `${url}/css/main.css`;
      beforeAll(function(done) {
        fakeLoading();
        loadScript({
          url,
          css: cssUrl
        })
        .then((script) => {
          done();
        });
      });
      it('should have called loadCss with the url', function() {
        expect((cssUtils.loadCss as jasmine.Spy).calls.argsFor(0)[0]).toEqual(cssUrl);
      });
    });
  });
  describe('when already loaded by some other means', function() {
    beforeAll(function() {
      stubRequire();
    });
    it('should reject', function(done) {
      loadScript({
        url: jaspi3xUrl
      })
      .then(() => {
        done.fail('call to loadScript should have failed');
      })
      .catch((err) => {
        expect(err.message).toEqual(`The ArcGIS API for JavaScript is already loaded.`);
        done();
      });
    });
    afterAll(function() {
      // clean up
      removeRequire();
    });
  });
  describe('when loading an invalid url', function() {
    it('should pass an error to the callback', function(done) {
      loadScript({
        url: 'not a valid url'
      })
      .then(() => {
        done.fail('call to loadScript should have failed');
      })
      .catch((err) => {
        expect(err.message.indexOf('There was an error attempting to load')).toEqual(0);
        done();
      });
    });
    afterAll(function() {
      // clean up
      removeScript();
    });
  });
  describe('when called twice', function() {
    describe('when loading the same script', function() {
      it('should resolve the script if it is already loaded', function(done) {
        loadScript({
          url: jaspi3xUrl
        })
        .then(() => {
          // try loading the same script after the first one has already loaded
          loadScript({
            url: jaspi3xUrl
          })
          .then((script) => {
            expect(script.getAttribute('src')).toEqual(jaspi3xUrl);
            done();
          })
          .catch((err) => {
            done.fail('second call to loadScript should not have failed with: ' + err);
          });
        })
        .catch(() => {
          done.fail('first call to loadScript should not have failed');
        });
      });
      it('should resolve an unloaded script once it loads', function(done) {
        loadScript({
          url: jaspi3xUrl
        })
        .catch(() => {
          done.fail('first call to loadScript should not have failed');
        });
        // try loading the same script again
        loadScript({
          url: jaspi3xUrl
        })
        .then((script) => {
          expect(script.getAttribute('src')).toEqual(jaspi3xUrl);
          done();
        })
        .catch((err) => {
          done.fail('second call to loadScript should not have failed with: ' + err);
        });
      });
    });
    describe('when loading different scripts', function() {
      it('should reject', function(done) {
        loadScript({
          url: jaspi3xUrl
        })
        .catch(() => {
          done.fail('first call to loadScript should not have failed');
        });
        // try loading a different script
        loadScript({
          url: 'base/test/mocks/jsapi4x.js'
        })
        .then(() => {
          done.fail('second call to loadScript should have failed');
        })
        .catch((err) => {
          expect(err.message).toEqual(`The ArcGIS API for JavaScript is already loaded (${jaspi3xUrl}).`);
          done();
        });
      });
    });
    afterEach(function() {
      // clean up
      removeRequire();
      removeScript();
    });
  });
});
