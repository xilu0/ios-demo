import { observer } from 'mobx-react';
import React from 'react';
import { Image, StyleSheet,  Text, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { Body15 } from 'js/api';
import { NavigationKeys } from 'js/const/NavigationKeys';
import { getStore } from 'js/helper/Store';
import {  F, isiPhone, W } from 'js/helper/UI';
import { CategoryModel, HomeStore } from 'js/store/HomeStore';
import { QueryParams } from 'js/type/merchant';
import { PlaceholderItem } from 'js/ui/components/PlaceholderItem';
import { Touchable } from 'js/ui/components/Touchable';

interface IProps {
  navigation: NavigationScreenProp<IProps, any>;
  homeStore: HomeStore;
}

@observer
export class Categories extends React.Component<IProps> {

  public render() {
    const onpush = (item: CategoryModel) => {
      if (item.id === -1) {
        this.props.navigation.navigate(NavigationKeys.AllCategories);
      } else {
        const { merchantListStore: store } = getStore();
        store.resetMenuQueryStatus(new QueryParams({
          keyword: undefined,
          categoryId: item.id,
          keywordType: Body15.KeywordTypeEnum.Category,
        }));
        this.props.navigation.navigate(NavigationKeys.MerchantList);
      }

    };
    const { categoryArray } = this.props.homeStore;

    const getView = (item: CategoryModel, index: number) => {
      const imgUrl =   item.id ===  -1 ? require('img/homeIcon/bigger.png') :{ uri:item.iconPath };
      const itemStyle = isiPhone() ? styles.item :styles.itemAndroid;
      const imageStyle = isiPhone() ? styles.itemImage :styles.itemImageAndroid;
      const nameStyle = isiPhone() ? styles.name : styles.nameAndroid;
      const marleft = index === 0 || index === 4 ? !isiPhone() ? styles.marginleft :null :null;
      const marright = index === 3  || index === 7 ? !isiPhone() ? styles.marginright :null :null;
      const martop = index <= 3  ? !isiPhone() ? styles.margitop :null :null;

      return (
        <Touchable
          underlayColor={'rgba(0,0,0,0)'}
          key={`${item.id} + ${Math.random().toFixed(2)}`}
          onPress={onpush.bind(this, item)}
        >
          <View style={[itemStyle, marleft, marright]}>
            <Image source={imgUrl} style={[imageStyle, martop]}/>
            <Text style={nameStyle}>{item.name}</Text>
          </View>
        </Touchable>
      );
    };

    const list = categoryArray.slice()
    // filter null data
    .filter((item: CategoryModel, index: number) => {
      if (item.id === -1) {
        return true;
      }
      return item.id && item.name && item.iconPath && index;
    })
    .map(getView);
    const contentView = list.length > 0 ? (
    <View style={styles.continer}>
      {list}
      <View style={styles.segmentation}/>
     </View>) :<PlaceholderItem type={0} viewStyle={styles.placeItem}/>;
    return (
      contentView
    );
  }
}

const styles = StyleSheet.create({

  continer:{
    flex:1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor:'#fff',
  },

  item:{
    width:W(90),
    height:W(70),
    alignItems:'center',
    justifyContent:'flex-start',
    marginLeft: W(3),
    marginTop: -5,

  },

  itemAndroid:{
    width:W(70),
    height: W(60),
    alignItems:'center',
    justifyContent:'center',
    marginTop: W(3),
    marginLeft: W(21),
  },
  marginleft:{ marginLeft:W(16) },
  marginright:{ marginRight:W(16) },

  itemImage:{
    width:W(31),
    height:W(31),
    marginTop: W(27),
  },

  itemImageAndroid:{
    width:W(31),
    height:W(31),

  },
  margitop:{
    marginTop: W(5),
  },

  name:{
    fontSize:F(12),
    fontWeight:'400',
    color:'#454545',
    top:W(9),
    textAlign:'center',
  },
  nameAndroid:{
    fontSize:F(12),
    fontWeight:'400',
    color:'#454545',
    textAlign:'center',
  },

  segmentation:{
    height:W(10),
    width:W(375),
    backgroundColor:'#f2f2f2',
    marginTop: isiPhone() ? W(30) :W(15),
  },
  placeItem:{
    width:W(375),
    height:W(159),
    marginTop: W(10),
    backgroundColor:'#F4F4F4',
  },
});
