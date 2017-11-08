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

const DEFAULT_URL = 'https://js.arcgis.com/4.5/';

// get the script injected by this library
function getScript() {
  return document.querySelector('script[data-esri-loader]') as HTMLScriptElement;
}

// TODO: at next breaking change replace the public isLoaded() API with this
function _isLoaded() {
  // TODO: instead of checking that require is defined, should this check if it is a function?
  return typeof window['require'] !== 'undefined';
}

function createScript(url) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  // TODO: remove this if no longer needed
  script.dataset['esriLoader'] = 'loading';
  return script;
}

// add a one-time load handler to script
function handleScriptLoad(script, callback) {
  const onScriptLoad = () => {
    // pass the script to the callback
    callback(script);
    // remove this event listener
    script.removeEventListener('load', onScriptLoad, false);
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
}

// interfaces
// TODO: remove this next breaking change
// it has been replaced by ILoadScriptOptions
export interface IBootstrapOptions {
  url?: string;
  dojoConfig?: { [propName: string]: any };
}

export interface ILoadScriptOptions {
  url?: string;
  // NOTE: stole the type definition for dojoConfig from:
  // https://github.com/nicksenger/esri-promise/blob/38834f22ffb3f70da3f57cce3773d168be990b0b/index.ts#L18
  // I assume it defines an object w/ an unknown number of prpoerties of type any
  dojoConfig?: { [propName: string]: any };
}

// has ArcGIS API been loaded on the page yet?
export function isLoaded() {
  return _isLoaded() && getScript();
}

// load the ArcGIS API on the page
export function loadScript(options: ILoadScriptOptions = {}): Promise<HTMLScriptElement> {
  // default options
  if (!options.url) {
    options.url = DEFAULT_URL;
  }

  return new Promise((resolve, reject) => {
    let script = getScript();
    if (script) {
      // the API is already loaded or in the process of loading...
      // NOTE: have to test against scr attribute value, not script.src
      // b/c the latter will return the full url for relative paths
      const src = script.getAttribute('src');
      if (src !== options.url) {
        // potentailly trying to load a different version of the API
        reject(new Error(`The ArcGIS API for JavaScript is already loaded (${src}).`));
      } else {
        if (_isLoaded()) {
          // the script has already successfully loaded
          resolve(script);
        } else {
          // wait for the script to load and then resolve
          handleScriptLoad(script, resolve);
          // handle script loading errors
          handleScriptError(script, reject);
        }
      }
    } else {
      if (_isLoaded()) {
        // the API has been loaded by some other means
        // potentailly trying to load a different version of the API
        reject(new Error(`The ArcGIS API for JavaScript is already loaded.`));
      } else {
        // this is the first time attempting to load the API
        if (options.dojoConfig) {
          // set dojo configuration parameters before loading the script
          window['dojoConfig'] = options.dojoConfig;
        }
        // create a script object whose source points to the API
        script = createScript(options.url);
        // once the script is loaded...
        // TODO: once we no longer need to update the dataset, replace this w/
        // handleScriptLoad(script, resolve);
        handleScriptLoad(script, () => {
          // update the status of the script
          script.dataset['esriLoader'] = 'loaded';
          // return the script
          resolve(script);
        });
        // handle script loading errors
        handleScriptError(script, reject);
        // load the script
        document.body.appendChild(script);
      }
    }
  });
}

// wrap dojo's require() in a promise
function requireModules(modules: string[]): Promise<any[]> {
  return new Promise((resolve, reject) => {
    // If something goes wrong loading the esri/dojo scripts, reject with the error.
    window['require'].on('error', reject);
    window['require'](modules, (...args) => {
      // Resolve with the parameters from dojo require as an array.
      resolve(args);
    });
  });
}

// returns a promise that resolves with an array of the required modules
// also will attempt to lazy load the ArcGIS API if it has not already been loaded
export function loadModules(modules: string[], loadScriptOptions?: ILoadScriptOptions): Promise<any[]> {
  if (!_isLoaded()) {
    // script is not yet loaded, attept to load it then load the modules
    return loadScript(loadScriptOptions).then(() => requireModules(modules));
  } else {
    // script is already loaded, just load the modules
    return requireModules(modules);
  }
}

// TODO: remove this next major release
export function bootstrap(callback?: (error: Error, dojoRequire?: any) => void, options: IBootstrapOptions = {}) {
  console.warn('bootstrap() has been depricated and will be removed the next major release. Use loadScript() instead.');
  // default options
  if (!options.url) {
    options.url = DEFAULT_URL;
  }

  // don't reload API if it is already loaded or in the process of loading
  if (getScript()) {
    if (callback) {
      callback(new Error('The ArcGIS API for JavaScript is already loaded.'));
    }
    return;
  }

  if (options.dojoConfig) {
    // set dojo configuration parameters before loading the script
    window['dojoConfig'] = options.dojoConfig;
  }

  // create a script object whose source points to the API
  const script = createScript(options.url);

  // once the script is loaded...
  script.onload = () => {
    // update the status of the script
    script.dataset['esriLoader'] = 'loaded';

    // we can now use Dojo's require() to load esri and dojo AMD modules
    const _dojoRequire = window['require'];

    if (callback) {
      // let the caller know that the API has been successfully loaded
      // and as a convenience, return the require function
      // in case they want to use it directly
      callback(null, _dojoRequire);
    }
  };

  if (callback) {
    // handle any script loading errors
    handleScriptError(script, callback);
  }

  // load the script
  document.body.appendChild(script);
}

// TODO: remove this next major release
export function dojoRequire(modules: string[], callback: (...modules: any[]) => void) {
  /* tslint:disable max-line-length */
  console.warn('dojoRequire() has been depricated and will be removed the next major release. Use loadModules() instead.');
  /* tslint:enable max-line-length */
  if (isLoaded()) {
    // already loaded, just call require
    window['require'](modules, callback);
  } else {
    // wait for script to load then call require
    const script = getScript();
    if (script) {
      // Not yet loaded but script is in the body - use callback once loaded
      handleScriptLoad(script, () => {
        window['require'](modules, callback);
      });
    } else {
      // Not bootstrapped
      throw new Error('The ArcGIS API for JavaScript has not been loaded. You must first call esriLoader.bootstrap()');
    }
  }
}

// export a namespace to expose all functions
export default {
  isLoaded,
  loadScript,
  // TODO: remove these the next major release
  bootstrap,
  dojoRequire
};
