import jschardet from 'jschardet';
import { toBinaryString } from './utils';


export function detect(bytes) {
  const isAsciiByte = (byte) => {
    return ([0x09, 0x0a, 0x0d].indexOf(byte) != -1
            || (byte >= 0x20 && byte <= 0x7e));
  };
  if (bytes.every(isAsciiByte)) {
    return 'ascii';
  } else {
    const bstring = toBinaryString(bytes);
    const detected = jschardet.detect(bstring);
    if (detected) {
      return detected.encoding === 'ascii' ? null : detected.encoding;
    } else {
      return null;
    }
  }
};
