import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from '../node_modules/typescript/lib/typescript.js';

function compile(path, bindings = {}) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2017,
  } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, ...bindings });
  return exports;
}
const config = compile('../src/lib/homeMotion.ts');

function harness({ reduced = false, desktop = true } = {}) {
  const listeners = new Map();
  const eventTarget = (prefix) => ({
    addEventListener(name, callback) { listeners.set(`${prefix}:${name}`, callback); },
    removeEventListener(name) { listeners.delete(`${prefix}:${name}`); },
  });
  const media = (matches, name) => ({ matches, ...eventTarget(name) });
  const preference = media(reduced, 'reduced');
  const screen = media(desktop, 'desktop');
  const played = [];
  class Element {
    constructor(kind) {
      this.kind = kind;
      this.classList = { contains: (value) => value === kind };
      this.values = new Map();
      this.style = { setProperty: (key, value) => this.values.set(key, value), removeProperty: (key) => this.values.delete(key) };
    }
    hasAttribute(name) { return this.kind === 'decoration' && name === 'data-hangul-parallax'; }
    contains(node) { return node === this; }
    getBoundingClientRect() { throw new Error('Motion controller must not force layout reads'); }
    querySelectorAll() { return []; }
    querySelector() { return null; }
    animate(frames, options) {
      const record = { frames, options, canceled: false, cancel() { this.canceled = true; } };
      played.push(record);
      return record;
    }
  }
  const category = new Element('culture-category');
  const decoration = new Element('decoration');
  const scope = {
    ...eventTarget('scope'),
    querySelectorAll(selector) {
      if (selector === '.culture-category') return [category];
      if (selector === '[data-hangul-parallax]') return [decoration];
      return [category, decoration];
    },
  };
  let intersection;
  let disconnected = false;
  let cleanup;
  let frameCallback;
  const document = { hidden: false, activeElement: null, ...eventTarget('document') };
  const window = {
    innerHeight: 800,
    IntersectionObserver: true,
    matchMedia: (query) => query === config.homeMotion.reducedQuery ? preference : screen,
    requestAnimationFrame(callback) { frameCallback = callback; return 1; },
    cancelAnimationFrame() { frameCallback = undefined; },
    ...eventTarget('window'),
  };
  const component = compile('../src/components/home/HomeMotion.tsx', {
    window, document, HTMLElement: Element, Node: Element,
    IntersectionObserver: class {
      constructor(callback) { intersection = callback; }
      observe() {}
      unobserve() {}
      disconnect() { disconnected = true; }
    },
    require(name) {
      if (name === '@/lib/homeMotion') return config;
      if (name === 'react') return { useRef: () => ({ current: scope }), useEffect: (effect) => { cleanup = effect(); } };
      if (name === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }) };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  const rendered = component.default({ children: 'Always-visible content' });
  return { category, decoration, played, preference, document, listeners, rendered,
    intersect(element, isIntersecting = true) { intersection([{ target: element, isIntersecting }]); },
    flushFrame() { const callback = frameCallback; frameCallback = undefined; callback?.(); },
    cleanup() { cleanup(); assert.equal(disconnected, true); },
  };
}

test('reduced motion preserves content and starts no animation or scroll listener', () => {
  const h = harness({ reduced: true });
  assert.equal(h.rendered.props.children, 'Always-visible content');
  h.intersect(h.category);
  h.intersect(h.decoration);
  assert.equal(h.played.length, 0);
  assert.equal(h.listeners.has('window:scroll'), false);
  h.cleanup();
  assert.equal(h.listeners.size, 0);
});

test('reveal does not repeat while visible and cancels when reduced motion is enabled', () => {
  const h = harness();
  h.intersect(h.category);
  h.intersect(h.category);
  assert.equal(h.played.length, 1);
  assert.equal(h.played[0].options.duration, 600);
  h.preference.matches = true;
  h.listeners.get('reduced:change')();
  assert.equal(h.played[0].canceled, true);
  h.cleanup();
});

test('mobile never attaches scroll-linked parallax', () => {
  const h = harness({ desktop: false });
  h.intersect(h.decoration);
  assert.equal(h.listeners.has('window:scroll'), false);
  assert.equal(h.decoration.values.size, 0);
  h.cleanup();
});

test('desktop decoration needs no JavaScript scroll listeners or layout measurements', () => {
  const h = harness();
  h.intersect(h.category);
  assert.equal(h.listeners.has('window:scroll'), false);
  assert.equal(h.listeners.has('window:resize'), false);
  h.cleanup();
  assert.equal(h.listeners.size, 0);
});

test('keyboard focus cancels a moving card', () => {
  const h = harness();
  h.intersect(h.category);
  h.listeners.get('scope:focusin')({ target: h.category });
  assert.equal(h.played[0].canceled, true);
  h.cleanup();
});


test('background tabs cancel motion and detach parallax listeners', () => {
  const h = harness();
  h.intersect(h.category);
  h.intersect(h.decoration);
  h.document.hidden = true;
  h.listeners.get('document:visibilitychange')();
  assert.equal(h.played[0].canceled, true);
  assert.equal(h.listeners.has('window:scroll'), false);
  assert.equal(h.decoration.values.size, 0);
  h.cleanup();
});


test('reveal replays after leaving the viewport and returning', () => {
  const h = harness();
  h.intersect(h.category);
  h.intersect(h.category, false);
  assert.equal(h.played[0].canceled, true);
  h.intersect(h.category);
  assert.equal(h.played.length, 2);
  h.cleanup();
});
