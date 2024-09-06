export let currentSocketInstance = 0;
let SOCKET_CONNECTION: WebSocket | null = null;
let savedToken: string | null = "";

//Latest instance id
export function setCurrentInstanceSocket(id: number) {
  currentSocketInstance = id;
}

export function getCurrentInstanceSocket() {
  return currentSocketInstance;
}

//Latest connection
export function setSocketConnection(value: WebSocket | null) {
  SOCKET_CONNECTION = value;
}

export function getSocketConnection() {
  return SOCKET_CONNECTION;
}

export function savetoken(token: string | null) {
  savedToken = token;
}

export function getSavedToken() {
  return savedToken;
}
