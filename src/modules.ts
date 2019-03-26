/*
  Copyright 2019 Esri
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
import { getScript, ILoadScriptOptions, isLoaded, loadScript } from './script';
import utils from './utils/index';

// wrap Dojo's require() in a promise
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
    // script is not yet loaded, is it in the process of loading?
    const script = getScript();
    const src = script && script.getAttribute('src');
    if (!loadScriptOptions.url && src) {
      // script is still loading and user did not specify a URL
      // in this case we want to default to the URL that's being loaded
      // instead of defaulting to the latest 4.x URL
      loadScriptOptions.url = src;
    }
    // attempt to load the script then load the modules
    return loadScript(loadScriptOptions).then(() => requireModules(modules));
  } else {
    // script is already loaded, just load the modules
    return requireModules(modules);
  }
}
