// allow consuming libraries to provide their own Promise implementations
export default {
  Promise: window && window['Promise']
};
