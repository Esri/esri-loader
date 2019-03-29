import { loadCss } from './css';

describe('when loading the css', () => {
  describe('with no arguments', () => {
    const url = 'https://js.arcgis.com/4.11/esri/css/main.css';
    let link;
    beforeAll(() => {
      spyOn(document.head, 'appendChild').and.stub();
      spyOn(document, 'querySelector');
      link = loadCss();
    });
    it('should have checked if the link was already appended', () => {
      expect((document.querySelector as jasmine.Spy).calls.argsFor(0)[0]).toEqual(`link[href*="${url}"]`);
    });
    it('should have set the href', () => {
      expect(link.href).toEqual(url);
    });
    it('should not have set the rel', () => {
      expect(link.rel).toEqual('stylesheet');
    });
  });
  describe('with a version', () => {
    const url = 'https://js.arcgis.com/4.8/esri/css/main.css';
    let link;
    beforeAll(() => {
      spyOn(document.head, 'appendChild').and.stub();
      spyOn(document, 'querySelector');
      link = loadCss('4.8');
    });
    it('should have checked if the link was already appended', () => {
      expect((document.querySelector as jasmine.Spy).calls.argsFor(0)[0]).toEqual(`link[href*="${url}"]`);
    });
    it('should have set the href', () => {
      expect(link.href).toEqual(url);
    });
    it('should not have set the rel', () => {
      expect(link.rel).toEqual('stylesheet');
    });
  });
  describe('with a url', () => {
    const url = 'http://server/path/to/esri/css/main.css';
    let link;
    beforeAll(() => {
      spyOn(document.head, 'appendChild').and.stub();
      spyOn(document, 'querySelector');
      link = loadCss(url);
    });
    it('should have checked if the link was already appended', () => {
      expect((document.querySelector as jasmine.Spy).calls.argsFor(0)[0]).toEqual(`link[href*="${url}"]`);
    });
    it('should have set the href', () => {
      expect(link.href).toEqual(url);
    });
    it('should not have set the rel', () => {
      expect(link.rel).toEqual('stylesheet');
    });
  });
  describe('when called twice', () => {
    describe('when loading the same url', () => {
      const url = 'https://js.arcgis.com/4.11/esri/css/main.css';
      let link;
      let link2;
      beforeAll(() => {
        spyOn(document.head, 'appendChild').and.stub();
        link = loadCss(url);
        spyOn(document, 'querySelector').and.returnValue(link);
        link2 = loadCss(url);
      });
      it('should return the link if it is already loaded', () => {
        expect(link2).toEqual(link);
      });
      it('should not have tried to append the link a second time', () => {
        expect((document.head.appendChild as jasmine.Spy).calls.count()).toEqual(1);
      });
    });
  });
  describe('when inserting before an existing node', () => {
    const url = 'https://js.arcgis.com/4.11/esri/css/main.css';
    // insert before the first <style> tag
    const before = 'style';
    let link;
    const mockBeforeLink = {
      parentNode: {
        /* tslint:disable no-empty */
        insertBefore: (node, beforeNode) => {}
        /* tslint:enable no-empty */
      }
    };
    beforeAll(() => {
      spyOn(document, 'querySelector').and.callFake((selector) => {
        if (selector === before) {
          return mockBeforeLink;
        } else {
          return null;
        }
      });
      spyOn(mockBeforeLink.parentNode, 'insertBefore');
      link = loadCss(url, before);
    });
    it('should have queried for the selector', () => {
      expect((document.querySelector as jasmine.Spy).calls.argsFor(1)[0]).toEqual(before);
    });
    it('should have inserted before the mock node', () => {
      expect((mockBeforeLink.parentNode.insertBefore as jasmine.Spy).calls.argsFor(0)[0]).toEqual(link);
    });
  });
});
