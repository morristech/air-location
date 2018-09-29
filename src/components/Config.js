import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TextInput, ToolbarAndroid, View } from 'react-native';

const saveIcon = require('../assets/saveSolid.png');

const initialState = {
  host: '',
  port: '',
  room: '',
};

/**
 * Socket connection config, etc.
 * @param {*} navigation param passed by React Navigation
 */
class Config extends Component {
  constructor(props) {
    super(props);
    this.onActionSelected = this.onActionSelected.bind(this);

    const { host, port, room } = props.navigation.state.params;
    this.state = { ...initialState, host, port: port.toString(), room };
  }

  onActionSelected(position) {
    const { navigation } = this.props;
    const { updateSettings } = navigation.state.params;
    if (position === 0) {
      updateSettings(this.state);
      navigation.goBack();
    }
  }

  render() {
    const { host, port, room } = this.state;
    return (
      <View>
        <View style={{ height: 24 }} />
        <ToolbarAndroid style={styles.toolbar} title="Configuración" titleColor="#fff"
          actions={[{ title: 'Guardar', titleColor: '#e3f2fd', icon: saveIcon, show: 'always' }]}
          onActionSelected={this.onActionSelected} />
        <View style={styles.container}>
          <Text style={{ color: '#aaa', fontWeight: 'bold' }}>Socket connection</Text>
          <View style={{ backgroundColor: '#aaa', height: 2, marginBottom: 16 }} />
          <Text style={styles.label}>Dirección Host</Text>
          <TextInput style={styles.textInput}
            placeholder="0.0.0.0" placeholderTextColor="#777" selectTextOnFocus
            value={host} onChangeText={(val) => { this.setState({ host: val }); }} />
          <Text style={styles.label}>Número de puerto</Text>
          <TextInput style={styles.textInput}
            placeholder="0000" placeholderTextColor="#777" selectTextOnFocus
            value={port} onChangeText={(val) => { this.setState({ port: val }); }} />
          <Text style={styles.label}>Room code</Text>
          <TextInput style={styles.textInput}
            placeholder="abc123" placeholderTextColor="#777" selectTextOnFocus
            value={room} onChangeText={(val) => { this.setState({ room: val }); }} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  toolbar: {
    height: 50,
    alignSelf: 'stretch',
    backgroundColor: '#1e88e5',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  textInput: {
    color: '#333',
    fontSize: 16,
    textAlign: 'left',
    height: 40,
    backgroundColor: '#ddd',
  },
});

Config.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.any,
    }),
  }),
};

Config.defaultProps = {
  navigation: {
    state: { params: {} },
  },
};

export default Config;
