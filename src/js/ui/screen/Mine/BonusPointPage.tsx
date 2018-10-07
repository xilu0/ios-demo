import { action, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import React from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet , Text, View } from 'react-native';

import { API, IResponse, PointsDetail } from 'js/api';
import { errorHandleThen } from 'js/helper/Respone';
import {  F, W } from 'js/helper/UI';
import { LineView } from 'js/ui/components/Common/LineView';
import { NavigationScreenProp } from 'react-navigation';
import { BonusPointBody } from './BonusDetail';

class PageStore {
  private pointsType?: number = 0;
  private pageIndex: number = 0;
  private pageSize: number = 20;

  @observable public loadingEnd: boolean = false;

  @observable public list: PointsDetail[] = [];
  @observable public loading: boolean = false;

  constructor(_pointsType?: number) {
    if (_pointsType !== undefined) {
      this.pointsType = _pointsType;
    }
  }

  @observable public pageNo: number = 0;

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
    return this;
  }

  @action public requestGetPoints(fn?: (rsb: boolean) => void) {
    if (this.pageIndex === 0) {
      this.loading = true;
    }
    return API.user.getPointsList({
      pointsType: this.pointsType,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    })
    .then(action((rs: IResponse) => {
      const arr = ((rs.data as PointsDetail[]) || []);
      if (arr.length > 0) {
        this.list.push(...arr);
      }
      if (this.pageIndex === 0) {
        this.loading = false;
      }
      if (fn) {
        fn!(true);
      }
    }))
    .catch(errorHandleThen(() => {
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
  pointsType?: number,
  navigation: NavigationScreenProp<any, any>,
}> {

  private pageStore: PageStore;

  constructor(props: any) {
    super(props);
    this.pageStore = new PageStore(this.props.pointsType);

  }

  public componentDidMount() {
    this.pageStore.requestGetPoints();

  }

  public renderItem = (o: {item: PointsDetail, index: number}) => {
    return (
      <BonusPointBody
        pointsType={this.props.pointsType}
        detail={o.item}
      />);
  }

  public keyExtractor = (item: PointsDetail, index: number) => {
    return '$' + index + '_';
  }

  public getItemSeparatorComponent = () => {
    return <LineView width={W(375)} height={W(6)} color={'#FBFBFB'} />;
  }

  public getReshControlView() {
    return (
      <RefreshControl
        refreshing={this.pageStore.loading}
        onRefresh={this.onRefresh}
      />);
  }

  public onRefresh = () => {
    this.pageStore.resetPageNo().clearList().requestGetPoints();
  }

  public onEndReached = () => {
    this.pageStore.nextPageNo().requestGetPoints();
  }

  public goHome = () => {
    this.props.navigation.navigate('Tabs');
  }

  public goBack() {
    this.props.navigation.goBack();
  }

  public getListEmptyComponent = () => {
    return (
      <View style={styles.recommend}>
        <Text style={styles.recommend_text}>您暂无积分使用记录</Text>
      </View>
    );
  }

  public render() {
    const list = this.pageStore.list.slice();
    const refreshControl = this.getReshControlView();
    return (
      <ScrollView style={{ flex:1 }}>
        <View style={{ flex:1 }}>
          <FlatList
            ListEmptyComponent={this.getListEmptyComponent}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            data={list}
            refreshControl={refreshControl}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.5}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  recommend: {
    width: W(126),
    height: W(20),
    marginTop: W(25),
    marginLeft: W(22),
  },
  recommend_text: {
    color: '#ccc',
    fontSize: F(14),
  },
});
