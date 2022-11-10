/* Copyright (c) 2022 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

const isBrowser = typeof window !== 'undefined';

// allow consuming libraries to provide their own Promise implementations
export default {
  Promise: isBrowser ? window['Promise'] : undefined
};
