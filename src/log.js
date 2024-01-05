import asyncStorage from './asyncStorage.js';

/**
 *
 * @param p
 * @return {string}
 */
const paramToString = (p) => {
  let str = '';
  let remove_newline = true;
  let remove_spaces = true;

  switch (typeof p) {
    case 'object':
      if (p === null) {
        return 'null';
      } else if (p instanceof Error) {
        str = (p?.response?.data ? JSON.stringify(p.response.data) : p?.stack) ?? 'N/A';
        remove_newline = false;
        remove_spaces = false;
      } else {
        if (!Array.isArray(p) && p.constructor.name && p.constructor.name !== 'Object') {
          str = `${p.constructor.name} `;
        }
        str += JSON.stringify(p);
      }
      break;
    case 'undefined':
      return 'undefined';
    default:
      str = p.toString();
      break;
  }

  if (remove_newline) {
    str = str.replace(/\n/gm, ' ');
  }
  if (remove_spaces) {
    str = str.replace(/\s{2,}/gm, ' ');
  }

  return str.trim();
};

/**
 * Enrich a message adding useful information
 * @param {string} level
 * @param {object?} params
 * @returns {*[]}
 */
const enrichMessage = ({ level, params = [] }) => {
  level = level.toUpperCase();

  params = params.map(paramToString);
  if (params.length > 1) {
    const params_prefix = 'params =>';
    params.splice(1, 0, params_prefix);
  }

  const values = [level, ...params];

  const id_transaction = asyncStorage?.getStore()?.id_transaction;
  if (id_transaction) {
    values.unshift(`[${id_transaction}]`);
  }

  return values;
};

const info = (...params) => {
  console.log(...enrichMessage({ level: 'info', params }));
};

const query = (...params) => {
  console.log(...enrichMessage({ level: 'query', params }));
};

const http = (...params) => {
  console.log(...enrichMessage({ level: 'http', params }));
};

const curl = (...params) => {
  console.log(...enrichMessage({ level: 'curl', params }));
};

const koa = (...params) => {
  console.log(...enrichMessage({ level: 'koa', params }));
};

const auth = (...params) => {
  console.log(...enrichMessage({ level: 'auth', params }));
};

const error = (...params) => {
  console.error(...enrichMessage({ level: 'error', params }));
};

const warn = (...params) => {
  console.log(...enrichMessage({ level: 'warn', params }));
};

export default {
  info,
  query,
  http,
  curl,
  koa,
  auth,
  error,
  warn,
};
