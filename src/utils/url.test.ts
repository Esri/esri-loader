import { getCdnCssUrl, getCdnUrl } from './url';

describe ('when getting CDN URLs', () => {
  describe('for the script', () => {
    describe('with no arguments', () => {
      it('should default to latest 4.x URL', () => {
        expect(getCdnUrl()).toEqual('https://js.arcgis.com/4.16/');
      });
    });
    describe('with a valid version', () => {
      it('should return URL for that version', () => {
        expect(getCdnUrl('3.34')).toEqual('https://js.arcgis.com/3.34/');
      });
    });
    // TODO: what about an invalid version? should we throw?
  });
  describe('for the CSS', () => {
    describe('with no arguments', () => {
      it('should default to the latest 4.x CSS URL', () => {
        expect(getCdnCssUrl()).toEqual('https://js.arcgis.com/4.16/esri/themes/light/main.css');
      });
    });
    describe('for 3.x version >= 3.11', () => {
      it('should return the CSS URL for that version', () => {
        expect(getCdnCssUrl('3.34')).toEqual('https://js.arcgis.com/3.34/esri/css/esri.css');
      });
    });
    describe('for version < 3.11', () => {
      it('should return the CSS URL for that version', () => {
        expect(getCdnCssUrl('3.10')).toEqual('https://js.arcgis.com/3.10/js/esri/css/esri.css');
      });
    });
  });
});
