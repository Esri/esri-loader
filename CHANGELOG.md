# esri-loader Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
### Changed
- fix build by not compiling @types
- update TypeScript and karma-typescript dependencies
- use GitHub Actions instead of travis.yml

### Fixed
### Removed
### Breaking

## [3.5.0] - 2022-03-29
### Added
- default to JSAPI 4.23; update docs w/ latest version numbers - @gavinr

## [3.4.0] - 2022-01-14
### Added
- default to JSAPI 4.22; update docs w/ latest version numbers - @gavinr

## [3.3.0] - 2021-09-22

## [3.2.0] - 2021-07-07
### Added
- default to JSAPI 4.20; update docs w/ latest version numbers - @gavinr

## [3.1.0] - 2021-04-23
### Added
- default to JSAPI 4.19; update docs w/ latest version numbers - @vannizhang

## [3.0.0] - 2020-12-31
### Added
- default to JSAPI 4.18; update docs w/ latest version numbers - @gavinr

### Breaking
- default version of JSAPI no longer supports IE
- remove option to set `dojoConfig`
- remove esri-loader default export

## [2.16.0] - 2020-10-13
### Added
- default to JSAPI 4.17; update docs w/ latest version numbers - @tgirgin23

## [2.15.0] - 2020-07-10
### Added
- default to JSAPI 4.16; update docs w/ latest version numbers - @JoshCrozier

## [2.14.0] - 2020-04-09
### Added
- default to JSAPI 4.15; update docs w/ latest version numbers - @JoshCrozier

## [2.13.0] - 2019-12-22

### Added
- default to JSAPI 4.14; update docs w/ latest version numbers - @gpbmike

## [2.12.0] - 2019-10-24

### Added
- `setDefaultOptions()` to set default `loadScript()` options at app startup (#192) - thanks @JoshCrozier!
### Changed
- updated README to emphasize `setDefaultOptions()` and link to the new [Framework Guides](https://developers.arcgis.com/javascript/latest/guide/using-frameworks/)

## [2.11.0] - 2019-10-14
### Added
- default to JSAPI 4.13; update docs w/ latest version numbers
- add support for "next" version of ArcGIS API

## [2.10.2] - 2019-10-12

### Changed
- added "Using Modules Synchronously" to the docs (README) - thanks [@stdavis](https://github.com/stdavis)!
### Fixed
- `css: true` uses the correct URL the light theme (`/esri/themes/light/main.css`) - thanks [@stdavis](https://github.com/stdavis)

## [2.10.1] - 2019-09-27

### Changed
- Added generics for `loadModules` typings improvements. #183 - thanks [@deskoh](https://github.com/deskoh)!

## [2.10.0] - 2019-07-03
### Added
- default to JSAPI 4.12; update docs w/ latest version numbers

## [2.9.2] - 2019-04-18

### Fixed
- window undefined in Node environments

## [2.9.1] - 2019-03-31

### Fixed
- export missing ILoadScriptOptions

## [2.9.0] - 2019-03-29
### Added
- default to JSAPI 4.11; update docs w/ latest version numbers

## [2.8.0] - 2019-03-27
### Added
- `loadScript()` takes a new `version` option to load a specific version from the CDN
- passing `css: true` to `loadScript()` will load the styles for the CDN version
- `loadCss()` defaults to loading the latest 4.x styles if no arguments are passed
- `loadCss()` can take a version as a string to load a version's styles from the CDN
### Changed
- split source code into modules
- tests are now written in TypeScript and loaded via karma-typescript
- updated to recent versions of TypeScript, Karma, & Jasmine

## [2.7.0] - 2019-03-26
### Added
- `insertCssBefore` option to insert CSS link before an existing element

## [2.6.0] - 2018-12-17

### Added
- default to JSAPI 4.10; update docs w/ latest version numbers

## [2.5.0] - 2018-09-29

### Changed
- default to JSAPI 4.9; update docs w/ latest version numbers

## [2.4.0]

### Changed
- default to JSAPI 4.8; update docs w/ latest version numbers

## [2.3.0]
### Added
- default to JSAPI 4.7; update docs w/ latest version numbers
### Changed
- added Hyperapp example link to README
- move CSS functions into own module
- no longer publishing src folder b/c it is not needed

## [2.2.0] - 2018-02-07
### Added
- `loadScript()` takes a `css` option to load stylesheet by URL
### Changed
- added Choo and Riot example links to README

## [2.1.0] - 2018-02-06
### Added
- added loadCss(url) to inject a stylesheet link
### Changed
- added GitHub issue and pull request templates
- added badges to README
- added section on updating from previous versions to README
- added reusable library sections for Angular and React
- added links to ember-esri-loader examples and CanJS
- changed npm scripts to rely on rimraf and mkdirp for Windows support
- check in yarn.lockfile and use yarn

## [2.0.0] - 2018-01-04

### Changed
- misc README updates

### Breaking
- remove deprecated bootstrap() and dojoRequire() functions
- isLoaded() no longer checks if the script exists
- no longer distribute builds at dist root

## [1.7.0] - 2018-01-03
### Added
- make getScript() a public API [#44](https://github.com/Esri/esri-loader/issues/44)
### Changed
- Add link to esri-vue-cli-example to README

## [1.6.2] - 2018-01-02

### Fixed
- fallback to current url when loading modules [#51](https://github.com/Esri/esri-loader/issues/51) [#61](https://github.com/Esri/esri-loader/issues/61)

## [1.6.1] - 2018-01-01

### Changed
- added Advanced Usage section and info on isomorphic apps to README
### Fixed
- `script.dataset` is `undefined` in IE10 [#67](https://github.com/Esri/esri-loader/pull/67)

## [1.6.0] - 2017-12-31
### Added
- default to version 4.6 of the ArcGIS API [#63](https://github.com/Esri/esri-loader/issues/63)
### Changed
- remove remaining references to angular-esri-loader from README
- update README w/ info on arcgis types and browser support [#60](https://github.com/Esri/esri-loader/issues/60)
### Fixed
- window undefined error in server-rendered apps [#64](https://github.com/Esri/esri-loader/issues/64)

## [1.5.3] - 2017-11-20

### Changed
- use rollup's uglify plugin for minified umd build
- don't generate sourcemaps when compiling TypeScript
### Fixed
- re-include umd at dist root to avoid breaking apps w/ hardcoded path

## [1.5.2] - 2017-11-18

### Fixed
- uglify sourcemap url uses relative path

## [1.5.1] - 2017-11-17

### Changed
- output esm and .d.ts to dist folder, only include dist/src when publishing

## [1.5.0] - 2017-11-09
### Added
- add promise-based functions to load the script and modules
### Changed
- deprecate `bootstrap()` and `dojoRequire()`
- add code coverage
- add release script

## [1.4.0] - 2017-11-07

### Added
- handle script load errors

## [1.3.0]

### Added
- set `window.dojoConfig` by passing as an option to `bootstrap()`

### Changed
- no longer running tests in phantom

## [1.2.1]

### Fixed
- defintion of `dojoRequire()`'s callback

## [1.2.0]

### Added
- default to version 4.5 of the ArcGIS API

### Fixed
- don't throw an error when `bootstrap()` is called multiple times w/o a callback

### Changed
- lint source before running build

## [1.1.0]

### Added
- default to version 4.4 of the ArcGIS API

## [1.0.0]

### Changed
- `isLoaded()` only returns true if the script tag has the `data-esri-loader` attribute

## [0.3.1]

### Fixed
- fixed no callback bug

### Support
- added unit tests
- add a minified build and source maps for published releases

## [0.3.0]

### Added
- add default export

### Fixed
- build outputs es5/umd (main) and es5/esm (module)

## [0.2.0]

### Added
- enable pre-loading the ArcGIS API
- default to version 4.3 of the ArcGIS API

## [0.1.3]

### Fixed
- default to version 4.2 of the ArcGIS API
- use HTTPS by default

## [0.1.2]

### Fixed
- finally got `import from 'esri-loader' working from Angular/TS apps

## 0.1.1

### Fixed
- try to fix Error: Cannot find module "." in consuming TS apps

## 0.1.0

### Added
- copied over source from angular-cli-esri and set up TS build

[Unreleased]: https://github.com/Esri/esri-loader/compare/v3.5.0...HEAD
[3.5.0]: https://github.com/Esri/esri-loader/compare/v3.4.0...v3.5.0
[3.4.0]: https://github.com/Esri/esri-loader/compare/v3.3.0...v3.4.0
[3.3.0]: https://github.com/Esri/esri-loader/compare/v3.2.0...v3.3.0
[3.2.0]: https://github.com/Esri/esri-loader/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/Esri/esri-loader/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/Esri/esri-loader/compare/v2.16.0...v3.0.0
[2.16.0]: https://github.com/Esri/esri-loader/compare/v2.15.0...v2.16.0
[2.15.0]: https://github.com/Esri/esri-loader/compare/v2.14.0...v2.15.0
[2.14.0]: https://github.com/Esri/esri-loader/compare/v2.13.0...v2.14.0
[2.13.0]: https://github.com/Esri/esri-loader/compare/v2.12.0...v2.13.0
[2.12.0]: https://github.com/Esri/esri-loader/compare/v2.11.0...v2.12.0
[2.11.0]: https://github.com/Esri/esri-loader/compare/v2.10.2...v2.11.0
[2.10.2]: https://github.com/Esri/esri-loader/compare/v2.10.1...v2.10.2
[2.10.1]: https://github.com/Esri/esri-loader/compare/v2.10.0...v2.10.1
[2.10.0]: https://github.com/Esri/esri-loader/compare/v2.9.2...v2.10.0
[2.9.2]: https://github.com/Esri/esri-loader/compare/v2.9.1...v2.9.2
[2.9.1]: https://github.com/Esri/esri-loader/compare/v2.9.0...v2.9.1
[2.9.0]: https://github.com/Esri/esri-loader/compare/v2.8.0...v2.9.0
[2.8.0]: https://github.com/Esri/esri-loader/compare/v2.7.0...v2.8.0
[2.7.0]: https://github.com/Esri/esri-loader/compare/v2.6.0...v2.7.0
[2.6.0]: https://github.com/Esri/esri-loader/compare/v2.5.0...v2.6.0
[2.5.0]: https://github.com/Esri/esri-loader/compare/v2.4.0...v2.5.0
[2.4.0]: https://github.com/Esri/esri-loader/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/Esri/esri-loader/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/Esri/esri-loader/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/Esri/esri-loader/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/Esri/esri-loader/compare/v1.7.0...v2.0.0
[1.7.0]: https://github.com/Esri/esri-loader/compare/v1.6.2...v1.7.0
[1.6.2]: https://github.com/Esri/esri-loader/compare/v1.6.1...v1.6.2
[1.6.1]: https://github.com/Esri/esri-loader/compare/v1.6.0...v1.6.1
[1.6.0]: https://github.com/Esri/esri-loader/compare/v1.5.3...v1.6.0
[1.5.3]: https://github.com/Esri/esri-loader/compare/v1.5.2...v1.5.3
[1.5.2]: https://github.com/Esri/esri-loader/compare/v1.5.1...v1.5.2
[1.5.1]: https://github.com/Esri/esri-loader/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/Esri/esri-loader/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/Esri/esri-loader/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/Esri/esri-loader/compare/v1.2.1...v1.3.0
[1.2.1]: https://github.com/Esri/esri-loader/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/Esri/esri-loader/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/Esri/esri-loader/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Esri/esri-loader/compare/v0.3.1...v1.0.0
[0.3.1]: https://github.com/Esri/esri-loader/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/Esri/esri-loader/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Esri/esri-loader/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/Esri/esri-loader/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/Esri/esri-loader/tree/v0.1.2
