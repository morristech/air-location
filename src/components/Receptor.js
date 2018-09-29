import React, { Component } from 'react';
import { PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import uuidv4 from 'uuid/v4';
import Location from '../utilities/Location';
import NetSocket from '../utilities/NetSocket';
import ConfigConnection from './ConfigConnection';
import Mapa from './Mapa';

const initialState = {
  position: {
    latitude: 0,
    longitude: 0,
    timestamp: 0,
  },
  hostPosition: {
    latitude: 0,
    longitude: 0,
    timestamp: 0,
  },
  socketStatus: false,
  host: '192.168.1.145',
  port: 9000,
  room: 'abc123',
  uuid: '',
};

class Receptor extends Component {
  constructor() {
    super();
    this.locationHandling = this.locationHandling.bind(this);
    this.connectionToggle = this.connectionToggle.bind(this);
    this.configUpdate = this.configUpdate.bind(this);

    this.state = initialState;
    this.socket = undefined;
  }

  async componentDidMount() {
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
        distanceFilter: 1,
      });
    location.getCurrent();
    location.watchPosition();

    function onSuccess(pos) {
      if (pos.mocked) return;
      const { timestamp, coords: { latitude, longitude } } = pos;
      this.setState({
        position: { latitude, longitude, timestamp },
      });
    }

    function onError(err) {
      console.error(err);
    }
  }

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
        await this.socket.openSocket(onData.bind(this), onError.bind(this), onClose.bind(this));
        // sending hello to server
        const uuid = uuidv4();
        const helloMsg = { type: 'client', room, uuid };
        this.socket.socketWrite(JSON.stringify(helloMsg));
        this.setState({ socketStatus: true, uuid });
      } catch (err) {
        console.error(err);
        this.socket = undefined;
      }
    }

    function onData(data) {
      const hostPosition = JSON.parse(data);
      this.setState({ hostPosition });

      // Calculate the angle in degrees.
      const degrees = angleFromCoordinate(
        position.latitude,
        position.longitude,
        hostPosition.latitude,
        hostPosition.longitude,
      );
      console.log(degrees);
    }

    function onError(err) {
      console.error(err);
      // this.setState({ socketStatus: false });
    }

    function onClose() {
      this.setState({ socketStatus: false });
    }

    function angleFromCoordinate(lat1, lng1, lat2, lng2) {
      const dLng = (lng2 - lng1);
      const y = Math.sin(dLng) * Math.cos(lat2);
      const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
      let bearing = Math.atan2(y, x);
      bearing *= (180 / Math.PI);
      bearing = (bearing + 360) % 360;
      bearing = 360 - bearing; // count degrees counter-clockwise - remove to make clockwise
      // https://stackoverflow.com/questions/3932502/calculate-angle-between-two-latitude-longitude-points

      return bearing;
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
    const { position, hostPosition, socketStatus, host, port, room } = this.state;
    return (
      <View style={styles.container}>
        <Mapa marker={{
          latlng: {
            latitude: hostPosition.latitude,
            longitude: hostPosition.longitude,
          },
          title: 'Marcador',
          description: 'Descripcion',
        }} />

        <View style={styles.location}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            lat: {position.latitude} lng: {position.longitude}
          </Text>
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            lat: {hostPosition.latitude} lng: {hostPosition.longitude}
          </Text>
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
  socket: {
    justifyContent: 'center',
  },
});

export default Receptor;
