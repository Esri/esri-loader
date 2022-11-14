### 3.x Types

You can use these instructions in the [Legacy samples for ArcGIS JSAPI Resources](https://github.com/Esri/jsapi-resources/releases/tag/legacy) to install the 3.x types. Follow the instructions outlined in the `/3.x/typescript` directory.

Use `import * as esri from 'esri';` to implement the types [as shown here](https://github.com/Esri/angular-cli-esri-map/issues/17#issue-360490589).

```ts
// define a type that is an array of the 3.x types you are using
// and indicate that loadModules() will resolve with that type
type MapModules = [typeof import("esri/map"), typeof import("esri/geometry/Extent")];
const [Map, Extent] = await (loadModules(["esri/map", "esri/geometry/Extent"]) as Promise<MapModules>);
// the returned objects now have type
let map = new Map("viewDiv"...
```

A more complete 3.x sample can be [seen here](https://codesandbox.io/s/rj6jloy4nm?fontsize=14&module=%2Fsrc%2Fmapping.ts).

### 4.x Types

A more complete 4.x sample can be [seen here](https://codesandbox.io/s/xv8mw2890w?fontsize=14&module=%2Fsrc%2Fmapping.ts).

### Legacy browsers

Since this library also works with [v3.x of the ArcGIS API](https://developers.arcgis.com/javascript/3/), the community [has made some effort](https://github.com/Esri/esri-loader/pull/67) to get it to work with [some of the older browsers supported by 3.x](https://developers.arcgis.com/javascript/3/jshelp/supported_browsers.html) like IE < 11.

### Legacy examples

Here is an archive of some applications and framework-specific wrapper libraries that use this library. Most of these examples haven't been updated in a long time, so check the version of esri-loader and their commit history before using them as a reference. They are presented by framework in alphabetical order - not picking any favorites here :stuck_out_tongue_winking_eye::

### [Angular](https://angular.io/)

#### Reusable libraries for Angular

- [angular-esri-components](https://github.com/TheKeithStewart/angular-esri-components) - A set of Angular components to work with ArcGIS API for JavaScript v4.3

#### Example Angular applications

- [angular-cli-esri-map](https://github.com/Esri/angular-cli-esri-map) - Example of how to build a simple mapping component using Angular CLI.

### [CanJS](https://canjs.com/)

- [can-arcgis](https://github.com/roemhildtg/can-arcgis) - CanJS configurable mapping app (inspired by [cmv-app](https://github.com/cmv/cmv-app)) and components built for the ArcGIS JS API 4.x, bundled with [StealJS](https://stealjs.com/)

### [Choo](https://choo.io/)

- [esri-choo-example](https://github.com/jwasilgeo/esri-choo-example) - An example Choo application that shows how to use esri-loader to create a custom map view.

### [Dojo 2+](https://dojo.io)

- [dojo-esri-loader](https://github.com/odoe/dojo-esri-loader) - Dojo 5 app with esri-loader ([blog post](https://odoe.net/blog/dojo-framework-with-arcgis-api-for-javascript/))

- [esri-dojo](https://github.com/jamesmilneruk/esri-dojo) - An example of how to use Esri Loader with Dojo 2+. This example is a simple map that allows you to place markers on it.

### [Electron](https://electron.atom.io/)

- [ng-cli-electron-esri](https://github.com/TheKeithStewart/ng-cli-electron-esri) - This project is meant to demonstrate how to run a mapping application using the ArcGIS API for JavaScript inside of Electron

#### Reusable libraries for Ember

- [ember-esri-loader](https://github.com/Esri/ember-esri-loader) - An Ember addon that wraps this library

#### Example Ember applications

See the [examples over at ember-esri-loader](https://github.com/Esri/ember-esri-loader/#examples)

### [Glimmer.js](https://glimmerjs.com/)

- [esri-glimmer-example](https://github.com/tomwayson/esri-glimmer-example) - An example of how to use the ArcGIS API for JavaScript in a https://glimmerjs.com/ application

### [Hyperapp](https://hyperapp.js.org/)

- [esri-hyperapp-example](https://github.com/jwasilgeo/esri-hyperapp-example) - An example Hyperapp application that shows how to use esri-loader to create a custom map view and component.

### [Preact](https://github.com/developit/preact)

- [esri-preact-pwa](https://github.com/tomwayson/esri-preact-pwa) - An example progressive web app (PWA) using the ArcGIS API for JavaScript built with Preact

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

- [CreateMap](https://github.com/oppoudel/CreateMap) - Create Map: City of Baltimore - https://gis.baltimorecity.gov/createmap/#/
- [City of Baltimore: Map Gallery](https://github.com/oppoudel/MapGallery_Vue) - Map Gallery built with Vue.js that uses this library to load the ArcGIS API
- [vue-jsapi4](https://github.com/odoe/vue-jsapi4) - An example of how to use the [ArcGIS API for Javascript](https://developers.arcgis.com/javascript/) in a [NUXT](https://nuxtjs.org/) application ([blog post](https://odoe.net/blog/arcgis-api-4-for-js-with-vue-cli-and-nuxt/), [video](https://youtu.be/hqJzzgM8seo))
- [esri-vue-cli-example](https://github.com/tomwayson/esri-vue-cli-example) - An example of how to use the [ArcGIS API for JavaScript 3.x](https://developers.arcgis.com/javascript/3/) in a [vue-cli](https://github.com/vuejs/vue-cli) application