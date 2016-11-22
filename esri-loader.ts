// has ArcGIS API been loaded on the page yet?
export function isLoaded() {
  // would like to just use window.require, but fucking typescript
  return typeof window['require'] !== 'undefined';
}

// load the ArcGIS API on the page
export function bootstrap(callback: Function, options = <any> {}) {
  // default options
  if (!options.url) {
    options.url = window.location.protocol + '//js.arcgis.com/4.1';
  }

  // don't reload API if it is already loaded
  if (isLoaded()) {
    callback(new Error('The ArcGIS API for JavaScript is already loaded.'));
    return;
  }

  // create a script object whose source points to the API
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = options.url;

  // once the script is loaded...
  script.onload = () => {
    // we can now use Dojo's require() to load esri and dojo AMD modules
    const dojoRequire = window['require'];

    // let the caller know that the API has been successfully loaded
    // and as a convenience, return the require function 
    // in case they want to use it directly
    callback(null, dojoRequire);
  };

  // load the script
  document.body.appendChild(script);
}

// prevent people from getting require undefined error
export function dojoRequire(modules: string[], callback: Function) {
  if (!isLoaded()) {
    throw new Error('The ArcGIS API for JavaScript has not been loaded. You must first call esriLoader.bootstrap()');
  } else {
    window['require'](modules, callback);
  }
}
