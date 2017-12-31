# esri-loader Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
### Changed
- added Advanced Usage section and info on isomorphic apps to README
### Fixed
### Removed
### Breaking

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

[Unreleased]: https://github.com/Esri/esri-loader/compare/v1.6.0...HEAD
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
