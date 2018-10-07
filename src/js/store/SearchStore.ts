import { action, autorun, computed, observable, toJS } from 'mobx';
import { persist } from 'mobx-persist';
import { API, Body20, IResponse, Keyword } from '../api';
import { BaseChildStore } from './BaseChildStore';

class Location {

  @observable public longitude: number;
  @observable public latitude: number;

  constructor(longitude = 0, latitude = 0) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

}

export
class SearchStore extends  BaseChildStore {
  @observable public keyword: string = '';
  @persist('list') @observable public hotKeywords: Keyword[] = [];

  @observable public keywordResults: Keyword[] = [];
  @persist('list') @observable public keywordHistoryList: Keyword[] = [];

  @observable public selectLocation: Location = new Location();

  @computed public get valid (): boolean {
    return this.keyword.trim().length > 0;
  }

  @action public setKeyWord = (text: string = '') => {
    this.keyword = text.trim();
    this.requestGetRecommandSearchTips();
  }

  @action public clearKeyword = () => {
    this.keyword = '';
  }

  @action public clearKeywordHistory = () => {
    this.keywordHistoryList = [];
  }

  @action public addKeywordHistory = (keyword: Keyword) => {
    const arr = toJS(this.keywordHistoryList);

    let currentIndex = -1;
    for (let i = 0; i < arr.length; i += 1) {
      if (keyword.name === arr[i].name) {
        currentIndex = i;
      }
    }

    if (currentIndex >= 0) {
      const hasValue = arr.splice(currentIndex, 1)[0];
      arr.unshift(hasValue);
    } else {
      arr.unshift(keyword);
      if (arr.length > 9) {
        arr.pop();
      }
    }

    this.keywordHistoryList = arr;
  }

  @action public requestGetHotSearchTips() {
    const params = {
      // searchTip: '',
      pageIndex: 0,
      pageSize: 10,
      cityId: this.rootStore.geolocationStore.city.id,
    };
    return API.basic.getHotSearchTips(params)
    .then(action((rs: IResponse) => {
      console.log(JSON.stringify(rs));
      this.hotKeywords = rs.data.keywords || [];
    }))
    .catch((rs: Response) => {
      rs.json().then(console.log);
    });
  }

  @action public requestGetRecommandSearchTips(text: string = '') {
    this.keywordResults = [];
    const keyword = text.trim();
    const searchTip = keyword.length === 0 ? this.keyword : keyword;
    const params = {
      searchTip,
      pageIndex: 0,
      pageSize: 10,
      cityId: this.rootStore.geolocationStore.city.id,
      latitude: this.rootStore.geolocationStore.location.latitude,
      longitude: this.rootStore.geolocationStore.location.longitude,
    };
    return API.basic.getRecommandSearchTips(params)
    .then(action((rs: IResponse) => {
      console.log(JSON.stringify(rs));
      this.keywordResults = rs.data.keywords || [];
    }))
    .catch((rs: Response) => {
      rs.json().then(console.log);
    });
  }}
