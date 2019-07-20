import {
  createCipheriv, createDecipheriv, randomBytes,
} from 'crypto';
import { log, inspect } from 'util';

const iv = '@@@@&&&&####$$$$';

export function encrypt(data, customKey) {
  const key = customKey;
  let algo = '256';
  switch (key.length) {
    case 16:
      algo = '128';
      break;
    case 24:
      algo = '192';
      break;
    case 32:
      algo = '256';
      break;
    default:
      break;
  }
  const cipher = createCipheriv(`AES-${algo}-CBC`, key, iv);
  // var cipher = crypto.createCipher('aes256',key);
  let encrypted = cipher.update(data, 'binary', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

export function decrypt(data, customKey) {
  const key = customKey;
  let algo = '256';
  switch (key.length) {
    case 16:
      algo = '128';
      break;
    case 24:
      algo = '192';
      break;
    case 32:
      algo = '256';
      break;
    default:
      break;
  }
  const decipher = createDecipheriv(`AES-${algo}-CBC`, key, iv);
  let decrypted = decipher.update(data, 'base64', 'binary');
  try {
    decrypted += decipher.final('binary');
  } catch (e) {
    log(inspect(e));
  }
  return decrypted;
}

export function genSalt(length, cb) {
  randomBytes((length * 3.0) / 4.0, (err, buf) => {
    let salt;
    if (!err) {
      salt = buf.toString('base64');
    }
    // salt=Math.floor(Math.random()*8999)+1000;
    cb(err, salt);
  });
}

/* one way md5 hash with salt */
// function md5sum(salt, data) {
//   return createHash('md5').update(salt + data).digest('hex');
// }

// function sha256sum(salt, data) {
//   return createHash('sha256').update(data + salt).digest('hex');
// }
