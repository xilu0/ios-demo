import { merge } from 'lodash';
import { action, decorate, observable, toJS } from 'mobx';

import { persist } from 'mobx-persist';

import { Address,
         Body, Body1,
         Body26,
         Body29,
         Body30,
         Body40,
         Body6,
         Body7,
         BuyPlus,
         MobilePasswordLoginInfo,
         MobileQuickLoginInfo,
         PlusMemberType,
         setUserToken,
         User,
        } from '../api';

import { BaseChildStore } from './BaseChildStore';

import { AsyncStorage } from 'react-native';

import { API } from '../api/manager';
import { StorageKeys } from '../const/StorageKeys';
import { IWxAuthUser } from '../helper/Auth2Login';
import { errorHandle } from '../helper/Respone';

export class UserModel implements User {
  @persist @observable public id: number = 0;
  @persist @observable public name?: string;
  @persist @observable public mobile?: string;
  @persist @observable public level?: string;
  @persist @observable public headPicture?: string;
  @persist @observable public birthday?: Date;
  @persist @observable public sex?: number;
  @persist @observable public waitPayCount: number = 0;
  @persist @observable public waitUseCount: number = 0;
  @persist @observable public refundingCount: number = 0;

  @persist @observable public point?: number;
  @persist @observable public plusStatus: number = 0;
  @persist @observable public plusEndTime?: Date;
  @persist @observable public isSign?: boolean;
  @persist @observable public plusType?: number;
  
}

export class AddressModel implements Address {
  @persist @observable public id: number = 0;
  @persist @observable public contactName?: string;
  @persist @observable public contactMobile?: string;
  @persist @observable public province?: number;
  @persist @observable public city?: number;
  @persist @observable public area?: number;
  @persist @observable public address?: string;
  @persist @observable public isDefault?: number;
  @persist @observable public provinceName?: string;
  @persist @observable public cityName?: string;
  @persist @observable public areaName?: string;
}

export class SelfUser extends UserModel {
  public password?: string;
}
interface IWithUserToken {
  userToken: string;
}

const updateUserToken = (token: string) => {
  setUserToken(token);
  AsyncStorage.setItem(StorageKeys.TOKEN_NAME, token).then(() => {
    // console.log('token save success');
  }).catch((err) => {
    // console.log('token save error: ' + err.toString());
  });
};

const clearUserToken = () => {
  updateUserToken('');
};

// const generateDefaultUser = () => {
//   const _self = new SelfUser();
//   _self.headPicture = {}
//   return _self;
// };

interface IResponse {
  data?: any;
  httpCode?: number;
  errorCode?: string;
}

class WxAuthUser implements IWxAuthUser {
  @observable public city: string = '';
  @observable public country: string = '';
  @observable public headimgurl: string = '';
  @observable public language: string = '';
  @observable public nickname: string = '';
  @observable public openid: string = '';
  @observable public privilege?: any;
  @observable public province: string = '';
  @observable public sex: number = 0;
  @observable public unionid: string = '';
}

interface IExtPlusMemberType extends PlusMemberType {
  isActive: boolean;
}
export class UserStore extends BaseChildStore {

  @persist('object') @observable public token: string = '';
  @observable public branchName: string = '';
  @observable public signPoint: number = 0;
  @observable public plusTypes: IExtPlusMemberType[] = [];
  @observable public pointModalVisible: boolean = false;

  @persist('object', SelfUser) @observable public self: SelfUser = new SelfUser();

  @observable public wxUser: WxAuthUser = new WxAuthUser();
  // @persist @observable public userList: UserModel[] = [];
  @action public login(info: any) {
    this.self.mobile =  info.mobile ;
    return API.user.login(info).then(action((rs: IResponse) => {
      const { user, userToken } = rs.data;
      merge(this.self, user);
      this.token = userToken;
      updateUserToken(userToken);
      return this.self;
    }));
  }

  @action public updateWxUser(u: WxAuthUser) {
    merge(this.wxUser, u);
  }

  @action public loginByWx (u: IWxAuthUser) {
    const params = {
      type: 3,
      openId: u.openid,
      nickName: u.nickname,
      sex: u.sex,
      headerImg: u.headimgurl,
      unionId: u.unionid,
    };
    return API.user.login(params)
    .then(action((rs: IResponse) => {
      const { user, userToken } = rs.data;
      merge(this.self, user);
      merge(this.wxUser, u);
      this.token = userToken;
      updateUserToken(userToken);
      return this.self;
    }));
  }

  @action public loginByVerifyCode(info: MobileQuickLoginInfo) {
    this.self.mobile =  info.mobile ;
    return API.user.login(info).then(action((rs: IResponse) => {
      const { user, userToken } = rs.data;
      merge(this.self, user);
      this.token = userToken;
      updateUserToken(userToken);
      return this.self;
    }));
  }

  @action public  loginByPassword(info: MobilePasswordLoginInfo) {
    this.self.mobile =  info.mobile ;
    return API.user.login(info).then(action((rs: IResponse) => {
      const { user, userToken } = rs.data;
      merge(this.self, user);
      updateUserToken(userToken);
      this.token = userToken;
      return this.self;
    }));
  }
  @action public  logout() {
    return API.user.logout().then(action((rs: any) => {
      this.self = new UserModel();
      this.token = '';
      clearUserToken();
      return rs;
    }));
  }

  @action public requestLoginVerifyCode(mobile: string) {
    return API.user.getVerifyCode({ mobile, type: Body.TypeEnum.NUMBER_2 })
    .then((rs: IResponse) => rs.data);
  }
  @action public requestResetPasswordVerifyCode(mobile: string) {
    return API.user.getVerifyCode({ mobile, type: Body.TypeEnum.NUMBER_6 })
    .then((rs: IResponse) => rs.data);
  }
  @action public requestSwapPhoneVerifyCode(params: Body) {
    return API.user.getVerifyCode(params).then((rs: IResponse) => rs.data);
  }

  @action public requestBindPhoneVerifyCode(params: Body) {
    return API.user.getVerifyCode(params).then((rs: IResponse) => rs.data);
  }

  @action public requestVerifyOldPhone(params: Body6) {

    return API.user.verifyOldPhoneCode(params).then((rs: IResponse) => rs.data);
  }

  @action public requestBindNewPhone(params: Body6) {
    return API.user.bindNewPhone(params).then((rs: IResponse) => rs.data)
    .then(action(() => {
      this.self.mobile = params.mobile;
    }));
  }

  @action public requestBindMobile(params: Body30) {
    return API.user.bindMobile(params)
    .then((rs: IResponse) => rs.data)
    .then(action((data: any) => {
      this.self.mobile = params.mobile;
      return data;
    }));
  }

  @action public requestGetUserInfo() {
    return API.user.getUserInfo().then(action((rs: IResponse) => {
      // console.log(JSON.stringify(rs.data));
      merge(this.self, rs.data);
      if (!this.self.isSign) {
        this.requestGetUserSign();
      }
      return this.self;
    }));
  }

  @action public requestGetUserSign() {
    return API.user.sign().then((rs: any) => {
      this.signPoint = rs.data.point;
      this.pointModalVisible = true;
      return true;
    });
  }

  @action public requestUpdateUserInfo(params: Body1) {
    return API.user.updateUserInfo(params).then(action((rs) => {
      merge(this.self, params);
      return this.self;
    }));
  }
  @action public requestUpdateLoginPassword(oldPassword: string, newPassword: string) {
    return API.user.updateLoginPassword({
      oldPassword,
      newPassword,
    }).then((rs: IResponse) => rs.data);
  }
  @action public requestRestPassWord(params: Body29) {
    return API.user.resetLoginPassword(params).then((rs: IResponse) => {
      return rs.data;
    });
  }

  @action public requestUploadHeadImage(params: Body7) {

    return API.user.uploadHeadImage(params).then(action((rs: IResponse) => {
      const headPicture = rs.data.headImageUrl;
      merge(this.self, { headPicture });
      return this.self;
    }));
  }

  @action public requestGetPlusMemberType() {
    return API.user.getPlusMemberType().then(action((rs: IResponse) => {
      const arr = ((rs.data as IExtPlusMemberType[]) || []);
      arr.sort((o: IExtPlusMemberType) => +(o.type || 0));
      arr.forEach((obj: IExtPlusMemberType) => {
        if (obj.type === 4) {
          obj.isActive = true;
        }
      });
      this.plusTypes = arr;
    }));
  }

  @action public requestSubmitFreePlusOrder() {
    return API.order.getFreePlus().then(action((rs: IResponse) => rs.data));
  }

  @action public setPlusData(data: IExtPlusMemberType, index: number) {
    this.plusTypes.forEach((o: IExtPlusMemberType) => o.isActive = false);
    this.plusTypes[index].isActive = true;
  }

  @action public requestSubmitPlusOrder(param: BuyPlus) {
    return API.order.submitPlusOrder(param);
  }

  @action public requestGetPlusOrderPayStatus(param: Body40) {
    return API.order.getPlusOrderPayStatus(param).then(action((rs: IResponse) => rs.data));
  }

  @action public setModalStatus(status:boolean) {
    this.pointModalVisible = status;
  }
}

export class AddressStore extends BaseChildStore {

  @persist('list', AddressModel)
  @observable
  public addressList: AddressModel[] = [];

  @persist('object', AddressModel) @observable public defaultAddress: AddressModel = new AddressModel();

  @action private changeDefaultAddress(addr: AddressModel) {
    this.defaultAddress.isDefault = 0;
    this.defaultAddress = addr;
  }

  @action public requestGetAddresses() {
    return API.user.getAddresses().then(action((rs: IResponse) => {
      this.addressList = rs.data;
      for (const addr of rs.data) {
        if (addr.isDefault === 1) {
          this.defaultAddress = addr;
          break;
        }
      }
    }));
  }

  @action public requestAddAddress(addr: AddressModel) {
    return API.user.addAddress(addr).then(action((rs: IResponse) => {
      addr.id = rs.data.id;
      if (addr.isDefault === 1) {
        this.changeDefaultAddress(addr);
      }
      this.addressList.push(addr);
      this.requestGetAddresses();
    }));
  }

  @action public requestDeleteAddress(addr: AddressModel) {
    return API.user.deleteAddress({ id: addr.id }).then(action((rs) => {
      // tslint:disable-next-line
      this.addressList.remove(addr);
      this.requestGetAddresses();
    }));
  }
  @action public requestUpdateAddress(addr: AddressModel, index: number) {
    if (addr.isDefault === 1) {
      this.changeDefaultAddress(addr);
    }

    return API.user.updateAddress(addr).then(action((rs) => {
      this.addressList.splice(index, 1, addr);
      // merge(this.addressList[index], addr);
      this.requestGetAddresses();
    }));
  }
  @action public requestGetAddress(id: number) {
    return API.user.getAddress({ id }).then().catch(console.log);
  }

}
