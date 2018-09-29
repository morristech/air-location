import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Menu = ({ navigation }) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.touchable}
      onPress={() => navigation.navigate('Host')}>
      <Text style={styles.touchableText}>Emisor</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.touchable}
      onPress={() => navigation.navigate('Client')}>
      <Text style={styles.touchableText}>Receptor</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  touchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
});

Menu.propTypes = {
  navigation: PropTypes.object,
};

Menu.defaultProps = {
  navigation: f => f,
};

export default Menu;
