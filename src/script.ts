/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { loadCss } from './utils/css';
import utils from './utils/index';
import { getCdnUrl } from './utils/url';

let defaultOptions: ILoadScriptOptions = {};

function createScript(url) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.setAttribute('data-esri-loader', 'loading');
  return script;
}

// add a one-time load handler to script
// and optionally add a one time error handler as well
function handleScriptLoad(script, callback, errback?) {
  let onScriptError;
  if (errback) {
    // set up an error handler as well
    onScriptError = handleScriptError(script, errback);
  }
  const onScriptLoad = () => {
    // pass the script to the callback
    callback(script);
    // remove this event listener
    script.removeEventListener('load', onScriptLoad, false);
    if (onScriptError) {
      // remove the error listener as well
      script.removeEventListener('error', onScriptError, false);
    }
  };
  script.addEventListener('load', onScriptLoad, false);
}

// add a one-time error handler to the script
function handleScriptError(script, callback) {
  const onScriptError = (e) => {
    // reject the promise and remove this event listener
    callback(e.error || new Error(`There was an error attempting to load ${script.src}`));
    // remove this event listener
    script.removeEventListener('error', onScriptError, false);
  };
  script.addEventListener('error', onScriptError, false);
  return onScriptError;
}

// interfaces
export interface ILoadScriptOptions {
  version?: string;
  url?: string;
  css?: string | boolean;
  dojoConfig?: { [propName: string]: any };
  insertCssBefore?: string;
}

// allow the user to configure default script options rather than passing options to `loadModules` each time
export function setDefaultOptions(options: ILoadScriptOptions = {}): void {
  defaultOptions = options;
}

// get the script injected by this library
export function getScript() {
  return document.querySelector('script[data-esri-loader]') as HTMLScriptElement;
}
// has ArcGIS API been loaded on the page yet?
export function isLoaded() {
  const globalRequire = window['require'];
  // .on() ensures that it's Dojo's AMD loader
  return globalRequire && globalRequire.on;
}

// load the ArcGIS API on the page
export function loadScript(options: ILoadScriptOptions = {}): Promise<HTMLScriptElement> {
  options = { ...defaultOptions, ...options };

  // URL to load
  const version = options.version;
  const url = options.url || getCdnUrl(version);

  return new utils.Promise((resolve, reject) => {
    let script = getScript();
    if (script) {
      // the API is already loaded or in the process of loading...
      // NOTE: have to test against scr attribute value, not script.src
      // b/c the latter will return the full url for relative paths
      const src = script.getAttribute('src');
      if (src !== url) {
        // potentially trying to load a different version of the API
        reject(new Error(`The ArcGIS API for JavaScript is already loaded (${src}).`));
      } else {
        if (isLoaded()) {
          // the script has already successfully loaded
          resolve(script);
        } else {
          // wait for the script to load and then resolve
          handleScriptLoad(script, resolve, reject);
        }
      }
    } else {
      if (isLoaded()) {
        // the API has been loaded by some other means
        // potentially trying to load a different version of the API
        reject(new Error(`The ArcGIS API for JavaScript is already loaded.`));
      } else {
        // this is the first time attempting to load the API
        const css = options.css;
        if (css) {
          const useVersion = css === true;
          // load the css before loading the script
          loadCss(useVersion ? version : (css as string), options.insertCssBefore);
        }
        if (options.dojoConfig) {
          // set dojo configuration parameters before loading the script
          window['dojoConfig'] = options.dojoConfig;
        }
        // create a script object whose source points to the API
        script = createScript(url);
        // _currentUrl = url;
        // once the script is loaded...
        handleScriptLoad(script, () => {
          // update the status of the script
          script.setAttribute('data-esri-loader', 'loaded');
          // return the script
          resolve(script);
        }, reject);
        // load the script
        document.body.appendChild(script);
      }
    }
  });
}
