import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesome, { Icons } from 'react-native-fontawesome';

const ControlMenu = ({ locationButton, locationStatus, socketButton, socketStatus, configButton }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={locationButton}
      style={[styles.button, (locationStatus) ? { backgroundColor: '#0d47a1' } : { backgroundColor: '#e3f2fd' }]}>
      <FontAwesome style={[{ fontSize: 24 }, (locationStatus) ? { color: '#fff' } : { color: '#0d47a1' }]}>
        {Icons.mapMarkerAlt}
      </FontAwesome>
    </TouchableOpacity>
    <TouchableOpacity onPress={socketButton}
      style={[styles.button, (socketStatus) ? { backgroundColor: '#0d47a1' } : { backgroundColor: '#e3f2fd' }]}>
      <FontAwesome style={[{ fontSize: 24 }, (socketStatus) ? { color: '#fff' } : { color: '#0d47a1' }]}>
        {Icons.broadCastTower}
      </FontAwesome>
    </TouchableOpacity>
    <TouchableOpacity onPress={configButton}
      style={[styles.button, { backgroundColor: '#e3f2fd' }]}>
      <FontAwesome style={[{ fontSize: 24 }, { color: '#0d47a1' }]}>
        {Icons.cog}
      </FontAwesome>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#e3f2fd',
    marginLeft: 4,
    marginRight: 4,
    borderRadius: 2,
  },
});

ControlMenu.propTypes = {
  locationButton: PropTypes.func,
  locationStatus: PropTypes.bool,
  socketButton: PropTypes.func,
  socketStatus: PropTypes.bool,
  configButton: PropTypes.func,
};

ControlMenu.defaultProps = {
  locationButton: f => f,
  locationStatus: false,
  socketButton: f => f,
  socketStatus: false,
  configButton: f => f,
};

export default ControlMenu;
