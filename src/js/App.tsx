
import { Observer, Provider } from 'mobx-react';
import React from 'react';
import { AppState, AsyncStorage, StatusBar, View, YellowBox } from 'react-native';

import { StorageKeys } from './const/StorageKeys';
import { onTopLevelNavigatorRef } from './helper/navigate';
import { RootStore } from './store/RootStore';
import { RootNavigator } from './ui/route';

import { City, getUserToken, setUserToken } from './api';
import { getStatusBarHeight } from './helper/Adapter';

import { errorHandleThen } from './helper/Respone';
import { setStore } from './helper/Store';

import Spinner from 'react-native-loading-spinner-overlay';

import SplashScreen from 'react-native-splash-screen';
import { AppConfig } from './const/Config';

import { NavigationKeys } from './const/NavigationKeys';
import { isNeedLogin } from './helper/Auth';
import { aliPay, wxPay } from './helper/Pay';
import { LoginStack } from './ui/route/LoginStack';
import { getCurrentRouteName } from './ui/route/navigationConfig';
import { PointModal } from './ui/screen/Mine/PointModal';
YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Remote debugger is in a background tab',
  'Warning: Module RCTImageLoader requires',
  'Warning: Module RNToastNAtive requires',
]);
// enableNetworkInspector();

AsyncStorage.getItem(StorageKeys.TOKEN_NAME)
  .then((token) => {
    console.log('token:' + token);
    setUserToken(token);
    return token;
  })
  .catch((err) => {
    console.log('get_token_err:' + err.toString());
  });

console.log('init store');
const rootStore = new RootStore();
setStore(rootStore);

console.log('init App');

const renderSpinnerView = () => (
  <View>
      <Spinner
        visible={rootStore.commonStore.loadingStore.visible}
        textContent={rootStore.commonStore.loadingStore.textContent}
        textStyle={{ color: '#FFF' }}
      />
      <PointModal
         visible={rootStore.userStore.pointModalVisible}
      />
  </View>
);

// =====================Router Start=======================

const defaultGetStateForAction = RootNavigator.router.getStateForAction;

let lastState: any;
let lastRouteName: string = '';
const wantAction: {[key: string]: any} = {};

RootNavigator.router.getStateForAction = (action: any, state: any) => {
  const actionRouteName = action.routeName;
  const needLogin = isNeedLogin(actionRouteName);

  if (actionRouteName === 'Login_back') {
    const c_action = {
      routeName: lastRouteName,
      type:'Navigation/NAVIGATE',
    };
    return defaultGetStateForAction(c_action, lastState);
  }
  if (actionRouteName === 'Login_success') {
    return defaultGetStateForAction(wantAction, lastState);
  }

  if (!needLogin) {
    lastRouteName = actionRouteName;
    return defaultGetStateForAction(action, state);
  }

  if (!getUserToken()) {
    wantAction.routeName = action.routeName;
    wantAction.type = action.type;
    wantAction.params = action.params;
    action.routeName = 'LoginStack';
  }

  return defaultGetStateForAction(action, state);
};

const onNavigationStateChange = (prevState: any, currentState: any) => {
  const currentScene = currentState.routes[currentState.index].routeName;
  if (currentScene !== 'LoginStack') {
    lastState = currentState;
  }
};

export const App = () => (
    <Provider
      userStore={rootStore.userStore}
      addressStore={rootStore.addressStore}
      searchStore={rootStore.searchStore}
      homeStore={rootStore.homeStore}
      // merchantStore={rootStore.merchantStore}
      nearStore={rootStore.nearStore}
      geolocationStore={rootStore.geolocationStore}
      merchantListStore={rootStore.merchantListStore}
      addressSearchStore={rootStore.addressSearchStore}
      commonStore={rootStore.commonStore}
      payStore={rootStore.payStore}
    >
      <View style={{ flex: 1 }}>
        <Observer render={renderSpinnerView}/>
        <StatusBar
          backgroundColor='rgba(0,0,0,0)'
          translucent={true}
          hidden={false}
          animated={true}
          barStyle='dark-content'
        />
        <RootNavigator
          ref={onTopLevelNavigatorRef}
          screenProps={{ statusBarHeight: getStatusBarHeight() }}
          onNavigationStateChange={onNavigationStateChange}
        />
      </View>
    </Provider>
  );

// =====================Router End=======================

console.log('init geolocation');
rootStore.geolocationStore.getGeolocationCity().then((city: any | City) => {
  rootStore.homeStore.getHomeData(city, rootStore.geolocationStore.location).then(() => {
    // SplashScreen.hide();
  });
})
.catch(errorHandleThen(() => {
  // SplashScreen.hide();
}));

SplashScreen.hide();

AppState.addEventListener(
  'change',
  (state) => {
    if (state === 'active') {
      SplashScreen.hide();
    }
  },
);

// console.log('init pay channel');
wxPay.register(AppConfig.WX_APPID);
aliPay.register();
