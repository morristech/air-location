import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import GroupBroadcast from './components/GroupBroadcast';
import Config from './components/Config';

const RootStack = createStackNavigator(
  {
    Home: GroupBroadcast,
    Settings: Config,
  },
  { headerMode: 'none', initialRouteName: 'Home' },
);

const App = () => (
  <View style={styles.mainContainer}>
    <StatusBar translucent backgroundColor="rgba(25, 118, 210, 1)" />
    {/* <View style={{ height: 24 }} /> */}
    <RootStack />
  </View>
);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default App;
