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

// get the script injected by this library
function getScript () {
  return document.querySelector('script[data-esri-loader]');
}

// has ArcGIS API been loaded on the page yet?
export function isLoaded() {
  // would like to just use window.require, but fucking typescript
  return typeof window['require'] !== 'undefined' && getScript();
}

// load the ArcGIS API on the page
export function bootstrap(callback: Function, options = {} as any) {
  // default options
  if (!options.url) {
    options.url = 'https://js.arcgis.com/4.5/';
  }

  // don't reload API if it is already loaded or in the process of loading
  if (getScript()) {
    callback(new Error('The ArcGIS API for JavaScript is already loaded.'));
    return;
  }

  // create a script object whose source points to the API
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = options.url;
  script.dataset['esriLoader'] = 'loading';

  // once the script is loaded...
  script.onload = () => {
    // update the status of the script
    script.dataset['esriLoader'] = 'loaded';

    // we can now use Dojo's require() to load esri and dojo AMD modules
    const dojoRequire = window['require'];

    if (callback) {
      // let the caller know that the API has been successfully loaded
      // and as a convenience, return the require function
      // in case they want to use it directly
      callback(null, dojoRequire);
    }
  };

  // load the script
  document.body.appendChild(script);
}

export function dojoRequire(modules: string[], callback: Function) {
  if (isLoaded()) {
    window['require'](modules, callback);
  } else {
    const script = getScript();
    if (script) {
      // Not yet loaded but script is in the body - use callback once loaded
      const onScriptLoad = () => {
        window['require'](modules, callback);
        script.removeEventListener('load', onScriptLoad, false);
      };
      script.addEventListener('load', onScriptLoad);
    } else {
      // Not bootstrapped
      throw new Error('The ArcGIS API for JavaScript has not been loaded. You must first call esriLoader.bootstrap()');
    }
  }
}

export default {
  isLoaded,
  bootstrap,
  dojoRequire
}
