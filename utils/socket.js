import { getToken } from "../utils/ApiCalls";
import { WS_URL } from "../utils/Config";
import { io } from "socket.io-client";

// store multiple socket connections
const sockets = {};

export function getSocket(route) {
  if (!sockets[route]) {
    sockets[route] = io(`${WS_URL}${route}`, {
      auth: {
        token: getToken(),
      },
      transports: ["websocket"],
    });
  }
  return sockets[route];
}


export function refreshSocketToken(route) {
  if (sockets[route]) {
    sockets[route].auth = { token: getToken() };
    sockets[route].connect();
  }
}
export function disconnectSocket(route) {
  const sock = sockets[route];
  if (!sock) return;
  if (sock.connected) sock.disconnect();
  sock.removeAllListeners();
   delete sockets[route];
}


