import { toBinaryString, hexdump } from './utils';

const RENDERERS = {};

function getRenderer(value) {
  if (value instanceof ArrayBuffer) {
    return getRenderer(new Uint8Array(value));
  } else if (value instanceof Uint8Array) {
    return RENDERERS.binary;
  } else if (value instanceof URL) {
    return RENDERERS.url;
  } else {
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

import urlTemplate from './renderers/url.handlebars';

RENDERERS.url = function (url) {
  const urlSearchParamsContext = searchParams => {
    let result = [];
    for (let entry of searchParams.entries()) {
      result.push({ name: entry[0], values: entry[1] });
    }
    return result;
  };

  return urlTemplate({ 
    scheme: url.protocol,
    username: url.username,
    password: url.password,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    searchParams: urlSearchParamsContext(url.searchParams),
    hash: url.hash
  });
}
