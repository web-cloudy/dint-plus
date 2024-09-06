import {CONFIG_DATA} from 'utils/constant';

export const API_KEY = {
  CALL_MORALIS: CONFIG_DATA.REACT_APP_CALL_MORALIS_API_KEY || '',
};

export const getApiURL = () => {
  const url = CONFIG_DATA.REACT_APP_API_URL;
  if (url?.endsWith('/')) {
    const arrURL = url?.split('/');
    arrURL.pop();
    return arrURL.join('/');
  }
  return url;
};

export const SOLONA_TOKEN = {
  API_URL:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json',
};

export const FIREBASE_CONFIG = {
  apiKey: CONFIG_DATA.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: CONFIG_DATA.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: CONFIG_DATA.REACT_APP_FIREBASE_DATABASE_URL || '',
  projectId: CONFIG_DATA.REACT_APP_FIREBASE_PROJECT_ID || '',
  storageBucket: CONFIG_DATA.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: CONFIG_DATA.REACT_APP_FIREBASE_MESSAGNING_SENDER_ID || '',
  appId: CONFIG_DATA.REACT_APP_FIREBASE_APP_ID || '',
};
