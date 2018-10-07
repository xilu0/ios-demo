import { action, computed, observable, toJS } from 'mobx';

import {
  Area,
  Banner,
  Body12,
  Body15,
  Body21,
  Body8,
  Body9,
  Category,
  City as APICITY,
  MerchantBrief,
  Topic } from '../api';

import { BaseChildStore } from './BaseChildStore';

import { persist } from 'mobx-persist';
import { API } from '../api/manager';
import {  errorHandleThen } from '../helper/Respone';
import { QueryParams } from '../type/merchant';
import { Location } from './GeolocationStore';

interface IResponse {
  data?: any;
  httpCode?: number;
  errorCode?: string;
}

interface IBody9  extends Body9 {
  pageIndex?: number;
  pageSize?: number;
}

export class City implements APICITY {
  @observable public id: number = 24;
  @observable public name: string = '深圳市';
  @observable public phoneticize?: string = '';
  @observable public provinceId?: number = 0;
  @observable public areas?: Area[];
}

export class CategoryModel implements Category {
  @persist @observable public id: number = 0;
  @persist @observable public name?: string;
  @persist @observable public iconPath?: string;
  @persist @observable public children?: Category;
}

export class TopicModel implements Topic {
  @persist @observable public id: number = 0;
  @persist @observable public name?: string;
  @persist @observable public coverPath?: string;
  @persist @observable public slogan?: string;
}

export class BannerModel implements Banner {
  @persist @observable public id: number = 0;
  @persist @observable public name?: string;
  @persist @observable public linkUrl?: string;
  @persist @observable public coverPath?: string;
}

export class MerchantModel implements MerchantBrief {
  @persist @observable public id: number = 0;
  @persist @observable public name?: string;
  @persist @observable public logoPath?: string;
  @persist @observable public coverPath?: string;
  @persist @observable public coupon?: string;
  @persist @observable public averageConsume?: number;
  @persist @observable public categoryName?: string;
  @persist @observable public commentLevel?: number;
  @persist @observable public distance?: number;
  @persist @observable public discountSetting?: number;
  @persist @observable public regionName?: string;

}

export class CityModel implements APICITY {
  @persist @observable public id: number = 0;
  @persist @observable public name?: string;
  @persist @observable public phoneticize?: string;
  @persist @observable public provinceId?: number;
  @persist @observable public areas?: Area[];

}

export class HotMechantModel {
  @persist @observable public merchants  ?: MerchantModel[] = [];
  @persist @observable public page?: any;

}

const toJson = (response: Response) => {
  return response.json().then(console.log);
};

export class HomeStore extends BaseChildStore {

  @persist('list') @observable public bannerArray: BannerModel[] = [];
  @persist('list')@observable public topicArray: TopicModel[] = [new TopicModel(), new TopicModel(), new TopicModel()];

  @persist('list') @observable public categoryArray: CategoryModel[] = [];
  @persist('list') @observable public hotMerchantArray: MerchantModel[] = [];

  @observable public HotMerchant: HotMechantModel = new HotMechantModel();

  @persist('list') @observable public allCategoryArray: CategoryModel[] = [];

  @observable public hotCitys: CityModel[] = [];
  @observable public allCitys: CityModel[] = [];

  @observable public keyword: string = '';

  @observable public selectedCity: City = new City();

  @observable public selectedLocation: Location = new Location();

  @observable public loading: boolean = false;
  @observable public upLoading: boolean = false;

  @observable public queryParams: QueryParams = new QueryParams({
    pageIndex: 0,
    pageSize: 10,
    sortBy: Body15.SortByEnum.SortOrder,
    order: Body15.OrderEnum.Desc,
  });

  @action public setNewQuertParams(params: QueryParams) {
    this.queryParams = params;
  }

  @computed public get isMaxHotMechantLength() {
    return this.hotMerchantArray.length >= 30;
  }

  @computed public get thinkList() {
    return this.allCitys.filter((item: CityModel) => {
      return (item.name as string).indexOf(this.keyword) >= 0 ||
      (item.phoneticize as string).toUpperCase().indexOf(this.keyword.toUpperCase()) >= 0;
    });
  }

  @persist('list') @observable public recentVisits: CityModel[] = [];

  @action public requestGetHomeBanners(parms: Body8) {
    return API.activity.getCityBanners(parms).then(action((rs: IResponse) => {
      this.bannerArray = rs.data;
      return rs.data;
    }));

  }
  @action public requestGetHomeCategories(parms: IBody9) {
    return API.merchant.getCityRecommandCategories(parms).then(action((rs: IResponse) => {
      const array = rs.data.categories || [];
      const category = new CategoryModel();
      category.name = '全部';
      category.id = -1;
      array.push(category);
      this.categoryArray = array;
      return rs.data;
    }));
  }

  @action public requestGetHomeTopic(parms: Body12) {
    return API.basic.getCityTopics(parms).then(action((rs: IResponse) => {
      this.topicArray = [];
      this.topicArray = rs.data;
      return rs.data;
    }));
  }
  @action public requestGetHotMerchant(parms: Body15) {
    const  pageIndex: number  = parms.pageIndex || 0;
    return API.merchant.getAppMerchants(parms).then(action((rs: IResponse) => {
      this.loading = false;
      this.HotMerchant = rs.data;
      const arr = toJS(this.hotMerchantArray);
      Array.prototype.push.apply(arr, rs.data.merchants || []);
      this.hotMerchantArray = arr;
    })).catch((err:Response) => {
      this.loading = false;
    });
    // }
  }

  @action public requestGetAllCategory(parms: Body12) {
    return API.merchant.getCityCategories(parms).then(action((rs: IResponse) => {
      this.allCategoryArray = rs.data;
    })).catch(toJson);
  }

  @action public requestGetHotCity() {
    return API.basic.getCities({ isHot:Body21.IsHotEnum.True }).then(action((rs: IResponse) => {
      this.hotCitys = rs.data;
    })).catch(toJson);
  }

  @action public requestGetAllCity() {
    return API.basic.getCities({ isHot:Body21.IsHotEnum.Default }).then(action((rs: IResponse) => {
      this.allCitys = rs.data;
    })).catch(toJson);
  }

  @computed public get valid (): boolean {
    return this.keyword.trim().length > 0;
  }

  @action public clear = () => {
    this.keyword = '';
  }

  @action public clearHistory = () => {
    this.recentVisits = [];
  }

  @action public addHistory = (city: City) => {
    const arr = toJS(this.recentVisits);

    let currentIndex = -1;
    for (let i = 0; i < arr.length; i += 1) {
      if (city.name === arr[i].name) {
        currentIndex = i;
      }
    }

    if (currentIndex >= 0) {
      const hasValue = arr.splice(currentIndex, 1)[0];
      arr.unshift(hasValue);
    } else {
      arr.unshift(city);
      if (arr.length > 3) {
        arr.pop();
      }
    }

    this.recentVisits = arr;
  }

  @action public pullDown () {
    const city = this.selectedCity;
    const location = this.selectedLocation;

    return Promise.all([
      this.requestGetHomeBanners({ cityId: city.id }),
      this.requestGetHomeCategories({ cityId: city.id, pageIndex: 0, pageSize: 7 }),
      this.requestGetHomeTopic({ cityId: city.id }),
    ]).then(() => {
      this.hotMerchantArray = [];
      return Promise.all([
     
        this.requestGetHotMerchant({
          cityId: city.id,
          pageIndex: 0,
          pageSize:10,
          // sortBy: Body15.SortByEnum.SortOrder,
          // order: Body15.OrderEnum.Desc,
          ...location,
        }),
        this.requestGetAllCategory({ cityId: city.id }),
      ]);
    });

  }

  @action public pullUp(pageSize = 10) {
    if (this.loading || this.isMaxHotMechantLength) {
      return;
    }
    const city = this.selectedCity;
    const location = this.selectedLocation;
    const page = this.hotMerchantArray.length + 1;
    return this.requestGetHotMerchant({
      pageSize,
      cityId: city.id,
      pageIndex: page,
      // sortBy: Body15.SortByEnum.SortOrder,
      // order: Body15.OrderEnum.Desc,
      ...location,
    });
  }

  @action public getHomeData(city: City, location: Location) {
    // if (city.id === 0) {
    //   city.id = 24;
    // }
    // if (location.longitude === 0) {
    //   location.latitude = 39.90;
    //   location.longitude = 116.40;
    // }
    // console.log(location);

    this.selectedCity = city;
    this.selectedLocation = location;

    return this.pullDown().catch(errorHandleThen((r) => {
      console.log(r);
    }));

  }

}
