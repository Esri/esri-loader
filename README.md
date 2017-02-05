# esri-loader
A tiny library to help load [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/) modules in non-Dojo applications.

## Install
```bash
npm install esri-loader
```

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
    url: 'https://js.arcgis.com/3.18/'
  });
} else {
  // ArcGIS API is already loaded, just create the map
  createMap();
}

// create a map on the page
function createMap() {
  // first, we use Dojo's loader to require the map class
  esriLoader.dojoRequire(['esri/map'], (Map) => {
    // create map with the given options at a DOM node w/ id 'mapNode' 
    let map = new Map('mapNode', {
      center: [-118, 34.5],
      zoom: 8,
      basemap: 'dark-gray'
    });
  });
}
```

## Why is this needed?
[This blog post](http://tomwayson.com/2016/11/27/using-the-arcgis-api-for-javascript-in-applications-built-with-webpack/) explains how libraries like this provide a workaround to the challenges of loading ArcGIS API for JavaScript modules from bundlers like [webpack](http://webpack.github.io/).

## Examples
Here are some applications that use this library:

### Angular
 - [angular2-esri-loader](https://github.com/tomwayson/angular2-esri-loader) - An Angular 2 service that wraps this library to make it easy to bring it into any Angular 2 application
 - [angular2-esri4-components](https://github.com/kgs916/angular2-esri4-components) - A set of Angular 2 components to work with ArcGIS API for JavaScript v4.x

### React
 - [esri-react-router-example](https://github.com/tomwayson/esri-react-router-example) - An example reaact-router application that uses this library to lazy load the ArcGIS API
 - [create-react-app-esri-loader](https://github.com/davetimmins/create-react-app-esri-loader/) - An example create-react-app application that uses this library to load the ArcGIS API
