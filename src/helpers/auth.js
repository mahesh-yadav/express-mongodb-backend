import crypto from 'crypto';

export function encryptPassword(password, salt) {
  try {
    return crypto
      .createHmac('sha1', salt)
      .update(password)
      .digest('hex');
  } catch (error) {
    console.log(error);
    return '';
  }
}

export function makeSalt() {
  return Math.round(new Date().valueOf() * Math.random()) + '';
}

export function authenticate(password, hashedPassword, salt) {
  return encryptPassword(password, salt) === hashedPassword;
}
