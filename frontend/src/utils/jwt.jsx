import axios from 'axios';
import JWTDecode from 'jwt-decode';

import BackendURL from 'BackendURL';

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

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN);
}

export function getExpiration() {
  const exp = localStorage.getItem(EXPIRES_IN);
  if (exp === null || exp === 'null') {
    return null;
  }
  return parseInt(exp, 10);
}

export function clearSaved() {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(EXPIRES_IN);
}

export function verifySaved() {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  const expiresIn = getExpiration();

  if (!accessToken || !refreshToken || !expiresIn) {
    return false;
  }

  return true;
}

export function renew(callback, ...params) {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  axios.post(`${BackendURL}/user/refresh`, { refresh_token: refreshToken }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => {
    const { data } = response.data;
    saveAccessToken(data.access_token);
    saveRefreshToken(data.refresh_token);
    saveExpiration(data.expires_in);

    if (callback) {
      callback(...params);
    }
  }).catch(() => {
    console.error('Fail to renew JWT currently.');
  });
}

export function setRenewTimer() {
  const exp = getExpiration();
  if (!exp) {
    return;
  }

  setTimeout(renew, exp - new Date(), () => {
    setInterval(renew, getExpiration() - new Date());
  });
}

export function getUserId() {
  if (!verifySaved()) {
    return null;
  }

  const accessToken = getAccessToken();
  const jwt = JWTDecode(accessToken);
  return jwt.user_id;
}

export function getUserName() {
  if (!verifySaved()) {
    return null;
  }

  const accessToken = getAccessToken();
  const jwt = JWTDecode(accessToken);
  return jwt.name;
}

export function getUserRole() {
  if (!verifySaved()) {
    return -1; // -1 means guest
  }

  const accessToken = getAccessToken();
  const jwt = JWTDecode(accessToken);
  return jwt.role;
}
