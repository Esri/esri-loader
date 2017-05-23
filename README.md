# esri-loader
A tiny library to help load [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/) modules in non-Dojo applications.

See below for more information on [why this library is needed](#why-is-this-needed) and how it can help improve application load performance.

If you want to use the ArcGIS API in an [Angular](#angular), [Ember](#ember), or [React](#react) application, you can use one of these framework specific wrappers:
 - [angular2-esri-loader](https://github.com/tomwayson/angular2-esri-loader) - An Angular service that wraps this library to make it easy to bring it into any Angular (2+) application.
 - [ember-esri-loader](https://github.com/Esri/ember-esri-loader) - An Ember addon to allow lazy loading the ArcGIS API for JavaScript in Ember applications
 - [esri-loader-react](https://github.com/davetimmins/esri-loader-react) - A React component wrapper around esri-loader

Otherwise you'll want to follow the [Install](#install) and [Usage](#usage) instructions below to use this library directly in your application.

See the [Examples](#examples) section below for links to applications that use the above wrappers and/or this library directly.

**NOTE**: For Angular 1, use [angular-esri-map](https://github.com/Esri/angular-esri-map), which is actually where the code in this library was originally extracted from.

## Install
```bash
npm install esri-loader
```

## Usage
The code below shows how you can load the ArcGIS API for JavaScript and then create a map. Where you place this code in your application will depend on what framework you are using. See below for [example applications](#examples).

### Loading Styles

Before you can use the ArcGIS API in your app, you'll need to load the styles, for example:

```css
/* esri styles */
@import url('https://js.arcgis.com/3.20/esri/css/esri.css');
```

### Pre-loading the ArcGIS API for JavaScript

If you have good reason to believe that the user is going to transition to a map route, you may want to start pre-loading the ArcGIS API as soon as possible w/o blocking rendering, for example:

```js
import * as esriLoader from 'esri-loader';

// preload the ArcGIS API
esriLoader.bootstrap((err) => {
  if (err) {
    // handle any loading errors
    console.error(err);
  } else {
    // optionall execute any code once it's preloaded
  }
}, {
  // use a specific version instead of latest 4.x
  url: '//js.arcgis.com/3.20/';
});
```

### Lazy Loading the ArcGIS API for JavaScript

Alternatively, if users may never end up visiting any map routes, you can lazy load the ArcGIS API for JavaScript the first time a user visits a route with a map, for example:

```js
// import the esri-loader library
import * as esriLoader from 'esri-loader';

// has the ArcGIS API been added to the page?
if (!esriLoader.isLoaded()) {
  // no, lazy load it the ArcGIS API before using its classes
  esriLoader.bootstrap((err) => {
    if (err) {
      console.error(err);
    } else {
      // once it's loaded, create the map
      createMap();
    }
  }, {
    // use a specific version instead of latest 4.x
    url: 'https://js.arcgis.com/3.20/'
  });
} else {
  // ArcGIS API is already loaded, just create the map
  createMap();
}
```

### Loading Modules from the ArcGIS API for JavaScript

Once you've loaded the API using one of the above methods, you can then load modules. Here's an example of how you could load and use the 3.x `Map` and `VectorTileLayer` classes in a component to create a map:

```js
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

### Using your own script tag

It is possible to use this library only to load modules (i.e. not to pre-load or lazy load the ArcGIS API), then you will need to add a `data-esri-loader` attribute to the script tag you use to load the ArcGIS API for JavaScript. Example:

```html
<!-- index.html -->
<script src="https://js.arcgis.com/3.20/" data-esri-loader="loaded"></script>
```

## Why is this needed?

Unfortunately, you can't simply `npm install` the ArcGIS API and then `import` ArcGIS modules directly from the modules in a non-Dojo application. The only reliable way to load ArcGIS API for JavaScript modules is using the Dojo's AMD loader. When using the ArcGIS API in an application built with another framework, you typically want to use the tooling and conventions of that framework instead of the Dojo build system. This library let's you do that by provding a module that you can `import` and use to dynamically inject an ArcGIS API script tag in the page and then use it's Dojo loader to load only the ArcGIS API modules as needed.

[This blog post](http://tomwayson.com/2016/11/27/using-the-arcgis-api-for-javascript-in-applications-built-with-webpack/) explains in more detail how libraries like this provide a workaround to the challenges of loading ArcGIS API for JavaScript modules from bundlers like [webpack](http://webpack.github.io/).

In addition to solving the above challenges, this library can also help improve the performance of initial application load (always an challenge in web mapping applications) by enabling you to load the ArcGIS API and it's modules only as they are needed. You can [pre-load the API](#pre-loading-the-arcgis-api-for-javascript) without blocking rendering, or [lazy load the API and modules](#lazy-loading-the-arcgis-api-for-javascript) only on routes that require them to render a map.

## Examples

![Diagram of framework specfic wrappers of this library and applications that use this library](https://docs.google.com/drawings/d/1we3VFggV78jlUMyaM9eg-YsJlT5J2FfyDcfe6CyMA0k/pub?w=1064&h=581)

Here are some applications that use this library (presented by framework in alphabetical order - not picking any favories here :stuck_out_tongue_winking_eye:):

### [Angular](https://angular.io/)
- [esri-angular-cli-example](https://github.com/tomwayson/esri-angular-cli-example) - Example of how to to use the ArcGIS API for JavaScript in an Angular CLI app, which uses [angular-esri-loader](https://github.com/tomwayson/angular-esri-loader) by way of [angular2-esri4-components](https://github.com/kgs916/angular2-esri4-components)

### [Electron](https://electron.atom.io/)
- [ng-cli-electron-esri](https://github.com/TheKeithStewart/ng-cli-electron-esri) - This project is meant to demponstrate how to run a mapping application using the ArcGIS API for JavaScript inside of Electron.

### [Ember](https://www.emberjs.com/)
- [ember-esri-loader Dummy App](http://ember-esri-loader.surge.sh/) - The dummy application for the ember-esri-loader addon

### [Glimmer.js](https://glimmerjs.com/)
 - [esri-glimmer-example](https://github.com/tomwayson/esri-glimmer-example) - An example of how to use the ArcGIS API for JavaScript in a https://glimmerjs.com/ application
 
### [Preact](https://github.com/developit/preact)
- [esri-preact-pwa](https://github.com/tomwayson/esri-preact-pwa) - An example progressive web app (PWA) using the ArcGIS API for JavaScript built with Preact

### [React](https://facebook.github.io/react/)
- [esri-react-router-example](https://github.com/tomwayson/esri-react-router-example) - An example reaact-router application that uses [esri-loader-react](https://github.com/davetimmins/esri-loader-react) to preload the ArcGIS API
 - [create-react-app-esri-loader](https://github.com/davetimmins/create-react-app-esri-loader/) - An example create-react-app application that uses [esri-loader-react](https://github.com/davetimmins/esri-loader-react) to load the ArcGIS API

### [Vue.js](https://vuejs.org/)
- [City of Baltimore: Map Gallery](https://github.com/oppoudel/MapGallery_Vue) - Map Gallery built with Vue.js that uses this library to load the ArcGIS API
