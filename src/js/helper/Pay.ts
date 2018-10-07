import * as WeChat from 'react-native-wechat';
import Alipay from 'react-native-yunpeng-alipay';

// wxchat pay params
interface IPayLoad {
  partnerId: string; // {String} 商家向财付通申请的商家ID
  prepayId: string; // {String} 预支付订单ID
  nonceStr: string; // {String} 随机串
  timeStamp: string; // {String} 时间戳
  package: string; // {String} 商家根据财付通文档填写的数据和签名
  sign: string; // {String} 商家根据微信开放平台文档对数据做的签名
}

interface IPayErr {
  errCode: number; // 0 if authorization successed
  errStr: string; // error message
  data?: any;
}

export interface IPay {
  register: (appid?: string | any) => Promise<boolean>;
  isAppInstalled: () => Promise<boolean>;
  pay: (securecrtParam: IPayLoad | string | any) => Promise<IPayErr>;
}

class WxPay implements IPay {
  public register(appid: string) {
    return WeChat.registerApp(appid);
  }

  public isAppInstalled() {
    return WeChat.isWXAppInstalled();
  }

  public pay(payload: IPayLoad) {
    return WeChat.pay(payload);
  }
}

class AliPay implements IPay {
  public register() {
    return Promise.resolve(true);
  }

  public isAppInstalled() {
    return Promise.resolve(true);
  }

  public pay(signSrc: string) {
    return Alipay.pay(signSrc)
    .then((data: any) => {
      return {
        data,
        errCode: 0,
        errStr: '',
      };
    });
  }

}

export const wxPay = new WxPay();
export const aliPay = new AliPay();

const payChannelDictionary: {[payChannelName: string]: IPay} = {
  wxPay,
  aliPay,
};

export const getPayChannelByName = (payChannelName: string): IPay => {
  return payChannelDictionary[payChannelName] || null;
};
