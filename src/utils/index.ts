const isBrowser = typeof window !== 'undefined';

// allow consuming libraries to provide their own Promise implementations
export default {
  Promise: isBrowser ? window['Promise'] : undefined
};
