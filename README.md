# esri-loader
A tiny library to help load ArcGIS API for JavaScript modules in non-Dojo applications.

## Usage
The code below shows how you can lazy load the ArcGIS API for JavaScript and then create a map.

```js
// import the esri-loader library
import * as esriLoader from 'esri-loader';

// has the ArcGIS API been added to the page?
if (!esriLoader.isLoaded()) {
  // no, lazy load it the ArcGIS API before using its classes
  esriLoader.bootstrap((err) => {
    if (err) {
      console.error(err);
    }
    // once it's loaded, create the map
    createMap();
  }, {
    // use a specific version instead of latest 4.x
    url: '//js.arcgis.com/3.18/'
  });
} else {
  // ArcGIS API is already loaded, just create the map
  createMap();
}

// create a map on the page
function createMap() {
  // first, we use Dojo's loader to require the map class
  esriLoader.dojoRequire(['esri/map'], ([Map]) => {
    // create map with the given options at a DOM node w/ id 'mapNode' 
    let map = new Map('mapNode', {
      center: [-118, 34.5],
      zoom: 8,
      basemap: 'dark-gray'
    });
  });
}
```

## Examples
Here are some example applications that use this library:
 - https://github.com/tomwayson/esri-angular-cli-example
 - https://github.com/tomwayson/esri-react-router-example
