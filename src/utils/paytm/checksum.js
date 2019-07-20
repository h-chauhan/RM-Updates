import { log } from 'util';
import { createHash } from 'crypto';
import { genSalt, encrypt, decrypt } from './crypt';

const mandatoryParams = [];

// mandatory flag: when it set, only mandatory parameters are added to checksum

function paramsToString(params, mandatoryflag) {
  let data = '';
  const tempKeys = Object.keys(params);
  tempKeys.sort();
  tempKeys.forEach((key) => {
    let value = params[key];
    if (params[key].includes('REFUND') || params[key].includes('|')) {
      value = '';
    }
    if (key !== 'CHECKSUMHASH') {
      if (params[key] === 'null') value = '';
      if (!mandatoryflag || mandatoryParams.indexOf(key) !== -1) {
        data += (`${value}|`);
      }
    }
  });
  return data;
}

export function genchecksum(params, key) {
  const data = paramsToString(params);
  return new Promise((resolve) => {
    genSalt(4, (err, salt) => {
      const sha256 = createHash('sha256').update(data + salt).digest('hex');
      const checkSum = sha256 + salt;
      const encrypted = encrypt(checkSum, key);
      resolve(encrypted);
    });
  });
}

export function genchecksumbystring(params, key) {
  return new Promise((resolve) => {
    genSalt(4, (err, salt) => {
      const sha256 = createHash('sha256').update(`${params}|${salt}`).digest('hex');
      const checkSum = sha256 + salt;
      const encrypted = encrypt(checkSum, key);
      let CHECKSUMHASH = encodeURIComponent(encrypted);
      CHECKSUMHASH = encrypted;
      resolve(CHECKSUMHASH);
    });
  });
}

export function verifychecksum(params, key, checksumhash) {
  const data = paramsToString(params, false);

  // TODO: after PG fix on thier side remove below two lines
  if (checksumhash) {
    const temp = decodeURIComponent(checksumhash.replace('\n', '').replace('\r', ''));
    const checksum = decrypt(temp, key);
    const salt = checksum.substr(checksum.length - 4);
    const sha256 = checksum.substr(0, checksum.length - 4);
    const hash = createHash('sha256').update(data + salt).digest('hex');
    if (hash === sha256) {
      return true;
    }
    log('checksum is wrong');
    return false;
  }
  log('checksum not found');
  return false;
}

export function verifychecksumbystring(params, key, checksumhash) {
  const checksum = decrypt(checksumhash, key);
  const salt = checksum.substr(checksum.length - 4);
  const sha256 = checksum.substr(0, checksum.length - 4);
  const hash = createHash('sha256').update(`${params}|${salt}`).digest('hex');
  if (hash === sha256) {
    return true;
  }
  log('checksum is wrong');
  return false;
}

function paramsToStringrefund(params, mandatoryflag) {
  let data = '';
  const tempKeys = Object.keys(params);
  tempKeys.sort();
  tempKeys.forEach((key) => {
    let value = params[key];
    if (params[key].includes('|')) {
      value = '';
    }
    if (key !== 'CHECKSUMHASH') {
      if (params[key] === 'null') value = '';
      if (!mandatoryflag || mandatoryParams.indexOf(key) !== -1) {
        data += (`${value}|`);
      }
    }
  });
  return data;
}

export function genchecksumforrefund(params, key) {
  const data = paramsToStringrefund(params);
  return new Promise((resolve) => {
    genSalt(4, (err, salt) => {
      const sha256 = createHash('sha256').update(data + salt).digest('hex');
      const checkSum = sha256 + salt;
      const encrypted = encrypt(checkSum, key);
      resolve({
        ...params,
        CHECKSUM: encodeURIComponent(encrypted),
      });
    });
  });
}
