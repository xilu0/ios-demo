import pfetch from 'portable-fetch';
import FetchMock from 'react-native-fetch-mock';

import { mock } from '../../__mock__';
import { AppConfig } from '../const/Config';

const fetchMock = new FetchMock(mock, {
  delay: 200, // 200ms
  fetch: pfetch,
  exclude: [
      // AppConfig.BASE_API_TECH,
    'api/:vsrsion(.*)',
    'http://api.app.aixiangdao.tech/:vsrsion(.*)',
  ],
  // proxy: [{
  //   path: 'http://api.app.aixiangdao.tech/:vsrsion(.*)',
  //   target: 'api/',
  //   process: (proxied: any, matches: string[]) => {
  //     console.log(`${proxied.target}${matches[1]}`);
  //     return `${proxied.target}${matches[1]}`;
  //   },
  // }],
});

export const fetch = fetchMock.fetch;
