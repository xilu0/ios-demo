import { Alert, Geolocation, GeolocationReturnType, PermissionsAndroid, Platform } from 'react-native';
import { Location } from '../store/GeolocationStore';

// import { Geolocation } from 'react-native-amap-geolocation';

async function requestLocationPermission() {
  if (Platform.OS === 'ios') {
    return Promise.resolve(true);
  }
  return PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: '将要请求位置权限',
      message: `便于提供给您更好的定位服务以及商家推荐`,
    },
  )
  .then((granted: string) => {
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  });
}

export const  getLocation =  (): Promise<{longitude: number, latitude: number}> => {
  return new Promise((resolve, reject) => {
    requestLocationPermission().then((result: boolean) => {
      if (result !== true && Platform.OS === 'android') {
        return Alert.alert('请确保您的位置权限开关已打开');
      }
      navigator.geolocation.getCurrentPosition((data: GeolocationReturnType) => {
        const { longitude, latitude } = data.coords;
        resolve({ longitude, latitude });
      },                                       reject);
    }).catch((err) => {
      resolve(new Location());
    });
  });
};
