import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ConfigConnection = ({ host, port, room, configUpdate, connectionState, connectionCallback }) => (
  <View style={styles.socket}>
    <TouchableOpacity onPress={connectionCallback}
      style={[styles.socketButton, connectionState ? styles.socketButtonConnected : styles.socketButtonDisconnected]}>
      <Text style={styles.socketButtonText}>
        {(connectionState) ? 'DESCONECTAR' : 'CONECTAR'}
      </Text>
    </TouchableOpacity>
    <View style={styles.hostInput}>
      <TextInput style={[styles.textInput, { textAlign: 'right' }]}
        value={host} onChangeText={(val) => { configUpdate('host', val); }}
        placeholder="0.0.0.0" placeholderTextColor="#777" selectTextOnFocus />
      <Text style={styles.textInput}>:</Text>
      <TextInput style={[styles.textInput, { textAlign: 'left' }]}
        value={port.toString()} onChangeText={(val) => { configUpdate('port', val); }}
        placeholder="0000" placeholderTextColor="#777" selectTextOnFocus />
    </View>
    <TextInput style={[styles.textInput, { textAlign: 'center' }]}
      value={room} onChangeText={(val) => { configUpdate('room', val); }}
      placeholder="abc123" placeholderTextColor="#777" selectTextOnFocus />
  </View>
);

const styles = StyleSheet.create({
  socket: {
    justifyContent: 'center',
  },
  socketButton: {
    alignItems: 'center',
    padding: 10,
  },
  socketButtonText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 18,
  },
  socketButtonDisconnected: {
    backgroundColor: '#66bb6a',
  },
  socketButtonConnected: {
    backgroundColor: '#ef5350',
  },
  hostInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dddddd',
  },
  textInput: {
    backgroundColor: '#dddddd',
    color: '#333',
    fontSize: 18,
  },
});

ConfigConnection.propTypes = {
  host: PropTypes.string,
  port: PropTypes.number,
  room: PropTypes.string,
  configUpdate: PropTypes.func,
  connectionState: PropTypes.bool,
  connectionCallback: PropTypes.func,
};

ConfigConnection.defaultProps = {
  host: '',
  port: 0,
  room: '',
  configUpdate: f => f,
  connectionState: false,
  connectionCallback: f => f,
};

export default ConfigConnection;
