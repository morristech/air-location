import { PermissionsAndroid } from 'react-native';

class Permissions {
  /**
   * Returns PermissionsAndroid.RESULTS
   */
  requestLocation() {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permiso a la ubicación',
        message: 'Se requiere el permiso de ubicación de tu dispositivo para las funciones de la aplicación.',
      },
    );
  }
}

export default Permissions;
