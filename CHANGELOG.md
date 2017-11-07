# esri-loader Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

### Added
- set `window.dojoConfig` by passing as an option to `bootstrap()`

## 1.2.1

### Fixed
- defintion of `dojoRequire()`'s callback

## 1.2.0

### Added
- default to version 4.5 of the ArcGIS API

### Fixed
- don't throw an error when `bootstrap()` is called multiple times w/o a callback

### Changed
- lint source before running build

## 1.1.0

### Added
- default to version 4.4 of the ArcGIS API

## 1.0.0

### Changed
- `isLoaded()` only returns true if the script tag has the `data-esri-loader` attribute

## 0.3.1

### Fixed
- fixed no callback bug

### Support
- added unit tests
- add a minified build and source maps for published releases

## 0.3.0

### Added
- add default export

### Fixed
- build outputs es5/umd (main) and es5/esm (module)

## 0.2.0

### Added
- enable pre-loading the ArcGIS API
- default to version 4.3 of the ArcGIS API

## 0.1.3

### Fixed
- default to version 4.2 of the ArcGIS API
- use HTTPS by default

## 0.1.2

### Fixed
- finally got `import from 'esri-loader' working from Angular/TS apps

## 0.1.1

### Fixed
- try to fix Error: Cannot find module "." in consuming TS apps

## 0.1.0

### Added
- copied over source from angular-cli-esri and set up TS build
