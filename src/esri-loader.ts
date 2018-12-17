/*
  Copyright 2017 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import { loadCss } from './utils/css';

const isBrowser = typeof window !== 'undefined';
const DEFAULT_URL = 'https://js.arcgis.com/4.10/';
// this is the url that is currently being, or already has loaded
let _currentUrl;

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
  url?: string;
  css?: string;
  dojoConfig?: { [propName: string]: any };
}

// allow consuming libraries to provide their own Promise implementations
export const utils = {
  Promise: isBrowser ? window['Promise'] : undefined
};

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
  // default options
  if (!options.url) {
    options.url = DEFAULT_URL;
  }

  return new utils.Promise((resolve, reject) => {
    let script = getScript();
    if (script) {
      // the API is already loaded or in the process of loading...
      // NOTE: have to test against scr attribute value, not script.src
      // b/c the latter will return the full url for relative paths
      const src = script.getAttribute('src');
      if (src !== options.url) {
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
        if (options.css) {
          // load the css before loading the script
          loadCss(options.css);
        }
        if (options.dojoConfig) {
          // set dojo configuration parameters before loading the script
          window['dojoConfig'] = options.dojoConfig;
        }
        // create a script object whose source points to the API
        script = createScript(options.url);
        _currentUrl = options.url;
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

// wrap dojo's require() in a promise
function requireModules(modules: string[]): Promise<any[]> {
  return new utils.Promise((resolve, reject) => {
    // If something goes wrong loading the esri/dojo scripts, reject with the error.
    const errorHandler = window['require'].on('error', reject);
    window['require'](modules, (...args) => {
      // remove error handler
      errorHandler.remove();
      // Resolve with the parameters from dojo require as an array.
      resolve(args);
    });
  });
}

// returns a promise that resolves with an array of the required modules
// also will attempt to lazy load the ArcGIS API if it has not already been loaded
export function loadModules(modules: string[], loadScriptOptions: ILoadScriptOptions = {}): Promise<any[]> {
  if (!isLoaded()) {
    // script is not yet loaded
    if (!loadScriptOptions.url && _currentUrl) {
      // alredy in the process of loading, so default to the same url
      loadScriptOptions.url = _currentUrl;
    }
    // attept to load the script then load the modules
    return loadScript(loadScriptOptions).then(() => requireModules(modules));
  } else {
    // script is already loaded, just load the modules
    return requireModules(modules);
  }
}

// TODO: import/export getCss too?
export { loadCss } from './utils/css';

// NOTE: rollup ignores the default export
// and builds the UMD namespace out of named exports
// so this is only needed so that consumers of the ESM build
// can do esriLoader.loadModules(), etc
// TODO: remove this next breaking change?
export default {
  getScript,
  isLoaded,
  loadModules,
  loadScript,
  loadCss,
  // TODO: export getCss too?
  utils
};
