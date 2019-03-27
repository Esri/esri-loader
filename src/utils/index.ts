/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

// allow consuming libraries to provide their own Promise implementations
export default {
  Promise: window && window['Promise']
};
