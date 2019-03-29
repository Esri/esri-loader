# esri-loader

[![Travis](https://img.shields.io/travis/Esri/esri-loader.svg)](https://travis-ci.org/Esri/esri-loader/builds/) [![npm](https://img.shields.io/npm/v/esri-loader.svg)](https://github.com/Esri/esri-loader/releases) [![npm](https://img.shields.io/npm/dw/esri-loader.svg)](https://www.npmjs.com/package/esri-loader) [![npm](https://img.shields.io/npm/l/esri-loader.svg)](https://github.com/Esri/esri-loader/blob/master/LICENSE) [![GitHub stars](https://img.shields.io/github/stars/esri/esri-loader.svg?style=social&label=Stars)](https://github.com/Esri/esri-loader/stargazers)

A tiny library to help load modules from either the [4.x](https://developers.arcgis.com/javascript/) or [3.x](https://developers.arcgis.com/javascript/3/) versions of the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/) in non-Dojo applications.

![ArcGIS logo, mended broken heart, Angular logo, Ember logo, React logo, Vue logo](https://docs.google.com/drawings/d/e/2PACX-1vSUEfgaupMLz6FXBX65X-nm7cqA0r9ed3rJ_KNISeqzwDDkd8LsubLhQ_hCWwO3zjS41cD5eG7QUBHl/pub?w=888&h=222)

See below for more information on [why this library is needed](#why-is-this-needed) and how it can help improve application load performance and allow [using the ArcGIS API in isomorphic/universal applications](#isomorphicuniversal-applications).

**NOTE**: If you want to use the ArcGIS API in an [Ember](#ember) or [AngularJS](https://angularjs.org/) (1.x) application, you should use one of these libraries instead:

- [ember-esri-loader](https://github.com/Esri/ember-esri-loader) - An Ember addon that wraps this library
- [angular-esri-map](https://github.com/Esri/angular-esri-map), which is actually where the code in this library was originally extracted from

Otherwise you'll want to follow the [Install](#install) and [Usage](#usage) instructions below to use this library directly in your application.

See the [Examples](#examples) section below for links to applications that use this library.

## Table of Contents

- [esri-loader](#esri-loader)
- [Table of contents](#table-of-contents)
- [Install](#install)
- [Usage](#usage)
  - [Loading Modules from the ArcGIS API for JavaScript](#loading-modules-from-the-arcgis-api-for-javascript)
  - [Lazy Loading the ArcGIS API for JavaScript](#lazy-loading-the-arcgis-api-for-javascript)
  - [Loading Styles](#loading-styles)
- [Why is this needed?](#why-is-this-needed)
- [Examples](#examples)
- [Advanced Usage](#advanced-usage)
  - [ArcGIS Types](#arcgis-types)
  - [Configuring Dojo](#configuring-dojo)
  - [Overriding ArcGIS Styles](#overriding-arcgis-styles)
  - [Pre-loading the ArcGIS API for JavaScript](#pre-loading-the-arcgis-api-for-javascript)
  - [Isomorphic/universal applications](#isomorphicuniversal-applications)
  - [Using your own script tag](#using-your-own-script-tag)
  - [Using the esriLoader Global](#using-the-esriloader-global)
- [Updating from previous versions](#updating-from-previous-versions)
  - [From &lt; v1.5](#from--v15)
  - [From angular-esri-loader](#from-angular-esri-loader)
- [Dependencies](#dependencies)
  - [Browsers](#browsers)
  - [Promises](#promises)
- [Issues](#issues)
- [Contributing](#contributing)
- [Licensing](#licensing)

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

### Loading Modules from the ArcGIS API for JavaScript

#### From the Latest Version

Here's an example of how you could load and use the latest 4.x `WebMap` and `MapView` classes in a component to create a map (based on [this sample](https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=webmap-basic)):

```js
import { loadModules } from 'esri-loader';

// first, we use Dojo's loader to require the map class
loadModules(['esri/views/MapView', 'esri/WebMap'])
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

#### From a Specific Version

If you don't want to use the latest version of the ArcGIS API hosted on Esri's CDN, you'll need to pass options with the URL to whichever version you want to use. For example, the snippet below uses v3.x of the ArcGIS API to create a map.

```js
import { loadModules } from 'esri-loader';

// if the API hasn't already been loaded (i.e. the frist time this is run)
// loadModules() will call loadScript() and pass these options, which,
// in this case are only needed b/c we're using v3.x instead of the latest 4.x
const options = { version: '3.28' };

loadModules(['esri/map'], options)
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

### From a Specific URL

You can also load the modules from a specific URL, for example from a version of the SDK that you host on your own server. In this case, instead of passing the `version` option, you would pass the URL as a string like:

```js
const options = { url: `http://server/path/to/esri` };
```

### Lazy Loading the ArcGIS API for JavaScript

Lazy loading the ArcGIS API can dramatically improve the initial load performance of your application, especially if your users may never end up visiting any routes that need to show a map or 3D scene. That is why it is the default behavior of esri-loader. In the above snippets, the first time `loadModules()` is called, it will attempt lazy load the ArcGIS API by calling `loadScript()` for you. Subsequent calls to `loadModules()` will not attempt to load the script once `loadScript()` has been called.

See below for information on how you can [pre-load the ArcGIS API](#pre-loading-the-arcgis-api-for-javascript) after initial render but before a user visits a route that needs it.

### Loading Styles

Before you can use the ArcGIS API in your app, you'll need to load the styles that correspond to the version you are using. Just like the ArcGIS API modules, you'll probably want to [lazy load](#lazy-loading-the-arcgis-api-for-javascript) the styles only once they are needed by the application.

#### When you load the script

The easiest way to do that is to pass the `css` option to `loadModules()` or `loadScript()`:

```js
import { loadModules } from 'esri-loader';

// before loading the modules for the first time, 
// also lazy load the CSS for the version of 
// the script that you're loading from the CDN 
const options = { css: true };

loadModules(['esri/views/MapView', 'esri/WebMap'], options)
  .then(([MapView, WebMap]) => {
    // the styles, script, and modules have all been loaded (in that order)
  });
```

Passing `css: true` does not work when loading the script using the `url` option. In that case you'll need to pass the URL to the styles like: `css: 'http://server/path/to/esri/css/main.css'`.

When passing the `css` option to `loadModules()` it actually passes it to `loadScript()`, So you can also use the same values (either `true` or stylesheet URL) when you call `loadScript()` directly.

#### Using loadCss()

Alternatively, you can use the provided `loadCss()` function to load the ArcGIS styles at any point in your application's life cycle. For example:

```js
import { loadCss } from 'esri-loader';

// by default loadCss() loads styles for the latest 4.x version
loadCss();

// or for a specific CDN version
loadCss('3.28');

// or a from specific URL, like a locally hosted version
loadCss('http://server/path/to/esri/css/main.css');
```

See below for information on how to [override ArcGIS styles](#overriding-arcgis-styles) that you've lazy loaded with `loadModules()` or `loadCss()`.

#### Using traditional means

Of course, you don't need to use esri-loader to load the styles. See the [ArcGIS API for JavaScript documentation](https://developers.arcgis.com/javascript/latest/guide/get-api/index.html) for more information on how to load the ArcGIS styles by more traditional means such as adding `<link>` tags to your HTML, or `@import` statements to your CSS.

## Why is this needed?

Unfortunately, you can't simply `npm install` the ArcGIS API and then `import` 'esri' modules in a non-Dojo application. The only reliable way to load ArcGIS API for JavaScript modules is using Dojo's AMD loader. However, when using the ArcGIS API in an application built with another framework, you typically want to use the tooling and conventions of that framework rather than the Dojo build system. This library lets you do that by providing an ES module that you can `import` and use to dynamically inject an ArcGIS API script tag in the page and then use its Dojo loader to load only the ArcGIS API modules as needed.

There have been a few different solutions to this problem over the years, but only the [@arcgis/webpack-plugin](https://github.com/Esri/arcgis-webpack-plugin) and esri-loader allow you to improve your application's initial load performance, especially on mobile, by [lazy loading the ArcGIS API and modules](#lazy-loading-the-arcgis-api-for-javascript) only when they're needed (i.e. to render a map or 3D scene).

[This blog post](https://community.esri.com/people/TWayson-esristaff/blog/2018/05/10/arcgiswebpack-plugin-vs-esri-loader) explains why you would choose one or the other of those solutions, but here's the TLDR:
- Are you using ArcGIS API >= v4.7?
- Are you using [webpack](https://webpack.github.io/)?
- Are you (willing and) able to configure webpack?

If you answered "Yes" to all those questions you can use [@arcgis/webpack-plugin](https://github.com/Esri/arcgis-webpack-plugin) in your application and get the benefits of being able to use `import` statements and types for 'esri' modules.

Otherwise, you should use esri-loader, which allows you to use the ArcGIS API:
- both 4.x _and_ 3.x
- with _any_ module loader: (i.e. [rollup.js](https://rollupjs.org/), [Parcel](https://parceljs.org) etc.)
- with [whatever cli or boilerplate your team prefers](#examples)
- in [isomorphic/universal (server-rendered) applications](#isomorphicuniversal-applications)
- without having to load the ArcGIS API just to run your unit tests

## Examples

Here are some applications and framework-specific wrapper libraries that use this library. We don't guarantee that these examples are current, so check the version of esri-loader their commit history before using them as a reference. They are presented by framework in alphabetical order - not picking any favorites here :stuck_out_tongue_winking_eye::

### [Angular](https://angular.io/)

#### Reusable libraries for Angular

- [angular-esri-components](https://github.com/TheKeithStewart/angular-esri-components) - A set of Angular components to work with ArcGIS API for JavaScript v4.3

#### Example Angular applications

- [angular-cli-esri-map](https://github.com/Esri/angular-cli-esri-map) - Example of how to build a simple mapping component using Angular CLI.

### [CanJS](https://canjs.com/)

- [can-arcgis](https://github.com/roemhildtg/can-arcgis) - CanJS configureable mapping app (inspired by [cmv-app](https://github.com/cmv/cmv-app)) and components built for the ArcGIS JS API 4.x, bundled with [StealJS](https://stealjs.com/)

### [Choo](https://choo.io/)

- [esri-choo-example](https://github.com/jwasilgeo/esri-choo-example) - An example Choo application that shows how to use esri-loader to create a custom map view.

### [Dojo 2+](https://dojo.io)

- [dojo-esri-loader](https://github.com/odoe/dojo-esri-loader) - Dojo 5 app with esri-loader ([blog post](https://odoe.net/blog/dojo-framework-with-arcgis-api-for-javascript/))

- [esri-dojo](https://github.com/jamesmilneruk/esri-dojo) - An example of how to use Esri Loader with Dojo 2+. This example is a simple map that allows you to place markers on it.

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

- [react-arcgis](https://github.com/Esri/react-arcgis) - React component kit for Esri ArcGIS JS API
- [esri-loader-react](https://github.com/davetimmins/esri-loader-react) - A React component wrapper around esri-loader ([blog post](https://davetimmins.github.io/2017/07/19/esri-loader-react/))
- [arcgis-react-redux-legend](https://github.com/davetimmins/arcgis-react-redux-legend) - Legend control for ArcGIS JS v4 using React and Redux

#### Example React applications
- [create-arcgis-app](https://github.com/tomwayson/create-arcgis-app/) - An example of how to use the ArcGIS platform in an application created with Create React App and React Router.
- [next-arcgis-app](https://github.com/tomwayson/next-arcgis-app/) - An example of how to use the ArcGIS platform in an application built with Next.js
- [esri-loader-react-starter-kit](https://github.com/tomwayson/esri-loader-react-starter-kit) - A fork of the [react-starter-kit](https://github.com/kriasoft/react-starter-kit) showing how to use esri-loader in an isomorphic/universal React application
- [create-react-app-esri-loader](https://github.com/davetimmins/create-react-app-esri-loader/) - An example create-react-app application that uses [esri-loader-react](https://github.com/davetimmins/esri-loader-react) to load the ArcGIS API
- [React-Typescript-App-with-ArcGIS-JSAPI](https://github.com/guzhongren/React-Typescript-App-with-ArcGIS-JSAPI) - An example create-react-app application that uses [esri-loader](https://github.com/Esri/esri-loader), [esri-loader-react](https://github.com/davetimmins/esri-loader-react), [Typescript](https://www.typescriptlang.org/), [Webpack3](https://webpack.js.org/) to create MapView

### [Riot](https://riot.js.org/)

- [esri-riot-example](https://github.com/jwasilgeo/esri-riot-example) - An example Riot application that shows how to use esri-loader to create a custom `<esri-map-view>` component.

### [Stencil](https://stenciljs.com/)

- [esri-stencil-example](https://github.com/Dzeneralen/esri-stencil-example) - An example Stencil application that shows how to use esri-loader to create a custom map view component and implement some basic routing controlling the map state

### [Vue.js](https://vuejs.org/)

- [CreateMap](https://github.com/oppoudel/CreateMap) - Create Map: City of Baltimore - https://gis.baltimorecity.gov/createmap/#/
- [City of Baltimore: Map Gallery](https://github.com/oppoudel/MapGallery_Vue) - Map Gallery built with Vue.js that uses this library to load the ArcGIS API
- [vue-jsapi4](https://github.com/odoe/vue-jsapi4) - An example of how to use the [ArcGIS API for Javascript](https://developers.arcgis.com/javascript/) in a [NUXT](https://nuxtjs.org/) application ([blog post](https://odoe.net/blog/arcgis-api-4-for-js-with-vue-cli-and-nuxt/), [video](https://youtu.be/hqJzzgM8seo))
- [esri-vue-cli-example](https://github.com/tomwayson/esri-vue-cli-example) - An example of how to use the [ArcGIS API for JavaScript 3.x](https://developers.arcgis.com/javascript/3/) in a [vue-cli](https://github.com/vuejs/vue-cli) application

## Advanced Usage

### ArcGIS Types

This library doesn't make any assumptions about which version of the ArcGIS API you are using, so you will have to install the appropriate types. Furthermore, because you don't `import` esri modules directly with esri-loader, you'll have to follow the instructions below to use the types in your application.

#### 4.x Types

Follow [these instructions](https://github.com/Esri/jsapi-resources/tree/master/4.x/typescript) to install the 4.x types.

After installling the 4.x types, you can use the `__esri` namespace for the types as seen in [this example](https://github.com/kgs916/angular2-esri4-components/blob/68861b286fd3a4814c495c2bd723e336e917ced2/src/lib/esri4-map/esri4-map.component.ts#L20-L26).

#### 3.x Types

You can use [these instructions](https://github.com/Esri/jsapi-resources/tree/master/3.x/typescript) to install the 3.x types.

The `__esri` namespace is not defined for 3.x types, but you can `import * as esri from 'esri';` to use the types [as shown here](https://github.com/Esri/angular-cli-esri-map/issues/17#issue-360490589).

#### TypeScript import()

TypeScript 2.9 added a way to `import()` types which allows types to be imported without importing the module. For more information on import types see [this post](https://davidea.st/articles/typescript-2-9-import-types). You can use this as an alternative to the 4.x `_esri` namespace or `import * as esri from 'esri'` for 3.x.

After you've installed the [4.x](#4x-types) or [3.x](#4x-types) types as described above, you can then use TypeScript's `import()` like:

```ts
// define a type that is an array of the 4.x types you are using
// and indicate that loadModules() will resolve with that type
type MapModules = [typeof import("esri/WebMap"), typeof import("esri/views/MapView")];
const [WebMap, MapView] = await (loadModules(["esri/WebMap", "esri/views/MapView"]) as Promise<MapModules>);
// the returned objects now have type
const webmap = new WebMap({portalItem: {id: this.webmapid}});
```

A more complete 4.x sample can be [seen here](https://codesandbox.io/s/xv8mw2890w?fontsize=14&module=%2Fsrc%2Fmapping.ts).

This also works with the 3.x types:

```ts
// define a type that is an array of the 3.x types you are using
// and indicate that loadModules() will resolve with that type
type MapModules = [typeof import("esri/map"), typeof import("esri/geometry/Extent")];
const [Map, Extent] = await (loadModules(["esri/map", "esri/geometry/Extent"], options) as Promise<MapModules>);
// the returned objects now have type
let map = new Map("viewDiv"...
```
A more complete 3.x sample can be [seen here](https://codesandbox.io/s/rj6jloy4nm?fontsize=14&module=%2Fsrc%2Fmapping.ts).

#### Types in Angular CLI Applications

For Angular CLI applications, you will also need to add "arcgis-js-api" to `compilerOptions.types` in src/tsconfig.app.json and src/tsconfig.spec.json [as shown here](https://gist.github.com/tomwayson/e6260adfd56c2529313936528b8adacd#adding-the-arcgis-api-for-javascript-types).

### Configuring Dojo

You can pass a [`dojoConfig`](https://dojotoolkit.org/documentation/tutorials/1.10/dojo_config/) option to `loadModules()` or `loadScript()` to configure Dojo before the script tag is loaded. This is useful if you want to use esri-loader to load Dojo packages that are not included in the ArcGIS API for JavaScript such as [FlareClusterLayer](https://github.com/nickcam/FlareClusterLayer).

```js
import { loadModules } from 'esri-loader';

// in this case options are only needed so we can configure Dojo before loading the API
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

loadModules(['esri/map', 'fcl/FlareClusterLayer_v3'], options)
  .then(([Map, FlareClusterLayer]) => {
    // you can now create a new FlareClusterLayer and add it to a new Map
  })
  .catch(err => {
    // handle any errors
    console.error(err);
  });
```

### Overriding ArcGIS Styles

If you want to override ArcGIS styles that you have [lazy loaded using `loadModules()` or `loadCss()`](#loading-styles), you may need to insert the ArcGIS styles into the document _above_ your custom styles in order to ensure the [rules of CSS precedence](https://css-tricks.com/precedence-css-order-css-matters/) are applied correctly. For this reason, `loadCss()` accepts a [selector](https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Locating_DOM_elements_using_selectors#Selectors) (string) as optional second argument that it uses to query the DOM node (i.e. `<link>` or `<script>`) that contains your custom styles and then insert the ArcGIS styles above that node. You can also pass that selector as the `insertCssBefore` option to `loadModules()`:

```js
import { loadModules } from 'esri-loader';

// lazy load the CSS before loading the modules
const options = {
  css: true,
  // insert the stylesheet link above the first <style> tag on the page
  insertCssBefore: 'style'
};

// before loading the modules, this will call:
// loadCss('https://js.arcgis.com/4.11/esri/css/main.css', 'style')
loadModules(['esri/views/MapView', 'esri/WebMap'], options);
```

Alternatively you could insert it before the first `<link>` tag w/ `insertCssBefore: 'link[rel="stylesheet"]'`,  etc.

### Pre-loading the ArcGIS API for JavaScript

If you have good reason to believe that the user is going to transition to a map route, you may want to start pre-loading the ArcGIS API as soon as possible w/o blocking rendering, for example:

```js
import { loadScript, loadModules } from 'esri-loader';

// preload the ArcGIS API
// NOTE: in this case, we're not passing any options to loadScript()
// so it will default to loading the latest 4.x version of the API from the CDN
this.loadScriptPromise = loadScript();

// later, for example once a component has been rendered,
// you can wait for the above promise to resolve (if it hasn't already)
this.loadScriptPromise
  .then(() => {
    // you can now load the map modules and create the map
    // by using loadModules()
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
import { loadScript } from 'esri-loader';

if (typeof window !== 'undefined') {
  // this is running in a browser,
  // pre-load the ArcGIS API for later use in components
  this.loadScriptPromise = loadScript();
}
```

### Using your own script tag

It is possible to use this library only to load modules (i.e. not to lazy load or pre-load the ArcGIS API). In this case you will need to add a `data-esri-loader` attribute to the script tag you use to load the ArcGIS API for JavaScript. Example:

```html
<!-- index.html -->
<script src="https://js.arcgis.com/4.11/" data-esri-loader="loaded"></script>
```

### Using the esriLoader Global

Typically you would [install the esri-loader package](#install) and then `import` the functions you need as shown in all the above examples. However, esri-loader is also distributed as an ES5 [UMD](http://jargon.js.org/_glossary/UMD.md) bundle on [UNPKG](https://unpkg.com/) so that you can load it via a script tag and use the above functions from the `esriLoader` global.

```html
<script src="https://unpkg.com/esri-loader"></script>
<scirpt>
  esriLoader.loadModules(['esri/views/MapView', 'esri/WebMap'])
  .then(([MapView, WebMap]) => {
    // use MapView and WebMap classes as shown above
  });
</script>
```

## Updating from previous versions

### From &lt; v1.5

If you have an application using a version that is less than v1.5, [this commit](https://github.com/odoe/vue-jsapi4/pull/1/commits/4cb6413c0ea31fdd09e94f3a0ce0d1669a9fd5ad) shows the kinds of changes you'll need to make. In most cases, you should be able to replace a series of calls to `isLoaded()`, `bootstrap()`, and `dojoRequire()` with a single call to `loadModules()`.

### From angular-esri-loader

The angular-esri-loader wrapper library is no longer needed and has been deprecated in favor of using esri-loader directly. See [this issue](https://github.com/Esri/esri-loader/issues/75) for suggestions on how to replace angular-esri-loader with the latest version of esri-loader.

## Dependencies

### Browsers

This library doesn't have any external dependencies, but the functions it exposes to load the ArcGIS API and its modules expect to be run in a browser. This library officially supports [the same browers that are supported by the latest version of the ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/latest/guide/system-requirements/index.html#supported-browsers). Since this library also works with [v3.x of the ArcGIS API](https://developers.arcgis.com/javascript/3/), the community [has made some effort](https://github.com/Esri/esri-loader/pull/67) to get it to work with [some of the older browsers supported by 3.x](https://developers.arcgis.com/javascript/3/jshelp/supported_browsers.html) like IE < 11.

You cannot run the ArcGIS API for JavaScript in [Node.js](https://nodejs.org/), but you _can_ use this library in [isomorphic/universal applications](#isomorphicuniversal-applications) as well as [Electron](#electron). If you need to exectue requests to ArcGIS REST services from something like a Node.js CLI application, see [arcgis-rest-js](https://github.com/Esri/arcgis-rest-js).

### Promises

Since v1.5 asynchronous functions like `loadModules()` and `loadScript()` return [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)s, so if your application has to support [browers that don't support Promise (i.e. IE)](https://caniuse.com/#search=promise) you have a few options.

If there's already a Promise implementation loaded on the page you can configure esri-loader to use that implementation. For example, in [ember-esri-loader](https://github.com/Esri/ember-esri-loader), we configure esri-loader to use the RSVP Promise implementation included with Ember.js.

```js
import { utils } from  'esri-loader';

init () {
  this._super(...arguments);
  // have esriLoader use Ember's RSVP promise
  utils.Promise = Ember.RSVP.Promise;
},
```

Otherwise, you should consider using a [Promise polyfill](https://www.google.com/search?q=promise+polyfill), ideally [only when needed](https://philipwalton.com/articles/loading-polyfills-only-when-needed/).

## Issues

Find a bug or want to request a new feature?  Please let us know by [submitting an issue](https://github.com/Esri/esri-loader/issues/).

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing

Copyright &copy; 2016-2019 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE]( ./LICENSE) file.
