
function createStylesheetLink(href: string): HTMLLinkElement {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  return link;
}

function insertLink(link: HTMLLinkElement, before?: string) {
  if (before) {
    // the link should be inserted before a specific node
    const beforeNode = document.querySelector(before);
    beforeNode.parentNode.insertBefore(link, beforeNode);
  } else {
    // append the link to then end of the head tag
    document.head.appendChild(link);
  }
}

// check if the css url has been injected or added manually
function getCss(url) {
  return document.querySelector(`link[href*="${url}"]`) as HTMLLinkElement;
}

// lazy load the CSS needed for the ArcGIS API
export function loadCss(url: string, before?: string) {
  let link = getCss(url);
  if (!link) {
    // create & load the css link
    link = createStylesheetLink(url);
    insertLink(link, before);
  }
  return link;
}
