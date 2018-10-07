// 第三方登录 Auto2.0

import * as WeChat from 'react-native-wechat';
import { AppConfig } from '../const/Config';

export interface IAuth {
  register: (appid?: string | any) => Promise<boolean>;
  isAppInstalled: () => Promise<boolean>;
  sendAuthRequest: () => Promise<any>;
}

export interface IWxAuthUser {
  city: string;
  country: string;
  headimgurl: string;
  language: string;
  nickname: string;
  openid: string;
  privilege?: any;
  province: string;
  sex: number;
  unionid: string;
}

// export class SinaWeiboAuth implement IAuth {}

export class WxAuth implements IAuth {
  public register(appid: string) {
    return WeChat.registerApp(appid);
  }

  public isAppInstalled() {
    return WeChat.isWXAppInstalled();
  }

  public sendAuthRequest(): Promise<IWxAuthUser> {
    const scope = 'snsapi_userinfo';
    const state = 'wechat_auth';
    return WeChat.sendAuthRequest(scope, state)
    .then((responseCode: any) => {
      return this.getAccessToken(responseCode.code);
    })
    .then((accessInfo: any) => {
      const { access_token, openid } = accessInfo;
      return this.getUserInfo(access_token, openid);
    });
  }

  private getAccessToken(code: string) {
    let url = `https://api.weixin.qq.com/sns/oauth2/access_token`;
    url += `?appid=${AppConfig.WX_APPID}&secret=${AppConfig.WX_APP_SECRET}&code=${code}&grant_type=authorization_code`;
    return fetch(url, {
      method:'GET',
    })
    .then((response) => {
      return response.json();
    });
  }

  private getUserInfo(access_token: string, openid: string) {
    let url = `https://api.weixin.qq.com/sns/userinfo`;
    url += `?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
    return fetch(url, {
      method:'GET',
    })
    .then((response) => {
      return response.json();
    });
  }
  
}
