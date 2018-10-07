
import { merge } from 'lodash';
import { AppConfig } from '../const/Config';
import { errorHandle } from './Respone';

class AMap {
  public  static readonly AMAP_BASE_URL = 'https://restapi.amap.com/v3';

  private key: string = '';

  constructor(_key: string) {
    this.key = _key;
  }

  private send(methodUrl: string, _params: {[key: string]: any}): Promise<any> {
    const params: {[key: string]: any} = merge({
      key: this.key,
    },                                         _params);

    const queryArr = [];
    for (const key of Object.keys(params)) {
      queryArr.push(`${key}=${params[key]}`);
    }
    const originUrl = AMap.AMAP_BASE_URL + methodUrl + '?' + queryArr.join('&');
    return fetch(originUrl, {
      method:'GET',
      // body: queryArr.join('&'),
    })
    .then((response) => {
      return response.json();
    }).catch(errorHandle);

  }

  /**
   * 经纬度转换
   * @param {string} locations 经纬度，逗号（,） 分隔，经度在前纬度在后
   * @param {string} coordsys 原坐标
   */
  public convert(locations: string, coordsys: string = 'gps') {
    return this.send('/assistant/coordinate/convert', {
      locations,
      coordsys,
    });
  }

  // 暂时没写支持批量计算，可自行拓展
  /**
   * 计算两点距离
   * @param {string} originLocations 经纬度，逗号（,） 分隔，经度在前纬度在后
   * @param {string} indexLocations 经纬度，逗号（,） 分隔，经度在前纬度在后
   */
  public distance(originLocations: string, indexLocations: string) {
    return this.send('/distance', {
      origins: indexLocations,
      destination: originLocations,
      type: 0,
    }).then((data: any) => {
      if (!data.status || data.status !== '1') {
        throw Error('AMAP: ' + data.info);
      }
      const obj = (data.results || [])[0];
      if (!obj) {
        return -1;
      }
      return +obj.distance;
    });
  }
}

export const amap = new AMap(AppConfig.AMAP_KEY);
