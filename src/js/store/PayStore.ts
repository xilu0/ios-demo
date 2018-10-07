import { API, PayWay } from 'js/api';
import { errorHandleThen, IResponse } from 'js/helper/Respone';
import { action, computed, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { BaseChildStore } from './BaseChildStore';

class PayWayModel implements PayWay {
  @persist @observable public id: number = 0;
  @persist @observable public name: string = '';
  @persist @observable public iconUrl: string = '';
  @persist @observable public quota: string = '';
  @persist @observable public status: PayWay.StatusEnum = PayWay.StatusEnum.NUMBER_0;
}

export class PayStore extends BaseChildStore {

  private isSyncLoaded: boolean = false;

  @persist('list', PayWayModel)
  @observable
  public allPayWayList: PayWayModel[] = [];

  @computed
  public get enablePayWayList() {
    return this.allPayWayList.filter((item) => {
      return item.status === 1;
    });
  }

  @action
  public syncPayWayList() {
    if (this.isSyncLoaded) {
      return;
    }
    this.requestGetPayWay()
    .then(() => {
      this.isSyncLoaded = true;
    })
    .catch(errorHandleThen((errRs: any) => {
      // alert(JSON.stringify(errRs));
    }));
  }

  @action
  public requestGetPayWay() {
    return API.order.getPayway()
      .then(action((rs: IResponse) => {
        const list = rs.data || [];
        this.allPayWayList = list;
        return list;
      }));

  }
}
