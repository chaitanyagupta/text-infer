import * as base64 from 'base64-arraybuffer';

const DETECTORS = {};
const PARSERS = {}

export function detect(str) {
  const matched = [];
  const context = {};
  Object.keys(DETECTORS).forEach(name => {
    const detector = DETECTORS[name];
    if (detector(str, context)) {
      matched.push(name);
    }
  });
  return { detectors: matched, context: context };
}

export function parse(str, parsers, context) {
  const results = {};
  parsers.forEach(name => {
    const parser = PARSERS[name];
    const parsed = parser(str, context);
    if (parsed) {
      results[name] = parsed;
    }
  });
  return results;
}

export function infer(str) {
  let { detectors, context } = detect(str);
  return parse(str, detectors, context);
}

// hex

const HEX_REGEX = /^[0-9abcdef]+$/i;

DETECTORS.hex = function (str) {
  str = str.split('\n').join('');
  return str.length % 2 === 0 && str.match(HEX_REGEX);
};

PARSERS.hex = function (str) {
  str = str.split('\n').join('');
  const bytes = new Uint8Array(str.length / 2);
  for (let c = 0; c < str.length; c += 2) {
    bytes[c/2] = parseInt(str.substr(c, 2), 16);
  }
  return bytes;
};

// base64

const BASE64_REGEX = /^[A-Za-z0-9+/_-]+=?=?$/;

DETECTORS.base64 = function (str) {
  // Get rid of newlines if any
  str = str.split('\n').join('');
  return str.length % 4 === 0 && str.match(BASE64_REGEX);
};

PARSERS.base64 = function(str) {
  str = str.split('\n').join('');
  return base64.decode(str);
};

// URL

DETECTORS.url = function (str, context) {
  let url = null;
  try {
    url = new URL(str);
  } catch (e) {
    if (e instanceof TypeError) {
      return false
    } else {
      throw e;
    }
  }
  context.url = url;
  return true;
};

PARSERS.url = function (str, context) {
  let url = context.url || new URL(str);
  return {
    _type: 'url',
    protocol: url.protocol,
    username: url.username,
    password: url.password,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    hash: url.hash,
    search: url.search,
    searchParams: (function () {
      let entries = [];
      for (let entry of url.searchParams.entries()) {
        entries.push(entry);
      }
      return entries;
    })()
  };
};

// JWS

DETECTORS.jws = function (str) {
  const parts = str.split('.')
  if (parts.length === 3) {
    return parts.every(part => part.match(BASE64_REGEX));
  } else {
    return false;
  }
};

PARSERS.jws = function (str) {
  const parts = str.split('.')
  if (parts.length === 3) {
    const headerStr = new TextDecoder('utf-8').decode(base64.decode(parts[0]));
    const payloadStr = new TextDecoder('utf-8').decode(base64.decode(parts[1]));
    let header = null;
    let payload = null;
    try {
      header = JSON.parse(headerStr);
      payload = JSON.parse(payloadStr);
    } catch (e) {
      if (e instanceof SyntaxError) {
        return null;
      } else {
        throw e;
      }
    }
    return {
      _type: 'jws',
      header,
      payload
    };
  } else {
    return null;
  }
};
