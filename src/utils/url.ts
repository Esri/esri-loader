/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

const DEFAULT_VERSION = '4.18';
const NEXT = 'next';

export function parseVersion(version) {
  if (version.toLowerCase() === NEXT) {
    return NEXT;
  }

  const match = version && version.match(/^(\d)\.(\d+)/);
  return match && {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10)
  };
}

/**
 * Get the CDN url for a given version
 *
 * @param version Ex: '4.18' or '3.35'. Defaults to the latest 4.x version.
 */
export function getCdnUrl(version = DEFAULT_VERSION) {
  return `https://js.arcgis.com/${version}/`;
}

/**
 * Get the CDN url for a the CSS for a given version and/or theme
 *
 * @param version Ex: '4.18', '3.35', or 'next'. Defaults to the latest 4.x version.
 */
export function getCdnCssUrl(version = DEFAULT_VERSION) {
  const baseUrl = getCdnUrl(version);
  const parsedVersion = parseVersion(version);
  if (parsedVersion !== NEXT && parsedVersion.major === 3) {
    // NOTE: at 3.11 the CSS moved from the /js folder to the root
    const path = parsedVersion.minor <= 10 ? 'js/' : '';
    return `${baseUrl}${path}esri/css/esri.css`;
  } else {
    // assume 4.x
    return `${baseUrl}esri/themes/light/main.css`;
  }
}
