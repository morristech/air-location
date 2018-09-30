import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PermissionsAndroid, StyleSheet, View } from 'react-native';
import uuidv4 from 'uuid/v4';
import Permissions from '../utilities/Permissions';
import Location from '../utilities/Location';
import WafoWebSocket from '../utilities/WebSocket';
import ControlMenu from './ControlMenu';
import Mapa from './Mapa';

const initialState = {
  position: {
    latitude: 0,
    longitude: 0,
    timestamp: 0,
    live: false,
  },
  socket: {
    status: false,
    host: '192.168.0.14',
    port: 9000,
    room: 'abc123',
    uuid: '',
  },
};

class GroupBroadcast extends Component {
  constructor() {
    super();
    this.initiateLocation = this.initiateLocation.bind(this);
    this.toggleLocation = this.toggleLocation.bind(this);
    this.websocketConnectionToggle = this.websocketConnectionToggle.bind(this);
    this.updateSettings = this.updateSettings.bind(this);

    this.state = initialState;
  }

  async componentDidMount() {
    // permissions
    try {
      const permiso = await new Permissions().requestLocation();
      if (permiso !== PermissionsAndroid.RESULTS.GRANTED) { /* throw error? */ return; }
    } catch (err) {
      console.error(err);
    }
    // location
    this.initiateLocation();
  }

  /** Metodo para inicializar el objeto location con sus handles segun las acciones */
  initiateLocation() {
    if (!this.location) {
      this.location = new Location(onSuccess.bind(this), onError, {
        timeout: 1000,
        enableHighAccuracy: true,
        distanceFilter: 0,
      });
    }

    function onSuccess(pos) {
      if (pos.mocked) return;
      const { position, socket, socket: { room, uuid } } = this.state;
      const { timestamp, coords: { latitude, longitude } } = pos;
      // actualizando state
      this.setState({
        position: { ...position, latitude, longitude, timestamp },
      });
      // enviando posicion
      if (socket.status) {
        const msg = { type: 'position', room, uuid, position: { latitude, longitude, timestamp } };
        this.socket.websocketWrite(JSON.stringify(msg));
      }
    }

    function onError(err) {
      console.error(err);
    }
  }

  /** toggle del listener de location */
  toggleLocation() {
    const { position } = this.state;
    if (this.location.isWatching()) {
      this.location.clearWatch();
      this.setState({
        position: {
          ...position,
          live: false,
        },
      });
    } else {
      this.location.getCurrent();
      this.location.watchPosition();
      this.setState({
        position: {
          ...position,
          live: true,
        },
      });
    }
  }

  websocketConnectionToggle() {
    const { socket, socket: { status, host, port, room }, position } = this.state;

    if (!this.socket) {
      this.socket = new WafoWebSocket(host, port);
    }

    if (status) {
      this.socket.websocketDisconnect();
      this.socket = undefined;
    } else {
      this.socket.openWebsocket(onOpen.bind(this), onMessage, onError, onClose.bind(this));
    }

    function onOpen() {
      console.log('Connection open');
      // sending hello to server
      const uuid = uuidv4();
      const helloMsg = { type: 'client', room, uuid };
      this.socket.websocketWrite(JSON.stringify(helloMsg));
      // sending position to server
      const msg = {
        type: 'position',
        room,
        uuid,
        position: {
          latitude: position.latitude,
          longitude: position.longitude,
          timestamp: position.timestamp,
        },
      };
      this.socket.websocketWrite(JSON.stringify(msg));
      // updating state
      this.setState({ socket: { ...socket, status: true, uuid } });
    }

    function onMessage(data) {
      console.log(`Recibi: ${data}`);
    }

    function onError(err) {
      console.error(err);
      console.log(err.message);
    }

    function onClose(event) {
      console.log(event.code, event.reason);
      this.setState({ socket: { ...socket, status: false } });
    }
  }

  updateSettings(values) {
    const { host, port, room } = values;
    const { socket } = this.state;
    this.setState({
      socket: {
        ...socket,
        host,
        port,
        room,
      },
    });
  }

  render() {
    const { navigation } = this.props;
    const { position, socket } = this.state;
    const ownMarker = {
      latlng: {
        latitude: position.latitude,
        longitude: position.longitude,
      },
      title: 'Tu posición',
      description: '',
    };

    return (
      <View style={styles.container}>
        <Mapa ownLocation={ownMarker} />
        <View style={styles.controlsContainer}>
          <ControlMenu locationButton={this.toggleLocation} locationStatus={position.live}
            socketButton={this.websocketConnectionToggle} socketStatus={socket.status}
            configButton={() => {
              navigation.navigate('Settings', {
                host: socket.host,
                port: socket.port,
                room: socket.room,
                updateSettings: this.updateSettings,
              });
            }} />
        </View>
      </View>
    );
  }
}

GroupBroadcast.propTypes = {
  navigation: PropTypes.any,
};

GroupBroadcast.defaultProps = {
  navigation: {},
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  controlsContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#1e88e5',
    padding: 8,
  },
  button: {
    alignItems: 'center',
    padding: 10,
  },
});

export default GroupBroadcast;
