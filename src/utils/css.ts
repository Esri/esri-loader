
function createStylesheetLink(url) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  return link;
}

function insertLink(link, before?) {
  // if we need to insert before an existing link, get all link tags
  const allLinks = (before || before === 0) && document.getElementsByTagName('link');
  if (allLinks) {
    // insert the link before the link tag
    const beforeLink = allLinks[before];
    beforeLink.parentNode.insertBefore(link, beforeLink);
  } else {
    // append the link to then end of the head tag
    document.head.appendChild(link);
  }
}

// check if the css url has been injected or added manually
function getCss(url) {
  return document.querySelector(`link[href*="${url}"]`) as HTMLLinkElement;
}

export interface ILoadCssOptions {
  url: string;
  before?: number;
}

// lazy load the CSS needed for the ArcGIS API
export function loadCss(css: string | ILoadCssOptions) {
  const url = typeof css === 'string' ? css : css.url;
  let link = getCss(url);
  if (!link) {
    // create & load the css link
    link = createStylesheetLink(url);
    insertLink(link, (css as ILoadCssOptions).before);
  }
  return link;
}
