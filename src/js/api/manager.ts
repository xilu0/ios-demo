
// import { fetch } from './mock';
import fetch from 'portable-fetch';
import { Alert, AsyncStorage } from 'react-native';

import { AppConfig } from '../const/Config';
import { ActivityApi, BasicApi, MerchantApi, OrderApi, ProductApi , UserApi,ManagerApi } from './api';
import { Configuration } from './configuration';

// import Proxy2 from 'proxy-polyfill/src/proxy';

let userToken: string = '';
function setUserToken(token: string) {
  userToken = token;
}

export interface IResponse {
  data?: any;
  httpCode?: number;
  errorCode?: string;
}
// export interface IResponse {
//   data?: any;
//   httpCode?: number;
//   errorCode?: string;
// }

function getUserToken(): string {
  return userToken;
}

const apiKey = (name: string) => userToken;

interface IAPI {
  merchant: MerchantApi;
  activity: ActivityApi;
  product: ProductApi;
  user: UserApi;
  basic: BasicApi;
  order: OrderApi;
  manager:ManagerApi;
}

let API: IAPI;

function setBranchName() {
  AsyncStorage.getItem('branchName').then((val) => {
    
    const cfg  = new Configuration({
      apiKey,
      // basePath: AppConfig.BASE_API_LOCAL,
      basePath: `http://api.app.aixiangdao.tech/${ val || 'develop'}` || AppConfig.BASE_API_TECH,
      // basePath: `https://api.app.aixiangdao.tech/A005`,
    });
    const args = [cfg, undefined, fetch];
    const basic = new BasicApi(...args);
    const user = new UserApi(...args);
    const merchant = new MerchantApi(...args);
    const activity = new ActivityApi(...args);
    const product = new ProductApi(...args);
    const order = new OrderApi(...args);
    const manager = new ManagerApi(...args);

    API = {
      merchant,
      activity,
      product,
      user,
      basic,
      order,
      manager,
    };

  });
}

setBranchName() ;

export { setUserToken, getUserToken, API, setBranchName };
