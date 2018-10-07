import { NavigationActions } from 'react-navigation';
import { setUserToken } from '../api';
import { EventKey } from '../const/EventKey';
import { navigator } from './navigate';

/**
 * 事件处理类
 */

export class Events {
  // 事件列表
  private events: {[key: string]: any};
  // 单次事件列表
  private events_one: {[key: string]: any};

  constructor() {
    this.events = {};
    this.events_one = {};
  }

  /**
   * 事件监听
   * @param {String} eventName 事件名称
   * @param {Function} callback 事件触发后执行的回调函数
   */
  public on(eventName: string, callback: (data?: any) => void) {
    // 获取已存在的单次事件列表
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    // 添加至数组
    this.events[eventName].push(callback);
  }

  /**
   * 事件监听 (单次)
   * @param {String} eventName 事件名称
   * @param {Function} callback 事件触发后执行的回调函数
   */
  public once(eventName: string, callback: (data?: any) => void) {
        // 获取已存在的单次事件列表
    if (!this.events_one[eventName]) {
      this.events_one[eventName] = [];
    }
        // 添加至数组
    this.events_one[eventName].push(callback);
  }

    /**
     * 事件触发
     * @param {String} eventName 事件名称
     * @param {Object} data 传参参数值
     */
  public emit(eventName: string, data = {}) {
        // 获取全部事件列表 和 单次事件列表，并且合并
    const es = [...(this.events[eventName] || []), ...(this.events_one[eventName] || [])];
        // 遍历触发
        // for (let f of es) {
        //     f && f.call(f, data)
        // }
    for (let i = 0, l = es.length; i < l; i += 1) {
      const f = es[i];
      if (f) {
        f.call(f, data);
      }
    }
        // 单次事件清空
    this.events_one[eventName] = [];
  }

    /**
     * 清空当前页面事件
     * @param {String} eventName 事件名称
     */
  public off(eventName: string) {
        // 清空事件列表
    this.events[eventName] = [];
    this.events_one[eventName] = [];
  }

    /**
     * 移除页面单次事件
     * @param {String} eventName 事件名称
     */
  public offOnce(eventName: string) {
    this.events_one[eventName] = [];
  }

  public getEvents(eventName: string) {
    return { events: this.events[eventName], events_one: this.events_one[eventName] };
  }

}

export const appBroadCast = new Events();
let loginTimer: number = -1;
appBroadCast.on(EventKey.CheckAuthenticationCodeFail, () => {

  if (loginTimer >= 0) {
    return;
  }
  setUserToken('');

  const backAction = NavigationActions.back({
    // key: 'Profile',
  });
  // const loginAction = NavigationActions.navigate({
  //   routeName: 'LoginStack',
  //   params: {},
  // });

  // const resetAction = StackActions.reset({
  //   index: 0,
  //   actions: [
  //     'Tabs',
  //   ],
  // });

  navigator.dispatch(backAction);

  // setTimeout(() => {
  //   navigator.dispatch(loginAction);
  // },         16);

  loginTimer = setTimeout(() => {
    loginTimer = -1;
  },                      5000);
});
