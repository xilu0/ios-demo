import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { OrderItemComponent } from './OrderItemComponent';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react/native';

import { API, IResponse, OrderInfo } from 'js/api';
import { errorHandleThen } from 'js/helper/Respone';
import {  F, W } from 'js/helper/UI';
import { Colors } from 'js/style/colors';
import { LineView } from 'js/ui/components/Common/LineView';
import { NavigationScreenProp } from 'react-navigation';
import { EventKey } from 'js/const/EventKey';
import { appBroadCast } from 'js/helper/Events';
import FastImage from 'react-native-fast-image';


class PageStore {
  private status?: number;
  private pageIndex: number = 0;
  private pageSize: number = 20;

  @observable public loadingEnd: boolean = false;

  @observable public list: OrderInfo[] = [];
  @observable public loading: boolean = false;

  constructor(_status?: number) {
    if (_status !== undefined) {
      this.status = _status;
    }
  }

  @observable public pageNo: number = 0;

  @action public delete(orderId: number) {
    this.list = this.list.filter((item: OrderInfo) => {
      return item.orderId !== orderId;
    });
  }

  @action public nextPageNo() {
    this.pageNo += 1;
    this.pageIndex = this.pageNo * this.pageSize;
    return this;
  }

  @action public resetPageNo() {
    this.pageNo = 0;
    this.pageIndex = this.pageNo * this.pageSize;
    return this;
  }

  @action public clearList() {
    this.list = [];
    // this.loadingEnd = false;
    return this;
  }

  @action public requestGetOrders(fn?: (rsb: boolean) => void) {
    // showLoading('', 5000);
    if (this.pageIndex === 0) {
      this.loading = true;
    }

    return API.order.getOrders({
      status: this.status,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    })
    .then(action((rs: IResponse) => {
      const arr = ((rs.data as OrderInfo[]) || []);
      if (arr.length === 0) {
        // this.loadingEnd = true;
      } else {
        this.list.push(...arr);
      }
      // hideLoading();
      if (this.pageIndex === 0) {
        this.loading = false;
      }
      if (fn) {
        fn!(true);
      }
    }))
    .catch(errorHandleThen(() => {
      // hideLoading();
      this.loading = false;
      if (fn) {
        fn!(false);
      }
    }));
  }
}

@observer
export class Page extends React.Component<{
  tabLabel: string,
  status?: number,
  navigation: NavigationScreenProp<any, any>,
}> {

  private pageStore: PageStore;

  constructor(props: any) {
    super(props);
    this.pageStore = new PageStore(this.props.status);
    appBroadCast.on(EventKey.DeleteOrderById, (id: number) => {
      this.pageStore.delete(id);
    });
  }

  public componentDidMount() {
    this.pageStore.requestGetOrders();

  }

  public renderItem = (o: {item: OrderInfo, index: number}) => {
    return (
      <OrderItemComponent
        status={this.props.status}
        order={o.item}
        navigation={this.props.navigation}
      />);
  }

  public keyExtractor = (item: OrderInfo, index: number) => {
    return '$' + index + '_' + item.orderId;
  }

  public getItemSeparatorComponent = () => {
    return <LineView width={W(375)} height={W(6)} color={'#F8F8F8'} />;
  }

  public getReshControlView() {
    return (
      <RefreshControl
        refreshing={this.pageStore.loading}
        onRefresh={this.onRefresh}
      />);
  }

  public onRefresh = () => {
    this.pageStore.resetPageNo().clearList().requestGetOrders();
  }

  public onEndReached = () => {
    // if (this.pageStore.loadingEnd) {
    //   return;
    // }
    this.pageStore.nextPageNo().requestGetOrders();
  }

  public getListEmptyComponent = () => {
    return (
      <View style={styles.recommend}>
        <FastImage style={styles.recommend_img} source={require('img/emptyData.png')} />
        <Text style={styles.recommend_text}>您的订单暂无数据</Text>
      </View>
    );
  }

  public render() {
    const list = this.pageStore.list.slice();
    const refreshControl = this.getReshControlView();

    return (
      <FlatList
        ListEmptyComponent={this.getListEmptyComponent}
        keyExtractor={this.keyExtractor}
        ItemSeparatorComponent={this.getItemSeparatorComponent}
        renderItem={this.renderItem}
        data={list}
        refreshControl={refreshControl}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0.5}
      />
    );
  }
}

const styles = StyleSheet.create({
  recommend: {
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  recommend_img: {
    marginTop: W(35),
    marginBottom: W(15),
  },
  recommend_text: {
    color: Colors.TITLE_BLACK,
    fontSize: F(12),
  },
  recommend_line: {
    height: W(2),
    width: W(110),
    backgroundColor: Colors.TITLE_BLACK,
    marginTop: W(43),
  },
  recommend_line_text: {
    color: Colors.TITLE_BLACK,
    fontSize: F(20),
    backgroundColor: '#F8F8F8',
    paddingLeft: W(3),
    paddingRight: W(3),
    height: W(30),
    transform: [{ translateY: -W(15) }],
  },

});
