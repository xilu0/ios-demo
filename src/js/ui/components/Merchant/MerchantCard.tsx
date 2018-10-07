import { observer } from 'mobx-react/native';
import React from 'react';
import { Image, StyleSheet , Text, TouchableWithoutFeedback, View } from 'react-native';

import { F,  W } from 'js/helper/UI';
import { MerchantModel } from 'js/store/HomeStore';
import { Colors } from 'js/style/colors';
import { PlaceholderItem } from 'js/ui/components/PlaceholderItem';

interface IProps {
  onPress: () => void;
  merchant: MerchantModel;
}

@observer
export class MerchantCard extends React.Component<IProps, any> {
  public render() {

    const contentView = (
  <TouchableWithoutFeedback  key={Math.random()} onPress={this.props.onPress}>
    <View style={styles.item}>
      <Image source={{ uri: this.props.merchant.coverPath, cache:'force-cache' }} style={styles.item_image}/>
        <View style={styles.item_head}>
          <Text style={styles.item_head_left} numberOfLines={1}>{this.props.merchant.name}</Text>
          <Text style={styles.item_head_right}>¥{this.props.merchant.averageConsume}/人</Text>
        </View>

        <View style={styles.item_foot}>
          <Text style={styles.item_foot_text}>{this.props.merchant.discountSetting + '折'}</Text>
          <View style={[styles.item_foot_line, styles.marginLeft]} />
          <Text style={[styles.item_foot_text, styles.marginLeft]}>{this.props.merchant.categoryName}</Text>
          <View style={[styles.item_foot_line, styles.marginLeft]} />
          <Text style={[styles.item_foot_text, styles.marginLeft]}>{this.props.merchant.distance}km</Text>
        </View>
    </View>
    </TouchableWithoutFeedback>);
    const view = this.props.merchant ? contentView : <PlaceholderItem type={2} />;
    return (
      view
    );
  }
}

const styles = StyleSheet.create({
  item: {
    width: W(158),
    marginBottom: W(29),
  },
  item_image: {
    height: W(106),
    width: W(158),
    borderRadius: W(2),
    backgroundColor:'#f2f2f2',
  },

  placeImg:{
    height: W(106),
    width: W(158),
    borderRadius: W(2),
    resizeMode:'center',
  },
  item_head: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: W(35),
  },
  item_head_left: {
    fontSize: F(15),
    color: Colors.TITLE_BLACK,
    fontWeight: 'bold',
    maxWidth:W(108),
  },
  item_head_right: {
    fontSize: F(12),
    fontWeight:'400',
    color: Colors.TITLE_BLACK,
  },

  item_foot: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: W(14),
    marginTop: -2,
  },

  item_foot_line: {
    width: W(1),
    height: W(10),
    backgroundColor: '#B3B3B3',

  },

  item_foot_text: {
    color: Colors.TITLE_BLACK,
    fontSize: F(11),
    fontWeight:'500',
    alignItems: 'center',
  },
  marginLeft: {
    marginLeft: W(5),
  },

  item_foot_text_max:  { maxWidth: W(45) },
});
