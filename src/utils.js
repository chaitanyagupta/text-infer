export function toBinaryString(bytes) {
  if (bytes instanceof Uint8Array || Array.isArray(bytes)) {
    let str = '';
    bytes.forEach(c => str += String.fromCharCode(c));
    return str;
  }
  else if (bytes instanceof ArrayBuffer) {
    return toBinaryString(new Uint8Array(bytes));
  } else if (ArrayBuffer.isView(bytes)) {
    return toBinaryString(bytes.buffer);
  }
};
