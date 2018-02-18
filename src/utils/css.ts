
function createStylesheetLink(url) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  return link;
}

// TODO: export this function?
// check if the css url has been injected or added manually
function getCss(url) {
  return document.querySelector(`link[href*="${url}"]`) as HTMLLinkElement;
}

// lazy load the CSS needed for the ArcGIS API
export function loadCss(url) {
  let link = getCss(url);
  if (!link) {
    // create & load the css library
    link = createStylesheetLink(url);
    document.head.appendChild(link);
  }
  return link;
}
