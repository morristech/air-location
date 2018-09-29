import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

const initialState = {
  region: {
    latitude: 29.0730,
    longitude: -110.9559,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
};

class Mapa extends Component {
  constructor() {
    super();
    this.lmao = this.lmao.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.mapa = null;

    this.state = initialState;
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  lmao() {
    const { region } = this.state;
    this.mapa.animateToRegion({
      ...region,
      latitude: 29.0530,
      longitude: -110.9459,
    }, 1000);
  }

  render() {
    const { region } = this.state;
    const { ownLocation } = this.props;
    return (
      <MapView style={styles.map} ref={this.mapa}
        initialRegion={region}
        onRegionChange={this.onRegionChange}>

        <Marker coordinate={ownLocation.latlng}
          title={ownLocation.title}
          description={ownLocation.description}
        />

      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    flexGrow: 1,
  },
});

Mapa.propTypes = {
  ownLocation: PropTypes.shape({
    latlng: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
    title: PropTypes.string,
    description: PropTypes.string,
  }),
};

Mapa.defaultProps = {
  ownLocation: {
    latlng: { latitude: 0, longitude: 0 },
    title: '',
    description: '',
  },
};

export default Mapa;
