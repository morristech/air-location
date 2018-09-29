import React, { Component } from 'react';
import { Image, PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import moment from 'moment';
import uuidv4 from 'uuid/v4';
import Location from '../utilities/Location';
import NetSocket from '../utilities/NetSocket';
import ConfigConnection from './ConfigConnection';

const mundo = require('../assets/earth.png');

const initialState = {
  position: {
    latitude: 0,
    longitude: 0,
    timestamp: 0,
  },
  socketStatus: false,
  host: '192.168.0.14',
  port: 9000,
  room: 'abc123',
  uuid: '',
};

// TODO: Toggle for location.
// TODO: Desconectar cuando vuelvas atras en la navegacion
// TODO: Mover request permission a otro archivo.
class Emitter extends Component {
  constructor() {
    super();
    this.locationHandling = this.locationHandling.bind(this);
    this.connectionToggle = this.connectionToggle.bind(this);
    this.configUpdate = this.configUpdate.bind(this);

    this.state = initialState;
    this.socket = undefined;
  }

  async componentDidMount() {
    // position
    await this.requestPermission();
    this.locationHandling();
  }

  async requestPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permiso a la ubicación',
          message: 'Se requiere el permiso de ubicación de tu dispositivo para las funciones de la aplicación.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permiso');
      } else {
        console.log('Permiso negado');
        // TODO: Tomar acción en caso de que el permiso sea negado.
      }
    } catch (err) {
      console.warn(err);
    }
  }

  locationHandling() {
    const location = new Location(onSuccess.bind(this), onError,
      {
        timeout: 1000,
        enableHighAccuracy: true,
        distanceFilter: 0,
      });
    location.getCurrent();
    location.watchPosition();

    function onSuccess(pos) {
      if (pos.mocked) return;
      const { room, uuid } = this.state;
      const { timestamp, coords: { latitude, longitude } } = pos;
      const position = { latitude, longitude, timestamp };
      this.setState({ position });
      // send through socket
      if (this.socket) {
        const msg = { type: 'position', room, uuid, position };
        this.socket.socketWrite(JSON.stringify(msg));
      }
    }

    function onError(err) {
      console.error(err);
    }
  }

  /** Handles connection to the socket */
  async connectionToggle() {
    const { socketStatus, host, port, room, position } = this.state;

    if (!this.socket) {
      this.socket = new NetSocket(host, port);
    }

    if (socketStatus) {
      this.socket.socketDisconnect();
      this.socket = undefined;
    } else {
      try {
        await this.socket.openSocket(onData, onError.bind(this), onClose.bind(this));

        // sending hello to server
        const uuid = uuidv4();
        const helloMsg = { type: 'host', room, uuid };
        this.socket.socketWrite(JSON.stringify(helloMsg));
        // sending position to server
        const msg = { type: 'position', room, uuid, position };
        this.socket.socketWrite(JSON.stringify(msg));

        this.setState({ socketStatus: true, uuid });
      } catch (err) {
        console.error(err);
        this.socket = undefined;
      }
    }

    function onData(data) {
      console.log(`Recibi: ${data}`);
    }

    function onError(err) {
      console.error(err);
      // this.setState({ socketStatus: false });
    }

    function onClose() {
      this.setState({ socketStatus: false });
    }
  }

  configUpdate(type, value) {
    switch (type) {
      case 'host':
        this.setState({ host: value });
        break;
      case 'port':
        this.setState({ port: parseInt(value, 10) });
        break;
      case 'room':
        this.setState({ room: value });
        break;
      default:
        break;
    }
  }

  render() {
    const { position, socketStatus, host, port, room } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.location}>
          <Image source={mundo} style={styles.locationImg} resizeMode="center" />
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={styles.locationText}>Latitud</Text>
              <Text style={styles.latlng}>{position.latitude}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={styles.locationText}>Longitud</Text>
              <Text style={styles.latlng}>{position.longitude}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.locationText}>Ultima actualización</Text>
            <Text style={styles.locationText}>{moment(position.timestamp).format('DD/MM/YYYY HH:mm:ss')}</Text>
          </View>
        </View>

        <View style={styles.socket}>
          <ConfigConnection connectionState={socketStatus} connectionCallback={this.connectionToggle}
            host={host} port={port} room={room} configUpdate={this.configUpdate} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  location: {
    padding: 25,
    backgroundColor: '#2196f3',
  },
  locationImg: {
    width: '100%',
    height: 150,
  },
  latlng: {
    textAlign: 'center',
    color: '#e3f2fd',
    fontWeight: 'bold',
    fontSize: 20,
  },
  locationText: {
    textAlign: 'center',
    color: '#e3f2fd',
  },
  socket: {
    justifyContent: 'center',
  },
});

export default Emitter;
