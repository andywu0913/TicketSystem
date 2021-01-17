import JWTDecode from 'jwt-decode';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const EXPIRES_IN = 'expires_in';

export function saveAccessToken(accessToken) {
  localStorage.setItem(ACCESS_TOKEN, accessToken);
}

export function saveRefreshToken(refreshToken) {
  localStorage.setItem(REFRESH_TOKEN, refreshToken);
}

export function saveExpiration(expiresIn) {
  const exp = new Date();
  exp.setSeconds(exp.getSeconds() + expiresIn[0]); // expiresIn = [time, unit]
  localStorage.setItem(EXPIRES_IN, exp.getTime());
}

export function verifySaved() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN);
  const expiresIn = localStorage.getItem(EXPIRES_IN);

  if (!accessToken || !refreshToken || !expiresIn) {
    return false;
  }

  const exp1 = new Date(parseInt(expiresIn));
  if (isNaN(exp1) || (exp1 - new Date() < 0)) {
    return false;
  }

  const jwt = JWTDecode(accessToken);
  const iat = new Date(jwt.iat * 1000);
  const exp2 = new Date(jwt.exp * 1000);
  const now = new Date();
  if (now < iat || now > exp2) {
    return false;
  }

  return true;
}

export function clearSaved() {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(EXPIRES_IN);
}

export function getAccessToken() {
  if (!verifySaved()) {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN);
}

export function getRefreshToken() {
  if (!verifySaved()) {
    return null;
  }

  return localStorage.getItem(REFRESH_TOKEN);
}

export function getExpiration() {
  if (!verifySaved()) {
    return null;
  }

  const exp = localStorage.getItem(EXPIRES_IN);
  return parseInt(exp);
}

export function getUserId() {
  const accessToken = getAccessToken();
  if (accessToken === null) {
    return null;
  }

  const jwt = JWTDecode(accessToken);
  return jwt.user_id;
}

export function getUserName() {
  const accessToken = getAccessToken();
  if (accessToken === null) {
    return null;
  }

  const jwt = JWTDecode(accessToken);
  return jwt.name;
}

export function getUserRole() {
  const accessToken = getAccessToken();
  if (accessToken === null) {
    return -1; // -1 means guest
  }

  const jwt = JWTDecode(accessToken);
  return jwt.role;
}

export default {
  saveAccessToken,
  saveRefreshToken,
  saveExpiration,
  verifySaved,
  clearSaved,
  getAccessToken,
  getRefreshToken,
  getExpiration,
  getUserId,
  getUserName,
  getUserRole,
};
