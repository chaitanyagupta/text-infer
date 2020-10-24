import { toBinaryString, hexdump } from './utils';

const RENDERERS = {};

function getRenderer(value) {
  if (value instanceof ArrayBuffer) {
    return getRenderer(new Uint8Array(value));
  } else if (value instanceof Uint8Array) {
    return RENDERERS.binary;
  } else if (value instanceof URL) {
    return RENDERERS.url;
  }
  else {
    return RENDERERS.default;
  }
}

export function render(value, parser) {
  const renderer = getRenderer(value);
  return renderer(value);
}

import defaultTemplate from './renderers/default.handlebars';

RENDERERS.default = function (value) {
  return defaultTemplate({ value: value });
};

import binaryTemplate from './renderers/binary.handlebars';

RENDERERS.binary = function (value) {
  return binaryTemplate({ hexdump: hexdump(toBinaryString(value)) });
};
