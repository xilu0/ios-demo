import { F,  W } from 'js/helper/UI';
import { MerchantServiceModel, MerchantStore } from 'js/store/MerchantStore';
import React from 'react';
import {  StyleSheet, Text, View } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';

interface IProps {
  merchantStore: MerchantStore;

}

export class MerchantCondition extends React.Component<IProps, any> {

  public render() {
    const itemView = (this.props.merchantStore.services || []).map((item: MerchantServiceModel) => {
      return (
         <View style={styles.item} key={item.name}>
         <ImageLoad
            style={styles.item_image}
            isShowActivity={false}
            source={{ uri: item.iconPath }}
            placeholderSource={require('img/place.png')}
            placeholderStyle={styles.placeImg}
         />
         <Text style={styles.item_text}>{item.name}</Text>
       </View>);
    });
    return(
      <View style={styles.wrap}>
        <View style={styles.box}>
         {itemView}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrap: {},
  box: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  item: {
    width: W(375 / 4),
    alignItems: 'center',
    marginBottom: W(24),
  },
  item_image: {
    width: W(31),
    height: W(31),
  },

  placeImg:{
    width: W(31),
    height: W(31),
    resizeMode:'center',
  },
  item_text: {
    color: '#111111',
    fontSize: F(12),
  },
  text: {
    color: '#111111',
    fontSize: F(14),
    marginTop: W(10),
    paddingLeft: W(15),
    paddingRight: W(24),
  },
});
