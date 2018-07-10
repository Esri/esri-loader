# esri-loader

[![Travis](https://img.shields.io/travis/Esri/esri-loader.svg)](https://travis-ci.org/Esri/esri-loader/builds/) [![npm](https://img.shields.io/npm/v/esri-loader.svg)](https://github.com/Esri/esri-loader/releases) [![npm](https://img.shields.io/npm/dw/esri-loader.svg)](https://www.npmjs.com/package/esri-loader) [![npm](https://img.shields.io/npm/l/esri-loader.svg)](https://github.com/Esri/esri-loader/blob/master/LICENSE) [![GitHub stars](https://img.shields.io/github/stars/esri/esri-loader.svg?style=social&label=Stars)](https://github.com/Esri/esri-loader/stargazers)

A tiny library to help load modules from either the [4.x](https://developers.arcgis.com/javascript/) or [3.x](https://developers.arcgis.com/javascript/3/) versions of the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/) in non-Dojo applications.

![ArcGIS logo, mended broken heart, Angular logo, Ember logo, Rreact logo, Vue logo](https://docs.google.com/drawings/d/e/2PACX-1vSUEfgaupMLz6FXBX65X-nm7cqA0r9ed3rJ_KNISeqzwDDkd8LsubLhQ_hCWwO3zjS41cD5eG7QUBHl/pub?w=888&h=222)

See below for more information on [why this library is needed](#why-is-this-needed) and how it can help improve application load performance and allow using the ArcGIS API in isomorphic/universal applications.

**NOTE**: If you want to use the ArcGIS API in an [Ember](#ember) or [AngularJS](https://angularjs.org/) (1.x) application, you should use one of these libraries instead:
 - [ember-esri-loader](https://github.com/Esri/ember-esri-loader) - An Ember addon that wraps this library
 - [angular-esri-map](https://github.com/Esri/angular-esri-map), which is actually where the code in this library was originally extracted from

Otherwise you'll want to follow the [Install](#install) and [Usage](#usage) instructions below to use this library directly in your application.

See the [Examples](#examples) section below for links to applications that use this library.

## Install
```bash
npm install --save esri-loader
```
or

```bash
yarn add esri-loader
```

## Usage
The code snippets below show how to load the ArcGIS API and its modules and then use them to create a map. Where you would place similar code in your application will depend on which application framework you are using. See below for [example applications](#examples).

### Loading Styles

Before you can use the ArcGIS API in your app, you'll need to load the styles that correspond to the version you are using. You can use the provided `loadCss(url)` function. For example:

```js
// load esri styles for version 4.8 using loadCss
esriLoader.loadCss('https://js.arcgis.com/4.8/esri/css/main.css');
```

Alternatively, you can manually load them by more traditional means such as adding `<link>` tags to your HTML, or `@import` statements to your CSS. For example:

```html
<!-- load esri styles for version 4.8 via a link tag -->
<link rel="stylesheet" href="https://js.arcgis.com/4.8/esri/css/main.css">
@import url('https://js.arcgis.com/4.8/esri/css/main.css');
```

or:

```css
/* load esri styles for version 3.25 via import */
@import url('https://js.arcgis.com/3.25/esri/css/esri.css');
```

### Loading Modules from the ArcGIS API for JavaScript

Here's an example of how you could load and use the 4.x `Map` and `MapView` classes in a component to create a map (based on [this sample](https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=webmap-basic)):

```js
// first, we use Dojo's loader to require the map class
esriLoader.loadModules(['esri/views/MapView', 'esri/WebMap'])
.then(([MapView, WebMap]) => {
  // then we load a web map from an id
  var webmap = new WebMap({
    portalItem: { // autocasts as new PortalItem()
      id: 'f2e9b762544945f390ca4ac3671cfa72'
    }
  });
  // and we show that map in a container w/ id #viewDiv
  var view = new MapView({
    map: webmap,
    container: 'viewDiv'
  });
})
.catch(err => {
  // handle any errors
  console.error(err);
});
```

#### Lazy Loading the ArcGIS API for JavaScript

In the above snippet, the first time `loadModules()` is called, it will attempt to lazy load the most recent 4.x version of the ArcGIS API if it has not already been loaded by calling `loadScript()` for you. Subsequent calls to `loadModules()` will not attempt to load the script once `loadScript()` has been called.

If you don't want to use the latest version of the ArcGIS API hosted on Esri's CDN, you'll need to pass options with the URL to whichever version you want to use. For example, the snippet below uses v3.x of the ArcGIS API to create a map.

```js
// if the API hasn't already been loaded (i.e. the frist time this is run)
// loadModules() will call loadScript() and pass these options, which, 
// in this case are only needed b/c we're using v3.x instead of the latest 4.x
const options = {
  url: 'https://js.arcgis.com/3.25/'
};
esriLoader.loadModules(['esri/map'], options)
.then(([Map]) => {
  // create map with the given options at a DOM node w/ id 'mapNode'
  let map = new Map('mapNode', {
    center: [-118, 34.5],
    zoom: 8,
    basemap: 'dark-gray'
  });
})
.catch(err => {
  // handle any script or module loading errors
  console.error(err);
});
```

Lazy loading the API is a useful pattern if your users may never end up visiting any routes that need the API (i.e. show a map or 3D scene).

See the [Advanced Usage](#advanced-usage) section below for more advanced techniques such as [pre-loading the ArcGIS API](#pre-loading-the-arcgis-api-for-javascript), [using in isomorphic/universal applications](#isomorphicuniversal-applications), [configuring Dojo](#configuring-dojo), and more.

## Why is this needed?

Unfortunately, you can't simply `npm install` the ArcGIS API and then `import` ArcGIS modules directly from other modules in a non-Dojo application. The only reliable way to load ArcGIS API for JavaScript modules is using Dojo's AMD loader. However, when using the ArcGIS API in an application built with another framework, you typically want to use the tooling and conventions of that framework rather than the Dojo build system. This library lets you do that by providing an ES module that you can `import` and use to dynamically inject an ArcGIS API script tag in the page and then use its Dojo loader to load only the ArcGIS API modules as needed.

There are a few different solutions to this problem, but [this blog post](http://tomwayson.com/2018/01/05/loader-of-the-things-one-library-to-load-them-all/) explains why you should be using esri-loader if your ArcGIS web application uses _any_ other module loader besides the Dojo loader (i.e. [webpack](http://webpack.github.io/), [rollup.js](https://rollupjs.org/), etc.). Using esri-loader enables you to:

<ul>
 	<li>Improve initial load performance, especially on mobile</li>
 	<li><a href="#isomorphicuniversal-applications">Use the ArcGIS API in isomorphic/universal (server-rendered) applications</a></li>
 	<li>Use the ArcGIS API with <a href="#examples">whatever cli or boilerplate your team prefers</a></li>
 	<li>Avoid having to load the ArcGIS API just to run your unit tests</li>
</ul>

This is because esri-loader let's you control when the ArcGIS API and its modules are loaded and used. You can [lazy load the API and modules](#lazy-loading-the-arcgis-api-for-javascript) only on routes that require them to render a map, or you can [pre-load the API](#pre-loading-the-arcgis-api-for-javascript) without blocking rendering. You can [ensure the API and its modules are not loaded/used when rendering on the server](#isomorphicuniversal-applications) where they will cause errors.

## Examples

Here are some applications and framework-specific wrapper libraries that use this library. We don't gurantee that these examples are current, so check the version of esri-loader their commit history before using them as a reference. They are presented by framework in alphabetical order - not picking any favories here :stuck_out_tongue_winking_eye::

### [Angular](https://angular.io/)

#### Reusable libraries for Angular
- [angular-esri-components](https://github.com/TheKeithStewart/angular-esri-components) - A set of Angular components to work with ArcGIS API for JavaScript v4.3

#### Example Angular applications
- [angular-cli-esri-map](https://github.com/Esri/angular-cli-esri-map) - Example of how to build a simple mapping component using Angular CLI.

### [CanJS](https://canjs.com/)
- [can-arcgis](https://github.com/roemhildtg/can-arcgis) - CanJS configureable mapping app (inspired by [cmv-app](https://github.com/cmv/cmv-app)) and components built for the ArcGIS JS API 4.x, bundled with [StealJS](https://stealjs.com/)

### [Choo](https://choo.io/)
- [esri-choo-example](https://github.com/jwasilgeo/esri-choo-example) - An example Choo application that shows how to use esri-loader to create a custom map view.

### [Electron](https://electron.atom.io/)
- [ng-cli-electron-esri](https://github.com/TheKeithStewart/ng-cli-electron-esri) - This project is meant to demonstrate how to run a mapping application using the ArcGIS API for JavaScript inside of Electron

### [Ember](https://www.emberjs.com/)
See the [examples over at ember-esri-loader](https://github.com/Esri/ember-esri-loader/#examples)

### [Glimmer.js](https://glimmerjs.com/)
 - [esri-glimmer-example](https://github.com/tomwayson/esri-glimmer-example) - An example of how to use the ArcGIS API for JavaScript in a https://glimmerjs.com/ application

### [Hyperapp](https://hyperapp.js.org/)
 - [esri-hyperapp-example](https://github.com/jwasilgeo/esri-hyperapp-example) - An example Hyperapp application that shows how to use esri-loader to create a custom map view and component.

### [Ionic](https://ionicframework.com/)
- [ionic2-esri-map](https://github.com/andygup/ionic2-esri-map) - Prototype app demonstrating how to use Ionic 3+ with the ArcGIS API for JavaScript
 
### [Preact](https://github.com/developit/preact)
- [esri-preact-pwa](https://github.com/tomwayson/esri-preact-pwa) - An example progressive web app (PWA) using the ArcGIS API for JavaScript built with Preact

### [React](https://facebook.github.io/react/)

#### Reusable libraries for React
- [esri-loader-react](https://github.com/davetimmins/esri-loader-react) - A React component wrapper around esri-loader ([blog post](https://davetimmins.github.io/2017/07/19/esri-loader-react/))
- [react-arcgis](https://github.com/nicksenger/react-arcgis) - React component kit for Esri ArcGIS JS API
- [arcgis-react-redux-legend](https://github.com/davetimmins/arcgis-react-redux-legend) - Legend control for ArcGIS JS v4 using React and Redux

#### Example React applications
- [esri-loader-react-starter-kit](https://github.com/tomwayson/esri-loader-react-starter-kit) - A fork of the [react-starter-kit](https://github.com/kriasoft/react-starter-kit) showing how to use esri-loader in an isomorphic/universal React application
- [esri-react-router-example](https://github.com/tomwayson/esri-react-router-example) - An example react-router application that uses [esri-loader-react](https://github.com/davetimmins/esri-loader-react) to preload the ArcGIS API
 - [create-react-app-esri-loader](https://github.com/davetimmins/create-react-app-esri-loader/) - An example create-react-app application that uses [esri-loader-react](https://github.com/davetimmins/esri-loader-react) to load the ArcGIS API
- [React-Typescript-App-with-ArcGIS-JSAPI](https://github.com/guzhongren/React-Typescript-App-with-ArcGIS-JSAPI) - An example create-react-app application that uses[esri-loader](https://github.com/Esri/esri-loader) ,[esri-loader-react](https://github.com/davetimmins/esri-loader-react),[Typescript](http://www.typescriptlang.org/),[Webpack3](https://webpack.js.org/) to create MapView

### [Riot](http://riotjs.com/)
- [esri-riot-example](https://github.com/jwasilgeo/esri-riot-example) - An example Riot application that shows how to use esri-loader to create a custom `<esri-map-view>` component.

### [Stencil](https://stenciljs.com/)
- [esri-stencil-example](https://github.com/Dzeneralen/esri-stencil-example) - An example Stencil application that shows how to use esri-loader to create a custom map view component and implement some basic routing controlling the map state

### [Vue.js](https://vuejs.org/)
- [CreateMap](https://github.com/oppoudel/CreateMap) - Create Map: City of Baltimore - https://gis.baltimorecity.gov/createmap/#/
- [City of Baltimore: Map Gallery](https://github.com/oppoudel/MapGallery_Vue) - Map Gallery built with Vue.js that uses this library to load the ArcGIS API
- [vue-jsapi4](https://github.com/odoe/vue-jsapi4) - An example of how to use the [ArcGIS API for Javascript](https://developers.arcgis.com/javascript/) in a [NUXT](https://nuxtjs.org/) application ([blog post](http://odoe.net/blog/arcgis-api-4-for-js-with-vue-cli-and-nuxt/), [video](https://youtu.be/hqJzzgM8seo))
- [esri-vue-cli-example](https://github.com/tomwayson/esri-vue-cli-example) - An example of how to use the [ArcGIS API for JavaScript 3.x](https://developers.arcgis.com/javascript/3/) in a [vue-cli](https://github.com/vuejs/vue-cli) application

## Advanced Usage

### Pre-loading the ArcGIS API for JavaScript

If you have good reason to believe that the user is going to transition to a map route, you may want to start pre-loading the ArcGIS API as soon as possible w/o blocking rendering, for example:

```js
// preload the ArcGIS API
// NOTE: in this case, we're not passing any options to loadScript()
// so it will default to loading the latest 4.x version of the API from the CDN
this.loadScriptPromise = esriLoader.loadScript();

// later, for example once a component has been rendered,
// you can wait for the above promise to resolve (if it hasn't already)
this.loadScriptPromise
.then(() => {
  // you can now load the map modules and create the map
})
.catch(err => {
  // handle any script loading errors
  console.error(err);
});
```

### Isomorphic/universal applications

This library also allows you to use the ArcGIS API in [isomorphic or universal](https://medium.com/airbnb-engineering/isomorphic-javascript-the-future-of-web-apps-10882b7a2ebc#.4nyzv6jea) applications that are rendered on the server. There's really no difference in how you invoke the functions exposed by this libary, however you should avoid trying to call them from any code that runs on the server. The easiest way to do this is to use them in component lifecyle hooks that are only invoked in a browser, for example, React's [`componentDidMount`](https://reactjs.org/docs/react-component.html#componentdidmount) or Vue's [mounted](https://vuejs.org/v2/api/#mounted). See [tomwayson/esri-loader-react-starter-kit](https://github.com/tomwayson/esri-loader-react-starter-kit/) for [an example of a component that lazy loads the ArcGIS API and renders a map only once a specific route is loaded in a browser](https://github.com/tomwayson/esri-loader-react-starter-kit/commit/a513b7fe207a809105fcb621a26a687cc47918b4).

Alternatively, you could use checks like the following to ensure these functions aren't invoked on the server:

```js
if (typeof window !== 'undefined') {
  // this is running in a browser, 
  // pre-load the ArcGIS API for later use in components
  this.loadScriptPromise = esriLoader.loadScript();
}
```

### Configuring Dojo

You can pass a [`dojoConfig`](https://dojotoolkit.org/documentation/tutorials/1.10/dojo_config/) option to `loadScript()` or `loadModules()` to configure Dojo before the script tag is loaded. This is useful if you want to use esri-loader to load Dojo packages that are not included in the ArcGIS API for JavaScript such as [FlareClusterLayer](https://github.com/nickcam/FlareClusterLayer).

```js
// in this case options are only needed so we can configure dojo before loading the API
const options = {
  // tell Dojo where to load other packages
  dojoConfig: {
    async: true,
    packages: [
      {
        location: '/path/to/fcl',
        name: 'fcl'
      }
    ]
  }
};
esriLoader.loadModules(['esri/map', 'fcl/FlareClusterLayer_v3'], options)
.then(([Map, FlareClusterLayer]) => {
  // you can now create a new FlareClusterLayer and add it to a new Map
})
.catch(err => {
  // handle any errors
  console.error(err);
});
```

### Using your own script tag

It is possible to use this library only to load modules (i.e. not to pre-load or lazy load the ArcGIS API). In this case you will need to add a `data-esri-loader` attribute to the script tag you use to load the ArcGIS API for JavaScript. Example:

```html
<!-- index.html -->
<script src="https://js.arcgis.com/3.25/" data-esri-loader="loaded"></script>
```

### ArcGIS Types
This library doesn't make any assumptions about which version of the ArcGIS API you are using, so you will have to manually install the appropriate types.

#### 4.x Types
Follow [these instructions](https://github.com/Esri/jsapi-resources/tree/master/4.x/typescript) to install the 4.x types.

NOTE: For Angular CLI applications, you will also need to add "arcgis-js-api" to `compilerOptions.types` in src/tsconfig.app.json and src/tsconfig.spec.json [as shown here](https://gist.github.com/tomwayson/e6260adfd56c2529313936528b8adacd#adding-the-arcgis-api-for-javascript-types).

Then you can use the `__esri` namespace for the types as seen in [this example](https://github.com/kgs916/angular2-esri4-components/blob/68861b286fd3a4814c495c2bd723e336e917ced2/src/lib/esri4-map/esri4-map.component.ts#L20-L26).

#### 3.x Types
Unfortunately the `__esri` namespace is not defined for 3.x types. You can use [these instructions](https://github.com/Esri/jsapi-resources/tree/master/3.x/typescript) to install the 3.x types, but then [you will still need to use `import` statements to get the types](https://github.com/Esri/jsapi-resources/issues/60). This may cause build errors that may or may not result in actual runtime errors depending on your environment.

### Updating from previous versions

#### From &lt; v1.5

If you have an application using a version that is less than v1.5, [this commit](https://github.com/odoe/vue-jsapi4/pull/1/commits/4cb6413c0ea31fdd09e94f3a0ce0d1669a9fd5ad) shows the kinds of changes you'll need to make. In most cases, you should be able to replace a series of calls to `isLoaded()`, `bootstrap()`, and `dojoRequire()` with a single call to `loadModules()`.

#### From angular-esri-loader

The angular-esri-loader wrapper library is no longer needed and has been deprecated in favor of using esri-loader directly. See [this issue](https://github.com/Esri/esri-loader/issues/75) for suggestions on how to replace angular-esri-loader with the latest version of esri-loader.

## Dependencies

### Browsers

This library doesn't have any external dependencies, but the functions it exposes to load the ArcGIS API and its modules expect to be run in a browser. This library officially supports [the same browers that are supported by the latest version of the ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/latest/guide/system-requirements/index.html#supported-browsers). Since this library also works with [v3.x of the ArcGIS API](https://developers.arcgis.com/javascript/3/), the community [has made some effort](https://github.com/Esri/esri-loader/pull/67) to get it to work with [some of the older browsers supported by 3.x](https://developers.arcgis.com/javascript/3/jshelp/supported_browsers.html) like IE < 11.

You cannot run the ArcGIS API for JavaScript in [Node.js](https://nodejs.org/), but you _can_ use this library in [isomorphic/universal applications](#isomorphicuniversal-applications) as well as [Electron](#electron). If you need to exectue requests to ArcGIS REST services from something like a Node.js CLI application, see [arcgis-rest-js](https://github.com/Esri/arcgis-rest-js).

### Promises

Since v1.5 asynchronous functions like `loadScript()` and `loadModules()` return [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)s, so if your application has to support [browers that don't support Promise (i.e. IE)](https://caniuse.com/#search=promise) you have a few options.

If there's already a Promise implementation loaded on the page you can configure esri-loader to use that implementation. For example, in [ember-esri-loader](https://github.com/Esri/ember-esri-loader), we configure esri-loader to use the RSVP Promise implementation included with Ember.js.

```js
  init () {
    this._super(...arguments);
    // have esriLoader use Ember's RSVP promise
    esriLoader.utils.Promise = Ember.RSVP.Promise;
  },
```

Otherwise, you should consider using a [Promise polyfill](https://www.google.com/search?q=promise+polyfill), ideally [only when needed](https://philipwalton.com/articles/loading-polyfills-only-when-needed/).

## Issues

Find a bug or want to request a new feature?  Please let us know by [submitting an issue](https://github.com/Esri/esri-loader/issues/).

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing
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

A copy of the license is available in the repository's [LICENSE]( ./LICENSE) file.
