import { Mock } from 'react-native-fetch-mock';

export const mock = {
  '/api/path': ({ method, url, params, urlparams, headers }) => {
    const all = Mock.mock({
      'list|2': [{
        'id|+1': 1,
        name: '@first @last',
        'age|18-54': 1,
      }],
    }).list;
    return all;
  },
};
