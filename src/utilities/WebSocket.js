class WafoWebSocket {
  constructor(host, port) {
    this._host = host;
    this._port = port;
    this._socket = undefined;
  }

  openWebsocket(onOpen = f => f, onMessage = f => f, onError = f => f, onClose = f => f) {
    this._socket = new WebSocket(`ws://${this._host}:${this._port}`);

    this._socket.onopen = onOpen;
    this._socket.onmessage = onMessage;
    this._socket.onerror = onError;
    this._socket.onclose = onClose;
  }

  websocketWrite(data) {
    this._socket.send(data);
  }

  websocketDisconnect() {
    this._socket.close(1000, 'WebSocket cerrado manualmente por aplicacion.');
    this._socket = undefined;
  }
}

export default WafoWebSocket;
