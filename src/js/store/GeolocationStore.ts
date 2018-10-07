import { action, computed, observable, configure } from 'mobx';
import { persist } from 'mobx-persist';
import { API, Area, City as APICITY } from '../api';
import { amap } from '../helper/Amap';
import { getLocation } from '../helper/Geolocation';
import { errorHandle } from '../helper/Respone';
import { BaseChildStore } from './BaseChildStore';

export class Location {
  @observable public longitude: number;
  @observable public latitude: number;

  constructor(longitude = 116.40, latitude = 39.90) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

}

export class City implements APICITY {
  @observable public id: number = 24;
  @observable public name: string = '深圳市';
  @observable public phoneticize?: string = '';
  @observable public provinceId?: number = 0;
  @observable public areas?: Area[];
}

export class GeolocationStore extends BaseChildStore {
  @persist('object') @observable public location: Location = new Location();
  @persist('object') @observable public city: APICITY = new City();

  @persist('object') @observable public selectCity: City = new City();

  @action public updateLocation(location: Location) {
    this.location = location;
  }

  @action public requestGetLocationCity() {
    return API.basic.getLocationCity(this.location)
    .then(action(({ data = new City() }: any) => {
      this.city = data;
      return data;
    }));
  }

  @action public getGeolocationCity() {
    return getLocation()
    .then((location: Location) => {
      return amap.convert(`${location.longitude},${location.latitude}`);
    })
    .then((rs: any) => {
      const arr = (rs.locations as string).split(',');
      return new Location(+arr[0], +arr[1]);
    })
    .then((location: Location) => {
      this.updateLocation(location);
      return this.requestGetLocationCity();
    })
    .catch(errorHandle);
  }

  @computed public get currentCity() {
    return this.selectCity.id === 0 ? this.city : this.selectCity;
  }

  @action public setSelectCity(city: City) {
    this.selectCity = city;
    this.rootStore.homeStore.getHomeData(this.currentCity, this.location);
  }
}
