
import {
  Body13,
  Body14,
  Body15,
  Body16,
  Body17,
  Body18,
  Body23,
  Body25,
  MerchantAttachment,
  MerchantBrief,
  MerchantDetail,
  MerchantDish,
  MerchantService,
  ProductDetail,
} from '../api';

import { BaseChildStore } from './BaseChildStore';

import { action, observable, toJS } from 'mobx';
import { persist } from 'mobx-persist';
import { API, IResponse } from '../api/manager';

const toJson = (response: Response) => {
  return response.json().then(console.log);
};

export class MerchantDetailModel implements MerchantDetail {
  @persist @observable public id: number = 0;
  @persist @observable public name?: string;
  @persist @observable public logoPath?: string;
  @persist @observable public coverPath?: string;
  @persist @observable public averageConsume?: number;
  @persist @observable public regionName?: string;
  @persist @observable public categoryName?: string;
  @persist @observable public distance?: number;
  @persist @observable public commentLevel?: number;
  @persist @observable public coupon?: string;
  @persist @observable public detailAddress?: string;
  @persist @observable public contactTels?: string[];
  @persist @observable public businessTime?: string;
  @persist @observable public recommandReasons?: string[];
  @persist @observable public discountSetting?: number;
  @persist @observable public auditVersionId?: number;
  @persist @observable public plusDiscountSetting?: number;

}

export class MerchantAttachmentModel implements MerchantAttachment {
  @persist @observable public id: number = 0;
  @persist @observable public name?: string;
  @persist @observable public type?: string;
  @persist @observable public description?: string;
  @persist @observable public attachUrl?: string;

}
export class MerchantServiceModel implements MerchantService {
  @persist @observable public id: number = 0;
  @persist @observable public name?: string;
  @persist @observable public iconFileId?: number;
  @persist @observable public iconPath?: string;

}
export class MerchantDishModel implements MerchantDish {
  @persist @observable public id: number = 0;
  @persist @observable public name?: string;
  @persist @observable public recommandIndex?: number;
  @persist @observable public picPath?: string;
  @persist @observable public price?: number;

}

export class ProductModel implements ProductDetail {
  @persist @observable public id: number = 0;
  @persist @observable public name?: string;
  @persist @observable public effectStartTime: string = '';
  @persist @observable public unavailableTimeDesc?: string;
  @persist @observable public availableTimeDesc?: string;
  @persist @observable public effectEndTime: string = '';
  @persist @observable public useRules: string[] = [];
  @persist @observable public marketPrice?: number;
  @persist @observable public favorablePrice: number = 0;
  @persist @observable public type?: number;
  @persist @observable public auditVersionId?: number;
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
  @persist @observable public auditVersionId?: number;

}

export class HotMechantModel {
  @persist @observable public merchants  ?: MerchantModel[] = [];
  @persist @observable public page?: any;

}

export class MerchantStore {
  @observable public merchantDetail: MerchantDetailModel = new MerchantDetailModel();
  @observable public images: MerchantAttachmentModel[] = [];
  @observable public services: MerchantServiceModel[] = [];
  @observable public dishs: MerchantDishModel[] =
  [new MerchantDishModel(), new MerchantDishModel(), new MerchantDishModel()];
  @observable public products: ProductModel[] = [];

  @observable public Merchant: HotMechantModel = new HotMechantModel();

  @observable public telephones: string[] = [];

  @observable public recommendMerchantArray: MerchantModel[] = [];

  @observable public graphic: string = '';

  @action public clearStore() {
    this.merchantDetail = new MerchantDetailModel();
    this.images = [];
    this.services = [];
    this.dishs = [];
    this.products = [];

    this.Merchant = new HotMechantModel();
    this.telephones = [];
    this.recommendMerchantArray = [];
    this.graphic = '';
  }

  @action public requsetGetMerchantDetail(parms: Body16) {
    return API.merchant.getAppMerchantDetail(parms).then(action((rs: IResponse) => {
      console.log('店铺详情');
      this.merchantDetail = rs.data;
      this.telephones = this.merchantDetail.contactTels || [];
      const array = toJS(this.telephones);
      array.push('取消');
      this.telephones = array;

    }));
  }

  @action public requestGetmerchantImages(parms: Body16) {
    return API.merchant.getMerchantAttachments(parms).then(action((rs: IResponse) => {
      this.images = rs.data.merchantAttachments;
    })).catch(toJson);
  }

  @action public requestGetmerchantDesc(parms: Body17) {
    return API.merchant.getMerchantDesc(parms).then(action((rs: IResponse) => {
      this.graphic = rs.data.detail;
    })).catch(toJson);
  }

  @action public requestGetmerchantDishes(parms: Body17) {
    return API.merchant.getMerchantDishes(parms).then(action((rs: IResponse) => {
      this.dishs = [];
      this.dishs = rs.data.merchantDishes;
    })).catch(toJson);
  }

  @action public requestGetmerchantServices(parms: Body18) {
    return API.merchant.getMerchantServices(parms).then(action((rs: IResponse) => {
      this.services = rs.data.services;
    })).catch(toJson);

  }

  @action public requestGetmerchantProduct(parms: Body25) {
    return API.product.getProducts(parms).then(action((rs: IResponse) => {
      this.products = rs.data;
    })).catch(toJson);
  }

  @action public requestGetRecommendedMerchant(parms: Body13) {
    return API.merchant.getAppMerchants(parms).then(action((rs: IResponse) => {
      this.Merchant = rs.data;
      this.recommendMerchantArray.push(...rs.data.merchants);
    })).catch(toJson);
  }
}
