# esri-loader

[![Travis](https://img.shields.io/travis/Esri/esri-loader.svg)](https://travis-ci.org/Esri/esri-loader/builds/) [![npm](https://img.shields.io/npm/v/esri-loader.svg)](https://github.com/Esri/esri-loader/releases) [![npm](https://img.shields.io/npm/dw/esri-loader.svg)](https://www.npmjs.com/package/esri-loader) [![npm](https://img.shields.io/npm/l/esri-loader.svg)](https://github.com/Esri/esri-loader/blob/master/LICENSE) [![GitHub stars](https://img.shields.io/github/stars/esri/esri-loader.svg?style=social&label=Stars)](https://github.com/Esri/esri-loader/stargazers)

A tiny library to help you use the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/) in applications built with popular JavaScript frameworks and bundlers.

**NOTE: As of version v4.18 of the ArcGIS API for JavaScript you can try installing [@arcgis/core](https://www.npmjs.com/package/@arcgis/core) and [building with ES Modules](https://developers.arcgis.com/javascript/latest/guide/es-modules) _instead_ of using esri-loader.** Read more below about [when you might want to use esri-loader](#why-is-this-needed).

![ArcGIS logo, mended broken heart, Angular logo, Ember logo, React logo, Vue logo](https://docs.google.com/drawings/d/e/2PACX-1vSUEfgaupMLz6FXBX65X-nm7cqA0r9ed3rJ_KNISeqzwDDkd8LsubLhQ_hCWwO3zjS41cD5eG7QUBHl/pub?w=888&h=222)

Ready to jump in? Follow the [Install](#install) and [Usage](#usage) instructions below to get started. Then see more in depth instructions on how to [configure esri-loader](#configuring-esri-loader) and use it with [React](#react), [Vue.js](#vuejs), [Angular](#angular), [Ember](#ember), or the [ArcGIS Types](#arcgis-types).

Want to learn more? Learn how esri-loader can help [improve application load performance](#lazy-loading-the-arcgis-api-for-javascript) and allow you to [use the ArcGIS API in server side rendered applications](#server-side-rendering).

Want to be inspired? See the [Examples](#examples) section below for links to applications that use this library in over a dozen different frameworks.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
  - [Loading Modules from the ArcGIS API for JavaScript](#loading-modules-from-the-arcgis-api-for-javascript)
  - [Lazy Loading the ArcGIS API for JavaScript](#lazy-loading-the-arcgis-api-for-javascript)
  - [Loading Styles](#loading-styles)
- [Do I need esri-loader?](#do-i-need-esri-loader)
- [Examples](#examples)
  - [Angular](#angular)
  - [Ember](#ember)
  - [React](#react)
  - [Vue.js](#vuejs)
- [Advanced Usage](#advanced-usage)
  - [ArcGIS Types](#arcgis-types)
    - [esri-loader-typings-helper Plugin](#esri-loader-typings-helper-plugin)
  - [Configuring esri-loader](#configuring-esri-loader)
  - [Configuring Dojo](#configuring-dojo)
  - [Overriding ArcGIS Styles](#overriding-arcgis-styles)
  - [Pre-loading the ArcGIS API for JavaScript](#pre-loading-the-arcgis-api-for-javascript)
  - [Using your own script tag](#using-your-own-script-tag)
  - [Without a module bundler](#without-a-module-bundler)
    - [Using a module script tag](#using-a-module-script-tag)
    - [Using the esriLoader Global](#using-the-esriloader-global)
- [Pro Tips](#pro-tips)
  - [Using Classes Synchronously](#using-classes-synchronously)
  - [Server Side Rendering](#server-side-rendering)
  - [FAQs](#faqs)
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

The code snippets below show how to load the ArcGIS API and its modules and then use them to create a map. Where you would place similar code in your application will depend on which application framework you are using. See below for examples that are specific to [React](#react), [Vue.js](#vuejs), [Angular](#angular), [Ember](#ember), and [example applications](#examples) written in over a dozen frameworks.

### Loading Modules from the ArcGIS API for JavaScript

#### From the Latest Version

Here's an example of how you could load and use the `WebMap` and `MapView` classes from the latest 4.x release to create a map (based on [this sample](https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=webmap-basic)):

```js
import { loadModules } from 'esri-loader';

// this will lazy load the ArcGIS API
// and then use Dojo's loader to require the classes
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

By default esri-loader will load modules from the [latest 4.x release of the API from the CDN](https://developers.arcgis.com/javascript/latest/guide/get-api/#cdn), but you can [configure the default behavior](#configuring-esri-loader) by calling `setDefaultOptions()` once _before_ making any calls to `loadModules()`.

For example, the snippet below configures esri-loader to use the [latest 3.x release of the API from the CDN](https://developers.arcgis.com/javascript/3/jshelp/intro_accessapi.html#cdn) by setting the default `version` option during application start up.

```js
// app.js
import { setDefaultOptions } from 'esri-loader';

// configure esri-loader to use version 3.40 from the ArcGIS CDN
// NOTE: make sure this is called once before any calls to loadModules()
setDefaultOptions({ version: '3.40' })
```

Then later, for example after a map component has mounted, you would use `loadModules()` as normal, except in this case you'd be using the [3.x `Map` class](https://developers.arcgis.com/javascript/3/jsapi/map-amd.html) instead of the 4.x classes.

```js
// component.js
import { loadModules } from 'esri-loader';

// this will lazy load the ArcGIS API
// and then use Dojo's loader to require the map class
loadModules(['esri/map'])
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

You can load the ["next" version of the ArcGIS API](https://github.com/Esri/feedback-js-api-next#esri-loader) by passing `version: 'next'`.

#### From a Specific URL

If you want to load modules from a build that you host on your own server (i.e. that you've [downloaded](https://developers.arcgis.com/javascript/latest/guide/get-api/#download-api) or [built with Dojo](https://developers.arcgis.com/javascript/latest/guide/using-npm/)), you would set the default `url` option instead:

```js
// app.js
import { setDefaultOptions } from 'esri-loader';

// configure esri-loader to use version from a locally hosted build of the API
// NOTE: make sure this is called once before any calls to loadModules()
setDefaultOptions({ url: `http://server/path/to/esri` });
```

See [Configuring esri-loader](#configuring-esri-loader) for all available configuration options.

### Lazy Loading the ArcGIS API for JavaScript

Lazy loading the ArcGIS API can dramatically improve the initial load performance of your mapping application, especially if your users may never end up visiting any routes that need to show a map or 3D scene. That is why it is the default behavior of esri-loader. In the above snippets, the first time `loadModules()` is called, it will lazy load the ArcGIS API by injecting a `<script>` tag in the page. That call and any subsequent calls to `loadModules()` will wait for the script to load before resolving with the modules.

If you have some reason why you do not want to lazy load the ArcGIS API, you can [use a static script tag](#using-your-own-script-tag) instead.

### Loading Styles

Before you can use the ArcGIS API in your app, you _must_ load the styles that correspond to the version you are using. Just like the ArcGIS API modules, you'll probably want to [lazy load](#lazy-loading-the-arcgis-api-for-javascript) the styles only once they are needed by the application.

#### When you load the script

The easiest way to do that is to pass the `css` option to `setDefaultOptions()`:

```js
import { setDefaultOptions, loadModules } from 'esri-loader';

// before loading the modules for the first time,
// also lazy load the CSS for the version of
// the script that you're loading from the CDN
setDefaultOptions({ css: true });

loadModules(['esri/views/MapView', 'esri/WebMap'])
  .then(([MapView, WebMap]) => {
    // the styles, script, and modules have all been loaded (in that order)
  });
```

Passing `css: true` does **not** work when loading the script using the `url` option. In that case you'll need to pass the URL to the styles like: `css: 'http://server/path/to/esri/css/main.css'`. See [Configuring esri-loader](#configuring-esri-loader) for all available configuration options.

#### Using loadCss()

Alternatively, you can use the provided `loadCss()` function to load the ArcGIS styles at any point in your application's life cycle. For example:

```js
import { loadCss } from 'esri-loader';

// by default loadCss() loads styles for the latest 4.x version
loadCss();

// or for a specific CDN version
loadCss('3.40');

// or a from specific URL, like a locally hosted version
loadCss('http://server/path/to/esri/css/main.css');
```

See below for information on how to [override ArcGIS styles](#overriding-arcgis-styles) that you've lazy loaded with `loadModules()` or `loadCss()`.

#### Using traditional means

Of course, you don't need to use esri-loader to load the styles. See the [ArcGIS API for JavaScript documentation](https://developers.arcgis.com/javascript/latest/guide/get-api/index.html) for more information on how to load the ArcGIS styles by more traditional means such as adding `<link>` tags to your HTML, or `@import` statements to your CSS.

## Do I need esri-loader?

As of version v4.18 of the ArcGIS API for JavaScript you can try installing [@arcgis/core](https://www.npmjs.com/package/@arcgis/core) and [building with ES Modules](https://developers.arcgis.com/javascript/latest/guide/es-modules) and _instead_ of using esri-loader. It's also pretty easy to [migrate applications built  with esri-loader](https://developers.arcgis.com/javascript/latest/guide/es-modules/#esri-loader).

<a id="why-is-this-needed"></a>Unfortunately, prior to version 4.18, you couldn't simply `npm install` the ArcGIS API and `import` its modules. The only reliable way to load ArcGIS API for JavaScript modules was using Dojo's AMD loader. Rather than using Dojo to build your application, esri-loader provides a way to dynamically load modules at runtime from a hosted build of the ArcGIS API into applications built using modern tools and framework conventions. This allows your application to take advantage of the fast cached [CDN](https://developers.arcgis.com/javascript/latest/guide/get-api/#cdn).

esri-loader has been the most versatile way to integrate the ArcGIS API for JavaScript with other frameworks and their tools since it works in applications that:
- are built with _any_ loader/bundler, such as [webpack](https://webpack.js.org/), [rollup.js](https://rollupjs.org/), or [Parcel](https://parceljs.org)
- use framework tools that discourage or prevent you from manually editing their configuration
- use either version [4.x](https://developers.arcgis.com/javascript/) _or_ [3.x](https://developers.arcgis.com/javascript/3/) of the ArcGIS API for JavaScript
- make very limited use of the ArcGIS API and don't want to incur the cost of including it in their build

Most developers will prefer the convenience of being able to `import` from `@arcgis/core` directly, especially if their application makes extensive use of the ArcGIS API. However, if `@arcgis/core` doesn't work in your application for whatever reason, esri-loader probably will.

Learn more about [which is the right solution for your application](https://developers.arcgis.com/javascript/latest/guide/tooling-intro/).

## Examples

Here are some applications and framework-specific wrapper libraries that use this library. We don't guarantee that these examples are current, so check the version of esri-loader and their commit history before using them as a reference. They are presented by framework in alphabetical order - not picking any favorites here :stuck_out_tongue_winking_eye::

### [Angular](https://angular.io/)

> See the ArcGIS API guides for up to date examples of how to [use the ArcGIS API for JavaScript with Angular](https://developers.arcgis.com/javascript/latest/guide/angular/).

#### Reusable libraries for Angular

- [angular-esri-components](https://github.com/TheKeithStewart/angular-esri-components) - A set of Angular components to work with ArcGIS API for JavaScript v4.3

#### Example Angular applications

- [angular-cli-esri-map](https://github.com/Esri/angular-cli-esri-map) - Example of how to build a simple mapping component using Angular CLI.

**NOTE**: If you want to use the ArcGIS API in an [AngularJS (1.x)](https://angularjs.org/) application, see [angular-esri-map](https://github.com/Esri/angular-esri-map), which is actually where the code in this library was originally extracted from.

### [CanJS](https://canjs.com/)

- [can-arcgis](https://github.com/roemhildtg/can-arcgis) - CanJS configurable mapping app (inspired by [cmv-app](https://github.com/cmv/cmv-app)) and components built for the ArcGIS JS API 4.x, bundled with [StealJS](https://stealjs.com/)

### [Choo](https://choo.io/)

- [esri-choo-example](https://github.com/jwasilgeo/esri-choo-example) - An example Choo application that shows how to use esri-loader to create a custom map view.

### [Dojo 2+](https://dojo.io)

- [dojo-esri-loader](https://github.com/odoe/dojo-esri-loader) - Dojo 5 app with esri-loader ([blog post](https://odoe.net/blog/dojo-framework-with-arcgis-api-for-javascript/))

- [esri-dojo](https://github.com/jamesmilneruk/esri-dojo) - An example of how to use Esri Loader with Dojo 2+. This example is a simple map that allows you to place markers on it.

### [Electron](https://electron.atom.io/)

- [ng-cli-electron-esri](https://github.com/TheKeithStewart/ng-cli-electron-esri) - This project is meant to demonstrate how to run a mapping application using the ArcGIS API for JavaScript inside of Electron

### [Ember](https://www.emberjs.com/)

> See the ArcGIS API guides for up to date examples of how to [use the ArcGIS API for JavaScript with Ember](https://developers.arcgis.com/javascript/latest/guide/ember/).

#### Reusable libraries for Ember

- [ember-esri-loader](https://github.com/Esri/ember-esri-loader) - An Ember addon that wraps this library

#### Example Ember applications

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

> See the ArcGIS API guides for up to date examples of how to [use the ArcGIS API for JavaScript with React](https://developers.arcgis.com/javascript/latest/guide/react/).

#### Reusable libraries for React

- [esri-loader-hooks](https://github.com/tomwayson/esri-loader-hooks) - Custom React hooks for using the ArcGIS API for JavaScript with esri-loader
- [react-arcgis](https://github.com/Esri/react-arcgis) - A few components to help you get started using esri-loader with React
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

### [Svelte](https://svelte.dev/)

- [esri-svelte-example](https://github.com/gavinr/esri-svelte-example) - An example Svelte application that shows how to use esri-loader to load a map.
- [esri-svelte-basemaps-example](https://github.com/jwasilgeo/esri-svelte-basemaps-example) - An example Svelte application that shows how to use esri-loader to create a custom `<EsriMapView>` component and explore various basemaps.

### [Vue.js](https://vuejs.org/)

> See the ArcGIS API guides for up to date examples of how to [use the ArcGIS API for JavaScript with Vue](https://developers.arcgis.com/javascript/latest/guide/vue/).

- [CreateMap](https://github.com/oppoudel/CreateMap) - Create Map: City of Baltimore - https://gis.baltimorecity.gov/createmap/#/
- [City of Baltimore: Map Gallery](https://github.com/oppoudel/MapGallery_Vue) - Map Gallery built with Vue.js that uses this library to load the ArcGIS API
- [vue-jsapi4](https://github.com/odoe/vue-jsapi4) - An example of how to use the [ArcGIS API for Javascript](https://developers.arcgis.com/javascript/) in a [NUXT](https://nuxtjs.org/) application ([blog post](https://odoe.net/blog/arcgis-api-4-for-js-with-vue-cli-and-nuxt/), [video](https://youtu.be/hqJzzgM8seo))
- [esri-vue-cli-example](https://github.com/tomwayson/esri-vue-cli-example) - An example of how to use the [ArcGIS API for JavaScript 3.x](https://developers.arcgis.com/javascript/3/) in a [vue-cli](https://github.com/vuejs/vue-cli) application

## Advanced Usage

### ArcGIS Types

This library doesn't make any assumptions about which version of the ArcGIS API you are using, so you will have to install the appropriate types. Furthermore, because you don't `import` esri modules directly with esri-loader, you'll have to follow the instructions below to use the types in your application.

#### 4.x Types

Follow [these instructions](https://github.com/Esri/jsapi-resources/tree/master/4.x/typescript) to install the 4.x types.

After installing the 4.x types, you can use the `__esri` namespace for the types as seen in [this example](https://github.com/kgs916/angular2-esri4-components/blob/68861b286fd3a4814c495c2bd723e336e917ced2/src/lib/esri4-map/esri4-map.component.ts#L20-L26).

#### 3.x Types

You can use [these instructions](https://github.com/Esri/jsapi-resources/tree/master/3.x/typescript) to install the 3.x types.

The `__esri` namespace is not defined for 3.x types, but you can `import * as esri from 'esri';` to use the types [as shown here](https://github.com/Esri/angular-cli-esri-map/issues/17#issue-360490589).

#### TypeScript import()

TypeScript 2.9 added a way to `import()` types which allows types to be imported without importing the module. For more information on import types see [this post](https://davidea.st/articles/typescript-2-9-import-types). You can use this as an alternative to the 4.x `_esri` namespace or `import * as esri from 'esri'` for 3.x.

After you've installed the [4.x](#4x-types) or [3.x](#3x-types) types as described above, you can then use TypeScript's `import()` like:

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
const [Map, Extent] = await (loadModules(["esri/map", "esri/geometry/Extent"]) as Promise<MapModules>);
// the returned objects now have type
let map = new Map("viewDiv"...
```
A more complete 3.x sample can be [seen here](https://codesandbox.io/s/rj6jloy4nm?fontsize=14&module=%2Fsrc%2Fmapping.ts).

#### Types in Angular CLI Applications

For Angular CLI applications, you will also need to add "arcgis-js-api" to `compilerOptions.types` in src/tsconfig.app.json and src/tsconfig.spec.json [as shown here](https://gist.github.com/tomwayson/e6260adfd56c2529313936528b8adacd#adding-the-arcgis-api-for-javascript-types).

#### esri-loader-typings-helper Plugin

An easy way to automatically get the typings for the ArcGIS JS API modules is to use the [esri-loader-typings-helper](https://marketplace.visualstudio.com/items?itemName=CalebMackey.esri-loader-typings-helper) plugin for [VS Code](https://code.visualstudio.com/).  This plugin will allow you to simply call out an array of modules to import, and when the text is selected and the plugin is called, it will automatically generate the `loadModules()` code for you in either the `async/await` pattern or using a `Promise`:

async example:

![typings-helper-async](https://github.com/CalebM1987/esri-loader-typings-helper/raw/HEAD/previews/plugin-async.gif)

promise example: 

![typings-helper-async](https://github.com/CalebM1987/esri-loader-typings-helper/raw/HEAD/previews/plugin-promise.gif)

> Note: this plugin is not restricted to just using TypeScript, it will also work in JavaScript to generate the same code, except without the type declarations.

### Configuring esri-loader

As mentioned above, you can call `setDefaultOptions()` to configure [how esri-loader loads ArcGIS API modules](#from-a-specific-version) and [CSS](#when-you-load-the-script). Here are all the options you can set:

| Name              | Type                  | Default Value | Description                                                                                                                                                                                                                                             |
| ----------------- | --------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `version`         | `string`              | `'4.23'`      | The version of the ArcGIS API hosted on Esri's CDN to use.                                                                                                                                                                                              |
| `url`             | `string`              | `undefined`   | The URL to a hosted build of the ArcGIS API to use. If both `version` and `url` are passed, `url` will be used.                                                                                                                                         |
| `css`             | `string` or `boolean` | `undefined`   | If a `string` is passed it is assumed to be the URL of a CSS file to load. Use `css: true` to load the `version`'s CSS from the CDN.                                                                                                                    |
| `insertCssBefore` | `string`              | `undefined`   | When using `css`, the `<link>` to the stylesheet will be inserted before the first element that matches this [CSS Selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors). See [Overriding ArcGIS Styles](#overriding-arcgis-styles). |

All of the above are optional.

#### Without `setDefaultOptions()`

If your application only has a single call to `loadModules()`, you do not need `setDefaultOptions()`. Instead you can just pass the `options` as a second argument to `loadModules()`:

```js
import { loadModules } from 'esri-loader';

// configure esri-loader to use version 3.40
// and the CSS for that version from the ArcGIS CDN
const options = { version: '3.40', css: true };

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

### Configuring Dojo

You can set `window.dojoConfig` before calling `loadModules()` to [configure Dojo](https://dojotoolkit.org/documentation/tutorials/1.10/dojo_config/) before the script tag is loaded. This is useful if you want to use esri-loader to load Dojo packages that are not included in the ArcGIS API for JavaScript such as [FlareClusterLayer](https://github.com/nickcam/FlareClusterLayer).

```js
import { loadModules } from 'esri-loader';

// can configure Dojo before loading the API
window.dojoConfig = {
  // tell Dojo where to load other packages
  async: true,
  packages: [
    {
      location: '/path/to/fcl',
      name: 'fcl'
    }
  ]
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
// loadCss('https://js.arcgis.com/4.12/themes/light/main.css', 'style')
loadModules(['esri/views/MapView', 'esri/WebMap'], options);
```

Alternatively you could insert it before the first `<link>` tag w/ `insertCssBefore: 'link[rel="stylesheet"]'`,  etc.

### Pre-loading the ArcGIS API for JavaScript

Under the hood, `loadModules()` calls esri-loader's `loadScript()` function to lazy load the ArcGIS API by injecting a `<script>` tag into the page.

If `loadModules()` hasn't yet been called, but you have good reason to believe that the user is going take an action that will call it (i.e. transition to a route that shows a map), you can call `loadScript()` ahead of time to start loading ArcGIS API. For example:

```js
import { loadScript, loadModules } from 'esri-loader';

// preload the ArcGIS API
// NOTE: in this case, we're not passing any options to loadScript()
// so it will default to loading the latest 4.x version of the API from the CDN
loadScript();

// later, for example after transitioning to a route with a map
// you can now load the map modules and create the map
const [MapView, WebMap] = await loadModules(['esri/views/MapView', 'esri/WebMap']);
```
See [Configuring esri-loader](#configuring-esri-loader) for all available configuration options you can pass to `loadScript()`.

**NOTE**: `loadScript()` does **not** use [`rel="preload"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content#Scripting_and_preloads), so it will fetch, parse, and execute the script. In practice, it can be tricky to find a point in your application where you can call `loadScript()` without blocking rendering. In most cases, it's best to just use `loadModules()` to lazy load the script.

### Using your own script tag

It is possible to use this library only to load modules (i.e. not to lazy load or pre-load the ArcGIS API). In this case you will need to add a `data-esri-loader` attribute to the script tag you use to load the ArcGIS API for JavaScript. Example:

```html
<!-- index.html -->
<script src="https://js.arcgis.com/4.23/" data-esri-loader="loaded"></script>
```

### Without a module bundler

Typically you would [install the esri-loader package](#install) and then use a module loader/bundler to `import` the functions you need as part of your application's build. However, ES5 builds of esri-loader are also distributed on [UNPKG](https://unpkg.com/) both as ES modules and as a [UMD](http://jargon.js.org/_glossary/UMD.md) bundle that exposes the `esriLoader` global.

This is an _excellent_ way to prototype how you will use the ArcGIS API for JavaScript, or to isolate any problems that you are having with the API. Before we can help you with any issue related to the behavior of a map, scene, or widgets, we will **require** you to reproduce it _outside_ your application. A great place to start is one of the codepens linked below.

#### Using a module script tag

You can load the esri-loader [ES modules directly in modern browsers](https://caniuse.com/#feat=es6-module) using `<script type="module">`. The advantage of this approach is that [browsers that support `type="module"` also support ES2015 and many later features like `async`/`await`](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/). This means you can safely write modern JavaScript in your script, which will make it easier to copy/paste to/from your application's source code.

```html
<script type="module">
  // to use a specific version of esri-loader, include the @version in the URL for example:
  // https://unpkg.com/esri-loader@2.14.0/dist/esm/esri-loader.js
  import { loadModules } from "https://unpkg.com/esri-loader/dist/esm/esri-loader.js";

  const main = async () => {
    const [MapView, WebMap] = await loadModules(['esri/views/MapView', 'esri/WebMap']);
    // use MapView and WebMap classes as shown above
  }
  main();
</script>
```

You can fork [this codepen](https://codepen.io/gavinr/pen/wvavjwp) to try this out yourself.

A disadvantage of this approach is that the ES module build of esri-loader is not bundled. This means your browser will make multiple requests for a few (tiny) JS files, which may not be suitable for a production application.

#### Using the esriLoader Global

If you need to run the script in an older browser, you can load the UMD build and then use the `esriLoader` global.

```html
<!--
  to use a specific version of esri-loader, include the @version in the URL for example:
  https://unpkg.com/esri-loader@2.14.0
-->
<script src="https://unpkg.com/esri-loader"></script>
<script>
  esriLoader.loadModules(['esri/views/MapView', 'esri/WebMap'])
  .then(function ([MapView, WebMap]) {
    // use MapView and WebMap classes as shown above
  });
</script>
```

You can fork [this codepen](https://codepen.io/tomwayson/pen/PoqwZYm) to try this out yourself.

## Pro Tips

### Using Classes Synchronously

Let's say you need to create a map in one component, and then later in another component add a graphic to that map. Unlike creating a map, creating a graphic and adding it to a map is ordinarily a synchronous operation, so it can be inconvenient to have to wait for `loadModules()` just to load the `Graphic` class. One way to handle this is have the function that creates the map _also_ load the `Graphic` class before its needed. You can then hold onto that class for later use to be exposed by a function like  `addGraphicToMap(view, graphicJson)`:

```javascript
// utils/map.js
import { loadModules } from 'esri-loader';

// NOTE: module, not global scope
let _Graphic;

// this will be called by the map component
export function loadMap(element, mapOptions) {
  return loadModules(['esri/Map', 'esri/views/MapView', 'esri/Graphic'])
  .then(([Map, MapView, Graphic]) => {
    // hold onto the graphic class for later use
    _Graphic = Graphic;
    // create the Map
    const map = new Map(mapOptions);
    // return a view showing the map at the element
    return new MapView({
      map,
      container: element
    });
  });
}

// this will be called by the component that needs to add the graphic to the map
export function addGraphicToMap(view, graphicJson) {
  // make sure that the graphic class has already been loaded
  if (!_Graphic) {
    throw new Error('You must load a map before creating new graphics');
  }
  view.graphics.add(new _Graphic(graphicJson));
}
```

You can [see this pattern in use in a real-world application](https://github.com/tomwayson/create-arcgis-app/blob/master/src/utils/map.js).

See [#124 (comment)](https://github.com/Esri/esri-loader/issues/124#issuecomment-408482410) and [#71 (comment)](https://github.com/Esri/esri-loader/issues/71#issuecomment-381356848) for more background on this pattern.

### Server Side Rendering

<a id="isomorphicuniversal-applications"></a>This library also allows you to use the ArcGIS API in [applications that are rendered on the server](https://medium.com/@baphemot/whats-server-side-rendering-and-do-i-need-it-cb42dc059b38). There's really no difference in how you invoke the functions exposed by this library, however you should avoid trying to call them from any code that runs on the server. The easiest way to do this is to call `loadModules()` in component lifecyle hooks that are only invoked in a browser, for example, React's [useEffect](https://reactjs.org/docs/hooks-effect.html) or [componentDidMount](https://reactjs.org/docs/react-component.html#componentdidmount), or Vue's [mounted](https://vuejs.org/v2/api/#mounted).

Alternatively, you could use checks like the following to prevent calling esri-loader functions on the server:

```js
import { loadCss } from 'esri-loader';

if (typeof window !== 'undefined') {
  // this is running in a browser, so go ahead and load the CSS
  loadCss();
}
```

See [next-arcgis-app](https://github.com/tomwayson/next-arcgis-app/) or [esri-loader-react-starter-kit](https://github.com/tomwayson/esri-loader-react-starter-kit/) for examples of how to use esri-loader in server side rendered (SSR) applications.

### FAQs

In addition to the pro tips above, you might want to check out some [frequently asked questions](https://github.com/Esri/esri-loader/issues?utf8=%E2%9C%93&q=label%3AFAQ+sort%3Aupdated-desc).

## Updating from previous versions

### From &lt; v1.5

If you have an application using a version that is less than v1.5, [this commit](https://github.com/odoe/vue-jsapi4/pull/1/commits/4cb6413c0ea31fdd09e94f3a0ce0d1669a9fd5ad) shows the kinds of changes you'll need to make. In most cases, you should be able to replace a series of calls to `isLoaded()`, `bootstrap()`, and `dojoRequire()` with a single call to `loadModules()`.

### From angular-esri-loader

The angular-esri-loader wrapper library is no longer needed and has been deprecated in favor of using esri-loader directly. See [this issue](https://github.com/Esri/esri-loader/issues/75) for suggestions on how to replace angular-esri-loader with the latest version of esri-loader.

## Dependencies

### Browsers

This library doesn't have any external dependencies, but the functions it exposes to load the ArcGIS API and its modules expect to be run in a browser. This library officially supports [the same browsers that are supported by the latest version of the ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/latest/guide/system-requirements/index.html#supported-browsers). Since this library also works with [v3.x of the ArcGIS API](https://developers.arcgis.com/javascript/3/), the community [has made some effort](https://github.com/Esri/esri-loader/pull/67) to get it to work with [some of the older browsers supported by 3.x](https://developers.arcgis.com/javascript/3/jshelp/supported_browsers.html) like IE < 11.

You cannot run the ArcGIS API for JavaScript in [Node.js](https://nodejs.org/), but you _can_ use this library in [server side rendered applications](#server-side-rendering) as well as [Electron](#electron). If you need to execute requests to ArcGIS REST services from something like a Node.js CLI application, see [arcgis-rest-js](https://github.com/Esri/arcgis-rest-js).

### Promises

Since v1.5 asynchronous functions like `loadModules()` and `loadScript()` return [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)s, so if your application has to support [browsers that don't support Promise (i.e. IE)](https://caniuse.com/#search=promise) you have a few options.

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
