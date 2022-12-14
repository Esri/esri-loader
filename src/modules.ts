/* Copyright (c) 2022 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getScript, ILoadScriptOptions, isLoaded, loadScript } from './script';
import utils from './utils/index';

// wrap Dojo's require() in a promise
function requireModules<T extends any[] = any[]>(modules: string[]): Promise<T> {
  return new utils.Promise((resolve, reject) => {
    // If something goes wrong loading the esri/dojo scripts, reject with the error.
    const errorHandler = window['require'].on('error', reject);
    window['require'](modules, (...args) => {
      // remove error handler
      errorHandler.remove();
      // Resolve with the parameters from dojo require as an array.
      resolve(args as T);
    });
  });
}

// returns a promise that resolves with an array of the required modules
// also will attempt to lazy load the API
// if it has not already been loaded
export function loadModules<T extends any[] = any[]>(modules: string[], loadScriptOptions: ILoadScriptOptions = {}): Promise<T> {
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
    return loadScript(loadScriptOptions).then(() => requireModules<T>(modules));
  } else {
    // script is already loaded, just load the modules
    return requireModules(modules);
  }
}
