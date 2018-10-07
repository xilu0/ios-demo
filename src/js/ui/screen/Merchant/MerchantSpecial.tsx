
import { F, W } from 'js/helper/UI';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { MerchantDishModel, MerchantStore } from 'js/store/MerchantStore';

import { PlaceholderItem } from 'js/ui/components/PlaceholderItem';
import { Colors } from 'js/style/colors';
import FastImage from 'react-native-fast-image'


interface IProps {
  merchantStore: MerchantStore;
  onItemClick: (item: MerchantDishModel, index: number) => void;
}

export class MerchantSpecial extends React.Component<IProps, any> {

  public renderSpecialItem (index: number, sum: number, item: MerchantDishModel) {
    const styleLeft = index === 0 ? null :styles.itemLeft;
    const styleRight = index === sum - 1 ? styles.itemRight :null;

    const RenderStarView = Array.from({ length: item.recommandIndex || 0 }).map((indexs) =>  {
      const starLeft = indexs === 0 ? null : { marginLeft:W(2) };
      return (
        <FastImage
          key={Math.random()}
          style={[styles.star, starLeft]}
          source={require('img/merchant/newStar.png')}
        />
      );
    });

    const view = (
      <TouchableWithoutFeedback onPress={this.onpress.bind(this, item, index)} key={item.id}>
        <View style={[styles.itemViewStyle , styleLeft, styleRight]}>
            <FastImage
                style={styles.imageStyle}
                source={{
                  uri: item.picPath,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.stretch}
              />
            <Text  style={styles.name} numberOfLines={2}>{item.name}</Text>
            <View style={styles.averView}>
              <Text style={styles.average}>¥{item.price}</Text>
              {/* <Text style={styles.average}>每人</Text> */}
            </View>
            {/* <View style={styles.starView}>
              {RenderStarView}
            </View> */}
        </View>
        </TouchableWithoutFeedback>
      );
    const contentView = item.name ? view :
     <PlaceholderItem type={2} viewStyle={styles.itemViewStyle} topviewStyle={styles.placeImg} key={index}/>;
    return (
      contentView
    );
  }
  public onpress = (item: MerchantDishModel, index: number) => {
    this.props.onItemClick(item, index);
  }

  public renderAllItem(data: any) {
    const itemArr = [];

    for (let i = 0; i < data.length; i += 1) {

      const item  = this.renderSpecialItem(i, data.length, data[i]);
      itemArr.push(item);
    }
    return itemArr;
  }

  public render() {
    const  { dishs } = this.props.merchantStore;
    return(
          <ScrollView
            style={styles.scrollViewStyle}
            horizontal={true} // 横向
            showsHorizontalScrollIndicator={false}
            decelerationRate={0.95}

          >
          {this.renderAllItem(dishs)}
          </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  itemViewStyle:{
    width:W(167),
    height:W(160),
    backgroundColor:'white',
    marginLeft:W(15),
    borderRadius:W(3),
  },
  itemLeft:{
    marginLeft:W(11),
  },
  itemRight:{
    marginRight:W(15),
  },
  imageStyle:{
    width:W(167),
    height:W(106),
    borderRadius:W(3),
    overflow:'hidden',
    backgroundColor:'#f4f4f4',
  },
  scrollViewStyle:{
    width:W(375),
    height:W(160),
  },
  placeImg:{
    width:W(167),
    height:W(106),
    borderRadius:W(3),
  },

  name:{
    maxWidth:W(167),
    color:Colors.TITLE_BLACK,
    fontSize: F(14),
    fontWeight: '700',
    lineHeight:W(17),
    marginTop: W(5),
  },
  average:{
    color:Colors.TITLE_BLACK_8,
    fontSize: F(12),
    fontWeight: '400',
  },
  averView:{
    height:W(21),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 1,

  },
  starView:{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: W(1),
  },
  star:{
    width:W(7),
    height:W(7),
  },
});
