import { merge } from 'lodash';
import { computed, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { Body15, MerchantBrief } from '../api';

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
export interface IQueryParams extends QueryParams {
  [key: string]: any;
}

export class QueryParams implements Body15 {
  /**
   * 城市ID
   * @type {number}
   * @memberof Body15
   */
  @observable public cityId?: number;
    /**
     * 区域ID
     * @type {number}
     * @memberof Body15
     */
  @observable public regionId?: number;
    /**
     * 距离(单位：m)
     * @type {number}
     * @memberof Body15
     */
  @observable public distance?: number;
    /**
     * 分类ID
     * @type {number}
     * @memberof Body15
     */
  @observable public categoryId?: number;
    /**
     * 经度(用户所在经度 或 地图Api返回的经度)
     * @type {number}
     * @memberof Body15
     */
  @observable public longitude?: number;
    /**
     * 纬度(用户所在纬度 或 地图Api返回的纬度)
     * @type {number}
     * @memberof Body15
     */
  @observable public latitude?: number;
    /**
     * 专题(场景)ID
     * @type {number}
     * @memberof Body15
     */
  @observable public topicId?: number;
    /**
     * 搜索关键字类型(为\"default\"表示未选择推荐关键字)
     * @type {string}
     * @memberof Body15
     */
  @observable public keywordType?: Body15.KeywordTypeEnum;
    /**
     * 搜索关键字(包括商家ID、商家名称、分类（菜系）ID、商圈ID、菜名等)
     * @type {string}
     * @memberof Body15
     */
  @observable public keyword?: string;
    /**
     * 排序字段
     * (\"default\"-默认排序;
     * \"averageConsume\"-人均消费;
     * \"commentLevel\"-评分最高;
     * \"monthOrderCount\"-月销量最高;
     * \"distance\"-离我最近;
     * \"sortOrder\"-店铺排序;)
     * @type {string}
     * @memberof Body15
     */
  @observable public sortBy?: Body15.SortByEnum;
    /**
     * 排序方式(\"desc\"-降序; \"asc\"-升序;)
     * @type {string}
     * @memberof Body15
     */
  @observable public order?: Body15.OrderEnum;
    /**
     * 分页游标（初始值：0）
     * @type {number}
     * @memberof Body15
     */
  @observable public pageIndex?: number = 0;
    /**
     * 每页数目
     * @type {number}
     * @memberof Body15
     */
  @observable public pageSize?: number = 10;

  constructor(initParams?: Body15) {
    merge(this, initParams);
  }
}

export class PageInfo {
  @observable public hasNext?: string;
  @observable public  total?: number;
  @computed get isHasNext(): boolean {
    return this.hasNext !== 'false';
  }
  constructor() {
    this.hasNext = 'true';
    this.total = 1;
  }
}
