/*
  Copyright (c) 2017 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

// re-export the functions that are part of the public API
import { loadModules } from './modules.ts';
import { getScript, isLoaded, loadScript, setDefaultOptions } from './script.ts';
import { loadCss } from './utils/css.ts';
import utils from './utils/index.ts';
export { getScript, isLoaded, loadModules, loadScript, loadCss, setDefaultOptions, utils };
export { ILoadScriptOptions } from './script.ts';

// NOTE: rollup ignores the default export
// and builds the UMD namespace out of the above named exports
// so this is only needed so that consumers of the ESM build
// can do esriLoader.loadModules(), etc
// TODO: remove this next breaking change
export default {
  getScript,
  isLoaded,
  loadModules,
  loadScript,
  loadCss,
  setDefaultOptions,
  utils
};
