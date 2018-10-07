import { action, autorun, computed, observable, toJS } from 'mobx';
import { persist } from 'mobx-persist';
import { API, Body20, IResponse, Keyword } from '../api';
import { BaseChildStore } from './BaseChildStore';

export class POIModel {

  @persist @observable public id?: string ;
  @persist @observable public name?: string;
  @persist @observable public adcode?: string;
  @persist @observable public location?: string ;
  @persist @observable public address?: string;
  @persist @observable public typecode?: string;
}

class Location {

  @observable public longitude: number;
  @observable public latitude: number;

  constructor(longitude = 0, latitude = 0) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

}

const lastSelectTimeDiff: number = 60000; // ms // 30 * (60 * 1000) = 1800000;;

export
class AddressSearchStore extends  BaseChildStore {
  @observable public keyword: string = '';

  @persist('list') @observable public addressHistoryList: POIModel[] = [];

  @observable public poiResultList: POIModel[] = [];
  @observable public selectLocation: Location = new Location();

  @observable public selectPOI: POIModel = new POIModel();

  private lastSelectTime?: number;
  private lastSelectTimeDiff: number = lastSelectTimeDiff;

  public isLastSelectTimeout(): boolean {
    if (!this.lastSelectTime) {
      return false;
    }
    const now = new Date().getTime();
    if (now - this.lastSelectTime >= this.lastSelectTimeDiff) {
      return true;
    }
    return false;

  }

  public isNeedAlertChangeCity() {
    return this.isLastSelectTimeout();
    // console.log(JSON.stringify(this.selectLocation));
    // console.log(JSON.stringify(this.rootStore.geolocationStore.location));
    // if (this.isLastSelectTimeout() === false) {
    //   return false;
    // }
    // const { latitude, longitude } = this.selectLocation;
    // const { latitude: current_latitude, longitude: current_longitude } = this.rootStore.geolocationStore.location;
    // if (latitude !== current_latitude || longitude !== current_longitude) {
    //   return true;
    // }
    // return false;
  }

  @action public resetLastSelectTimeout() {
    this.lastSelectTime = new Date().getTime();
  }

  @action public setCurrentPOI (poi: POIModel) {
    this.selectPOI = poi;
  }

  @action public setCurrentLocation(longitude: number, latitude: number) {
    const newLocation = new Location(longitude, latitude);
    this.lastSelectTime = new Date().getTime();
    this.selectLocation = newLocation;
    this.rootStore.nearStore.merchant.clearMerchantList();
    this.rootStore.nearStore.merchant.updateQueryParamsAndRequest({
      longitude,
      latitude,
    });
  }

  @computed public get valid (): boolean {
    return this.keyword.trim().length > 0;
  }

  @action public setKeyWord = (text: string = '') => {
    this.keyword = text.trim();
  }

  @action public clearKeyword = () => {
    this.keyword = '';
  }

  @action public clearAddressHistory = () => {
    this.addressHistoryList = [];
  }

  @action public addAddressHistory = (locations: POIModel) => {

    const arr = toJS(this.addressHistoryList);

    let currentIndex = -1;
    for (let i = 0; i < arr.length; i += 1) {
      if (locations.name === arr[i].name) {
        currentIndex = i;
      }
    }

    if (currentIndex >= 0) {
      const hasValue = arr.splice(currentIndex, 1)[0];
      arr.unshift(hasValue);
    } else {
      arr.unshift(locations);
      if (arr.length > 9) {
        arr.pop();

      }
    }

    this.addressHistoryList = arr;

  }

  @action  public searchPOI(keyword: string, location: string, city: string) {
    const opts = {
      method:'GET',
    };
    const keys = 'ac258f187cce6e52899457d263db1105';

    const locations = '113.943699,22.530104';

    const url = `https://restapi.amap.com/v3/assistant/inputtips?output=json&key=${keys}&keywords=${keyword}&type=餐饮服务&location=${location}&city=${city}&datatype=all`;
    console.log(url);

    fetch(url, opts)
      .then((response) => {
        return response.json();
      })
      .then(action((responseText: any) => {
        this.poiResultList = responseText.tips;
        console.log(responseText.tips);
        console.log(this.poiResultList);

      }))
      .catch((error) => {
        alert(error);
      });
  }

  @action public searchCurrentPOI (_location?: Location) {
    const location = _location || this.rootStore.geolocationStore.location;

    const opts = {
      method:'GET',
    };
    const keys = 'ac258f187cce6e52899457d263db1105';

    const locationString = `${location.longitude},${location.latitude}`;

    const url = `https://restapi.amap.com/v3/geocode/regeo?key=${keys}&location=${locationString}&poitype=&radius=1000&extensions=all&batch=false&roadlevel=0`;
    return fetch(url, opts)
      .then((response) => {
        return response.json();
      })
      .then(action((responseText: any) => {
        const poi = new POIModel();
        poi.name = responseText.regeocode.addressComponent.township;
        poi.location = locationString;
        this.selectPOI = poi;
        this.lastSelectTime = 0;
        return responseText;
      }));
  }
}
