import { create } from 'mobx-persist';

import { AsyncStorage } from 'react-native';
import { AddressSearchStore } from './AddressSearchStore';
import { CommonStore } from './CommonStore';
import { GeolocationStore } from './GeolocationStore';
import { HomeStore } from './HomeStore';
import { MerchantListStore } from './MerchantListStore';
import { MerchantStore } from './MerchantStore';
import { NearStore } from './NearStore';
import { PayStore } from './PayStore';
import { SearchStore } from './SearchStore';
import {  AddressStore, UserStore } from './UserStore';

// @remotedev({ remote: false, global: true })
class RootStore {
  public readonly userStore: UserStore;
  public readonly addressStore: AddressStore;
  public readonly searchStore: SearchStore;
  public readonly addressSearchStore: AddressSearchStore;
  public readonly homeStore: HomeStore;
  // public readonly merchantStore: MerchantStore;
  public readonly nearStore: NearStore;
  public readonly merchantListStore: MerchantListStore;
  public readonly geolocationStore: GeolocationStore;

  public readonly commonStore: CommonStore;

  public readonly payStore: PayStore;

  constructor() {

    const hydrate = create({ storage: AsyncStorage });

    this.nearStore = new NearStore(this);
    this.merchantListStore = new MerchantListStore(this);
    // this.homeStore = new HomeStore(this);
    const  homeStore = new HomeStore(this);

    // this.userStore = new UserStore(this);
    // this.addressStore =  new AddressStore(this);

    const addressStore = new AddressStore(this);
    const userStore = new UserStore(this);

    const searchStore = new SearchStore(this);

    const addressSearchStore = new AddressSearchStore(this);

    // const merchantStore = new MerchantStore(this);

    const geolocationStore = new GeolocationStore(this);

    const payStore = new PayStore(this);

    // hydrate('addressList', addressStore);
    // hydrate('self', userStore);
    // hydrate('token', userStore);
    hydrate('addressHistoryList', addressSearchStore);
    hydrate('keywordHistoryList', searchStore);

    hydrate('hotKeywords', searchStore);
    hydrate('allCategoryArray', homeStore);
    hydrate('recentVisits', homeStore);

    hydrate('location', geolocationStore);
    hydrate('city', geolocationStore);
    hydrate('selectCity', geolocationStore);

    hydrate('allCitys', homeStore);
    hydrate('bannerArray', homeStore);
    // hydrate('topicArray', homeStore);
    hydrate('categoryArray', homeStore);
    hydrate('hotMerchantArray', homeStore);

    hydrate('allPayWayList', payStore);
    hydrate('self', userStore);
    hydrate('token', userStore);

    this.addressStore = addressStore;
    this.userStore = userStore;

    this.searchStore = searchStore;
    this.addressSearchStore = addressSearchStore;
    // this.merchantStore = merchantStore;
    this.homeStore = homeStore;

    this.geolocationStore = geolocationStore;

    this.payStore = payStore;

    this.commonStore = new CommonStore(this);

    // onsole.log(userStore.token);
  }

}

export { RootStore };
