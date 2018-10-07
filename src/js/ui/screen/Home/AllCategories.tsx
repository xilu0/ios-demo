import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { Body15 } from 'js/api';
import { NavigationKeys } from 'js/const/NavigationKeys';
import { setFontSize } from 'js/helper/Adapter';
import { getStore } from 'js/helper/Store';
import { F, ifiPhoneX, isiPhone, StatusBarHeight, W } from 'js/helper/UI';
import { CategoryModel, HomeStore } from 'js/store/HomeStore';
import { QueryParams } from 'js/type/merchant';
import { action, computed, observable } from 'mobx';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react/native';

interface IProps {
  navigation: NavigationScreenProp<IProps>;
  homeStore: HomeStore;

}

@inject('homeStore')
@observer
export class AllCategories extends React.Component<IProps> {

  @observable private leftIndex: number = 0;

  @computed private get rightData() {
    return  this.props.homeStore.allCategoryArray[this.leftIndex].children;
  }

  @action private setLeftIndex(index: number) {
    this.leftIndex = index;
  }

  public renderLeftItem = (item: CategoryModel, index: number) => {
    const style = index === this.leftIndex ? styles.selectedText : null;
    const viewStyle = index === this.leftIndex ? styles.selectView : null;
    const tap = () => {
      this.setLeftIndex(index);
    };
    return(
      <TouchableWithoutFeedback style={{ flex:1 }} key={item.id} onPress={tap}>
        <View style={styles.item}>
        <View style={[styles.normalView, viewStyle]}>
          <Text style={[styles.nomalText, style]}>{item.name}</Text>
          </View>
          </View>
      </TouchableWithoutFeedback>
    );
  }

  public renderLeftView = (data: any) => {
    let i = 0;
    const list: any [] = [];
    for (const item of data) {
      list.push(this.renderLeftItem(item, i));
      i += 1;
    }
    return(
      <ScrollView  style={{ width:W(78) }}>
        <View style={styles.scrollview}>
          {list}
        </View>
        </ScrollView>
    );
  }

  public renderRightTopView = () => {
    return(
      <View style={styles.topView}>
        <Image source={require('img/classification.png')} style={styles.banner}/>
        <View style={styles.titleView}>
          <View style={styles.titleLine}/>
          <Text style={styles.title}>推荐专区分类</Text>
          <View style={styles.titleLine}/>
        </View>
      </View>
    );
  }
  public renderRightItem = (item: CategoryModel) => {
    const tap = () => {
      const { merchantListStore: store } = getStore();
      store.resetMenuQueryStatus(new QueryParams({
        keyword: undefined,
        categoryId: item.id,
        keywordType: Body15.KeywordTypeEnum.Category,
      }));
      this.props.navigation.navigate(NavigationKeys.MerchantList);
    };
    return(
      <TouchableWithoutFeedback style={{ flex:1 }} key={item.id} onPress={tap}>
        <View style={styles.rightItem}>
          <Image source={{ uri:item.iconPath }} style={styles.itemImage}/>
          <Text style={styles.itemText}>{item.name}</Text>
          </View>
      </TouchableWithoutFeedback>
    );
  }

  public renderRightBottomView = (data: any) => {
    const list: any [] = [];
    for (const item of data) {
      list.push(this.renderRightItem(item));
    }
    return(
      <View style={styles.categoryView}>
        {list}
        </View>
    );
  }

  public renderRightView = () => {

    return(
      <ScrollView  style={{ width:W(297) }}>
        <View style={styles.rightView}>
        {this.renderRightTopView()}
        {this.renderRightBottomView(this.rightData)}
        </View>
        </ScrollView>
    );
  }

  public goBack = () => {
    this.props.navigation.goBack();
  }
  public render() {
    const { allCategoryArray } = this.props.homeStore;
    const onInputClick = () => {
      this.props.navigation.navigate(NavigationKeys.Search, { transition: 'forVertical' });
    };
    return(
      <View style={{ flex:1 }}>
      <StatusBar
          hidden={false}
          animated={true}
          barStyle={'dark-content'}
      />
       <View style={styles.header}>
            <TouchableOpacity onPress={this.goBack} style={styles.backBtn} >
              <Image source={require('img/navBack.png')} style={styles.backImage}/>
            </TouchableOpacity>
            <TouchableWithoutFeedback style={{ flex:1 }} onPress={onInputClick}>
            <View style={styles.searchView}>
              <Image source={require('img/homeIcon/sousuo.png')} style={styles.inputImage}/>
              <Text style={styles.input}>搜索 菜品 店铺 分类</Text>
            </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.topLine}/>
      <View style={styles.continer}>
        {this.renderLeftView(allCategoryArray)}
        <View style={styles.line}/>
        {this.renderRightView()}
        </View>
        </View>
    );
  }

}

const styles = StyleSheet.create({
  continer:{
    width:W(375),
    flex: 1,
    flexDirection: 'row',
    justifyContent:'flex-start',
    backgroundColor:'#fff',
    marginTop: W(44) + ifiPhoneX(40, 20, StatusBarHeight),
  },
  item:{
    width:W(78),
    height:W(45),
    alignItems: 'center',
    justifyContent:'center',

  },
  normalView:{
    width:W(78),
    height:W(25),
    borderLeftWidth: W(3),
    borderLeftColor: '#fff',
  },
  selectView:{
    width:W(78),
    height:W(25),
    borderLeftWidth: W(3),
    borderLeftColor: '#FF5A5F',
  },
  selected:{
    width:W(3),
    height:W(25),
    backgroundColor:'#FF5A5F',
    paddingLeft:0,
  },
  selectedText:{
    width:W(78),
    fontSize: setFontSize(14),
    color:'#FF5A5F',
    fontWeight: '400',
    height:W(25),
    textAlign:'center',
    paddingTop:W(4),
  },
  nomalText:{
    color:'#484848',
    width:W(78),
    fontSize: setFontSize(14),
    fontWeight: '400',
    height:W(25),
    textAlign:'center',
    paddingTop:W(4),
  },
  scrollview:{
    width:W(78),
    flexDirection: 'column',
    justifyContent:'flex-start',
    paddingLeft: 0,
  },
  categoryView:{
    width:W(297),
    flexDirection:'row',
    justifyContent:'flex-start',
    flexWrap: 'wrap',
  },
  rightItem:{
    width:W(294 / 3),
    height:W(294 / 3),
    flexDirection:'column',
    justifyContent:'center',
    alignItems: 'center',
    // marginTop: W(14),
  },
  itemImage:{
    width:W(48),
    height:W(48),
    borderRadius: W(24),
  },
  itemText:{
    fontSize: F(12),
    color:'#333333',
    fontWeight: '400',
    marginTop: W(15),
  },
  topView:{
    height:W(160),
    width:W(375 - 78),
    flexDirection:'column',
    justifyContent:'flex-start',
  },
  banner:{
    width:W(255),
    height:W(97),
    marginLeft: W(19),
    marginTop: W(14),
    borderRadius:W(3) ,
  },
  title:{
    fontSize: setFontSize(12),
    color:'#333333',
    fontWeight: '400',
    textAlign:'center',
    paddingLeft: 10,
    paddingRight: 10,

  },
  rightView:{
    width:W(297),
    flexDirection: 'column',
    justifyContent:'flex-start',
    marginLeft:0,
  },
  line:{
    width:W(0.8),
    height:W(667),
    backgroundColor:'#E6E6E6',
    marginLeft: 0,
  },

  backImage:{
    height: W(16),
    width: W(10),
    // resizeMode: 'stretch',
    marginRight: W(8),
  },
  header:{
    width:W(375),
    height:W(44) + ifiPhoneX(40, 20, StatusBarHeight),
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    position:'absolute',
    backgroundColor:'#fff',
  },

  searchView:{
    width:W(294),
    height:W(33),
    borderRadius:W(17),
    backgroundColor:'#F0F0F0',
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    marginLeft:W(10),
    marginTop:ifiPhoneX(40, 20, StatusBarHeight),
  },

  inputImage:{
    width:W(14),
    height:W(14),
    marginLeft:W(10),
  },
  input:{
    marginLeft:W(11),
    fontSize: setFontSize(15),
    color:'#92969C',
    alignSelf: 'center',
  },
  titleView:{ justifyContent:'center' , alignItems:'center' , flexDirection:'row' , marginTop:W(22) },
  titleLine:{
    width:W(20),
    height: isiPhone() ? StyleSheet.hairlineWidth :W(0.8),
    backgroundColor:'#d9d9d9' ,
    alignSelf:'center',
  },
  topLine:{
    backgroundColor:'#e6e6e6',
    height:isiPhone() ? StyleSheet.hairlineWidth :W(0.8),
    width:W(375),
  },
  backBtn: {
    width: W(44),
    height: W(44),
    justifyContent:
    'center',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
});
