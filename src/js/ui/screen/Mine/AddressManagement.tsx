import React from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { NavigationScreenProp } from 'react-navigation';

import {  Image, StyleSheet , Text, TouchableHighlight, View } from 'react-native';
import { AddressListItem } from './AddressListItem';

import { px2dp, setFontSize } from 'js/helper/Adapter';
import { errorHandle } from 'js/helper/Respone';
import { W } from 'js/helper/UI';
import { AddressModel, AddressStore } from 'js/store/UserStore';
import { inject, observer, Observer } from 'mobx-react/native';
import { appHeader } from 'js/ui/components/Navigation';

interface IProps {
  navigation: NavigationScreenProp<any>;
  addressStore: AddressStore;
}

@inject('addressStore')
@observer
@appHeader('地址管理')
export class AddressManagement extends React.Component<IProps, {} > {
  public constructor(props: any) {
    super(props);
  }

  public componentWillMount() {
    this.props.addressStore.requestGetAddresses();
  }

  public deleteRow(data: {index: number, item: AddressModel }) {
    this.props.addressStore.requestDeleteAddress(data.item).catch(errorHandle);
  }

  private renderRow = (data: {item: AddressModel, index: number}) => {
    const addressListItemFn = () => {
      return  (
          <AddressListItem
            navigation={this.props.navigation}
            addressModel={data.item}
            index={data.index}
            {...this.props}
          />
      );
    };

    return (
      <Observer>{addressListItemFn}</Observer>
    );
  }
  private renderHiddenRow = (data: {index: number, item: AddressModel }) => {
    const onPress = () => this.deleteRow(data);
    return (
      <View style={styles.rowBack}>
        <TouchableHighlight
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={onPress}
          underlayColor={'rgba(0,0,0,0)'}
        >
        <Image source={require('img/Rubbish.png')}style={styles.deleteBtn}/>
        </TouchableHighlight>
      </View>
    );
  }

  private keyExtractor = (data: {item: object}, index: number) => {
    return `key_${index}`;

  }

  public render() {

    const onPress = () => {
      const params = {
        model: new AddressModel(),
        type: '',
        index: -1,
      };
      this.props.navigation.navigate('NewAddress', params);
    };
    const data = this.props.addressStore.addressList;
    const epmtyView = (
      <View>
      <Image
        source={require('img/address.png')}
        style={styles.empty}
      />
      <Text style={styles.showText}>收货地址在哪里</Text>
      </View>
      );
    const showEmpty = data.length === 0 ? epmtyView :null;
    return(
      <View style={styles.continer}>
      {showEmpty}
      <View style={styles.list}>
        <SwipeListView
          keyExtractor={this.keyExtractor}
          useFlatList={true}
          data={data}
          rightOpenValue={-60}
          disableRightSwipe={true}
          renderItem={this.renderRow}
          renderHiddenItem={this.renderHiddenRow}
          previewRowKey={'0'}
          previewOpenValue={0}
        />
        </View>
          <TouchableHighlight style={styles.bottomBtn} onPress={onPress} underlayColor={'rgba(0,0,0,0)'}>
            <Text style={styles.text} >+ 新建地址</Text>
          </TouchableHighlight>
       </View>
    );
  }
}

const styles = StyleSheet.create({

  continer:{
    flex:1,
    backgroundColor:'#fff',
  },
  empty:{
    width:W(140),
    height:W(90),
    marginTop:W(195),
    resizeMode:'stretch',
    alignSelf:'center',
  },
  showText:{
    fontSize:setFontSize(14),
    fontWeight:'400',
    color:'#848484',
    top:px2dp(45),
    alignSelf:'center',
  },
  list:{
    marginBottom:78,
    flex:1,
  },
  backImage:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:44,
  },

  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },

  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 60,
  },

  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },

  deleteBtn:{
    width:px2dp(35),
    height:px2dp(33),
  },
  bottomBtn:{
    position:'absolute',
    left:px2dp(30),
    bottom:px2dp(30),
    width:px2dp(690),
    height:px2dp(96),
    borderWidth:px2dp(1),
    borderColor:'#B4292E',
    borderRadius:px2dp(4),
    alignItems:'center',
    justifyContent:'center',
  },

  text:{
    fontSize:setFontSize(14),
    color:'#B4292E',
    fontWeight:'400',
  },
});
