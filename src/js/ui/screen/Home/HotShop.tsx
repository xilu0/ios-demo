import { inject, observer } from 'mobx-react';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { NavigationKeys } from 'js/const/NavigationKeys';
import { navigate } from 'js/helper/navigate';
import { F, W } from 'js/helper/UI';
import { HomeStore , MerchantModel } from 'js/store/HomeStore';
import { Colors } from 'js/style/colors';
import { Bubbles } from 'react-native-loader';
import { HotMerchant } from './HotMerchant';

interface IProps {
  navigation: NavigationScreenProp<any>;
  homeStore: HomeStore;
  title?: string;
  isPlusType?:boolean;
}

const ITEM_HEIGHT = W(184);

@inject('homeStore')
@observer
export class HotShop extends React.Component<IProps, any> {

  constructor(props: IProps) {
    super(props);
    this.toEnd = this.toEnd.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onShopClick = this.onShopClick.bind(this);
    this.getView = this.getView.bind(this);
    this.keyExtractor = this.keyExtractor.bind(this);
    this.getItemLayout = this.getItemLayout.bind(this);
  }

  public onShopClick = (merchantId: number) => {
    navigate(NavigationKeys.MerchantDetail, {
      merchantId,
    });
  }

  public getView = (merchant: MerchantModel) => {  
    const props = this.props;
    return (
          <HotMerchant 
            isPlusType={props.isPlusType} 
            merchant={merchant} 
            key={merchant.id} 
            onPress={this.onShopClick.bind(this, merchant.id)} 
          />);
  }

  public keyExtractor = (merchant: MerchantModel) => {
    return `key_${merchant.id}_${Math.random().toFixed(2)}`;
  }

  public toEnd = () => {
    this.props.homeStore.pullUp(10);
  }
  public goPlusMerchant = () => {
    // this.props.homeStore.setPlusData(1);
    this.props.navigation.navigate(NavigationKeys.MerchantList);
  }
  public renderPlusBootom = () => {
    const isPlusType = this.props.isPlusType;
    let ele;
    if (isPlusType) {
      ele = (
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={this.goPlusMerchant}
          style={styles.plusBtn}
        >
          <Text style={styles.plusText}>显示全部精选商家</Text>
        </TouchableOpacity>);
    } else {
      ele =  <View/>;
    }
    return ele;
  }
  public renderFooter() {
    const loading = this.props.homeStore.isMaxHotMechantLength ? this.renderPlusBootom() :  (<View style={{ flex:1, justifyContent:'center', alignItems:'center', height:W(40) }}>
    <Bubbles size={W(6)} color='rgba(248,49,70,0.75)' />
    </View>);
    return loading;
  }

  public getItemLayout(data: any[] | null, index: number) {
    return { index, length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index };
  }

  public render() {
    const props = this.props;
    const list = props.isPlusType ? 
          this.props.homeStore.hotMerchantArray.slice(0, 10) : this.props.homeStore.hotMerchantArray.slice();
    const getView = (info: any) => {
      return this.getView((info.item) as MerchantModel);
    };

    return (
      <View style={{ flex: 1 }}>
          <Text style={styles.title}>{this.props.title || '人气好店'}</Text>
        <View style={styles.container}>
          <FlatList
            initialNumToRender={4}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            data={list}
            keyExtractor={this.keyExtractor}
            renderItem={getView}

            onEndReached={this.toEnd}
            onEndReachedThreshold={0.5}
            ListFooterComponent={this.renderFooter}
            // removeClippedSubviews={true}

          />

        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: W(16),
    paddingRight: W(16),
    backgroundColor: '#fff',

  },
  listview_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },

  footerRefresh:{
    marginBottom: W(25),
    flex: 1,
    height:W(30),
    justifyContent:'center',
    alignItems: 'center',
  },
  title:{
    marginLeft: W(16),
    marginTop: W(48),
    marginBottom: W(24),
    backgroundColor:'#FFF' ,
    lineHeight:W(30),
    fontSize: F(22),
    color: Colors.TITLE_BLACK,
    fontWeight: '900',
    fontFamily: 'PingFangSC-Semibold',

  },
  plusBtn:{
    width:W(340),
    height:W(49),
    borderColor:'#DAB779',
    borderWidth:StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:W(30),
  },
  plusText:{
    color:'#DAB779',
    fontSize:F(16),
  },
});
