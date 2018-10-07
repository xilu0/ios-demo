import { action, computed, has, observable } from 'mobx';

import { API, Area, Body15, Category, InlineResponse2009, IResponse, Keyword, Region } from '../api';
import { BaseChildStore } from './BaseChildStore';

import { merge, mergeWith } from 'lodash';
import { create, persist } from 'mobx-persist';
import { AsyncStorage } from 'react-native';
import { IQueryParams, MerchantModel, PageInfo, QueryParams } from '../type/merchant';
import { CategoryModel } from './HomeStore';

class MerchantStore {
  protected rootStore: any = null;
  constructor(rootStore: any) {
    this.rootStore = rootStore;
  }

  @computed public get queryText() {
    const { keywordType, keyword } = this.queryParams;
    if (keywordType === undefined || keywordType === Body15.KeywordTypeEnum.Default) {
      return keyword;
    }
    return '';
  }

  @persist('list') @observable public merchantList: MerchantModel[] = [];
  @observable public queryParams: IQueryParams = new QueryParams({
    pageIndex: 0,
    pageSize: 10,
  });

  @computed public get isEmpty() {
    return this.merchantList.length === 0;
  }

  @computed public get list() {
    const list = this.isEmpty ? this.rootStore.homeStore.hotMerchantArray : this.merchantList;
    return list;
  }

  @observable public pageInfo: PageInfo = new PageInfo();

  @observable public loading: boolean = false;
  @observable public upLoading: boolean = false;

  @action public clearMerchantList() {
    this.merchantList = [];
  }

  @action public updateQueryParams(_queryParams: IQueryParams) {
    // lodash merge 方法会忽略 undefinde 值 的覆盖，先自己实现
    for (const k of Object.keys(_queryParams)) {
      this.queryParams[k] = _queryParams[k];
    }
  }

  @action public resetQeuryParamsAndRequest(_queryParams: QueryParams) {
    const { location, currentCity } = this.rootStore.geolocationStore;
    const newQueryParams = merge(new QueryParams({
      pageIndex: 0,
      pageSize: 10,
      longitude: location.longitude,
      latitude: location.latitude,
      cityId: currentCity.id,
    }),                          _queryParams);
    this.clearMerchantList();
    this.updateQueryParams(newQueryParams);
    return this.requestGetAppMerchants();
  }

  @action public clearQueryParamsAndRequest() {
    this.updateQueryParams(new QueryParams());
    return this.requestGetAppMerchants();
  }

  @action public updateQueryParamsAndRequest(_queryParams: QueryParams) {
    this.updateQueryParams(_queryParams);
    return this.requestGetAppMerchants();
  }

  @action public updateQueryParamsAndClearListAndRequest(_queryParams: QueryParams = {}) {
    this.clearMerchantList();
    this.updateQueryParamsAndRequest(_queryParams);
  }

  @action public nextPageRequestGetAppMerchants(pageSize?: number) {
    const size = pageSize ? pageSize : (this.queryParams.pageSize || 10);
    return this.updateQueryParamsAndRequest({
      pageIndex: (this.queryParams.pageIndex || 0) + size,
      pageSize: size,
    });
  }

  @action public requestGetAppMerchants() {
    console.log(JSON.stringify(this.queryParams));
    this.loading = true;
    if (!this.queryParams.pageIndex || this.queryParams.pageIndex <= 1) {
      this.upLoading = true;
    }
    return API.merchant.getAppMerchants(this.queryParams)
    .then(action((rs: IResponse) => {
      this.loading = false;
      this.upLoading = false;
      const { merchants, page } = rs.data;
      // console.log(rs);
      this.merchantList.push(...merchants || []);
      this.pageInfo = page;
    }),   action((errRs: Response) => {
      this.loading = false;
      this.upLoading = false;
      errRs.json().then(console.log);
    }));
    // .catch();
  }
}

export class MerchantListStore extends BaseChildStore {
  public readonly merchant: MerchantStore;

  @observable public menuLeftText: string = '';
  @observable public menuCenterText: string = '';
  @observable public menuRightText: string = '';
  @action public updateMenuLeftText(text: string) {
    this.menuLeftText = text;
  }
  @action public updateMenuCenterText(text: string) {
    this.menuCenterText = text;
  }
  @action public updateMenuRightText(text: string) {
    this.menuRightText = text;
  }

  @action public resetMenuQueryStatus(_queryParams: QueryParams) {
    this.menuLeftText = '';
    this.menuCenterText = '';
    this.menuRightText = '';
    this.areaIndex = 0;
    this.centerIndex = 0;
    this.rightIndex = 0;
    this.merchant.resetQeuryParamsAndRequest(_queryParams);
  }

  // @observable public cityId: number = 36;
  @observable private areaLists: Area[] = [];
  @observable public areaIndex: number = 0;
  @observable public areaRightItem: Region = { id: -1 };

  @observable private centerLists: CategoryModel[] = [];
  @observable public centerIndex: number = 0;
  @observable public centerRightItem: Category = { id: -1 };

  @observable public rightList = [{
    name: '智能排序',
    value: 'default',
  }, {
    name: '人均消费',
    value: 'averageConsume',
  }, {
    name: '评分最高',
    value: 'commentLevel',
  }, {
    name: '月销量最高',
    value: 'monthOrderCount',
  }, {
    name: '离我最近',
    value: 'distance',
  }];

  @observable public rightIndex: number = 0;

  // public fristArea: Area;

  constructor(arg: any) {
    super(arg);
    this.merchant = new MerchantStore(this.rootStore);
    const hydrate = create({ storage: AsyncStorage });
    hydrate('merchantList', this.merchant);
  }

  @action public setAreaIndex(index: number) {
    this.areaIndex = index;
  }

  @action public setAreaRightItem(r: Region) {
    this.areaRightItem = r;
  }

  @action public setCenterIndex(index: number) {
    this.centerIndex = index;
  }

  @action public setCenterRightItem(c: Category) {
    this.centerRightItem = c;
  }

  @action public setRightIndex(index: number) {
    this.rightIndex = index;
  }

  @computed public get areaList() {
    const areaFrist: Area = {
      id: 0,
      name: '全部',
      regions: [
        {
          id: -1,
          name: '全部',
          areaId: undefined,
        }, {
          id: -2,
          name: '1km',
          areaId: 1000,
        },
        {
          id: -3,
          name: '2km',
          areaId: 2000,
        },
        {
          id: -4,
          name: '3km',
          areaId: 3000,
        },
        {
          id: -5,
          name: '10km',
          areaId: 10000,
        },
      ],
    };
    return [areaFrist, ...this.areaLists];
  }

  @computed public get centerList() {
    // Category
    const centerFrist: any = {
      id: 0,
      name: '全部',
      children: [{ id: -1, name: '全部分类' }],
    };
    return [centerFrist, ...this.centerLists];
  }

  @computed public get indexCenter() {
    return this.centerList[this.centerIndex];
  }

  @computed public get indexCenterSubList() {
    return this.indexCenter.children;
  }

  @computed public get indexArea() {
    return this.areaList[this.areaIndex];
  }

  @computed public get areaSubList() {
    if (this.areaLists.length === 0) {
      return [];
    }
    const subArea = this.indexArea;
    // return  subArea.regionInfoResList;
    if (!subArea || !subArea.regions) {
      return [];
    }
    return subArea.regions;
  }

  @observable public modalVisible: boolean = false;
  @observable public menuIndex: number = -1;

  @action public setVisible(b: boolean) {
    if (!b) {
      this.menuIndex = -1;
    }
    this.modalVisible = b;
  }

  @action public setMenuIndex(i: number) {
    this.menuIndex = i;
  }

  @action public requestGetRegions(_cityId?: number) {
    if (this.areaLists.length > 0) {
      return;
    }
    const cityId = _cityId || this.rootStore.geolocationStore.city.id;
    return API.basic.getRegions({ cityId })
    .then(action((rs: InlineResponse2009) => {
      this.areaLists = rs.data || [];
    }));
  }

  @action public loadCategory(categoryList: CategoryModel[]) {
    this.centerLists = categoryList;
  }

}
