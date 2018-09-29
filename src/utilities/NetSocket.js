const net = require('net');

class NetSocket {
  constructor(host, port) {
    this._host = host;
    this._port = port;
    this._socket = undefined;
  }

  async openSocket(onData = () => { }, onError = () => { }, onClose = () => { }) {
    await new Promise((resolve, reject) => {
      this._socket = net.createConnection(this._port, this._host, () => {
        clearTimeout(timer);
        resolve();
      });
      const timer = setTimeout(() => {
        this._socket.end();
        this._socket.destroy();
        this._socket = undefined;
        reject(new Error('W: Socket connection timeout'));
      }, 10000); // recuerda que esto puede dar error on remote debugging
    });

    this._socket.on('data', onData);

    this._socket.on('error', onError);

    this._socket.on('close', onClose);
  }

  socketWrite(data) {
    try {
      this._socket.write(data, () => {
        console.log('data out');
      });
    } catch (err) {
      console.error(err);
    }
  }

  socketDisconnect() {
    this._socket.end();
    this._socket.destroy();
    this._socket = undefined;
  }
}

export default NetSocket;
