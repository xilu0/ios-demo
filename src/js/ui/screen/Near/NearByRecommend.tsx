
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { F, W } from 'js/helper/UI';
import { MerchantListStore } from 'js/store/MerchantListStore';
import { NearStore } from 'js/store/NearStore';
import { Colors } from 'js/style/colors';
import { observer } from 'mobx-react/native';
import FastImage from 'react-native-fast-image';


interface IProps {
  store: NearStore | MerchantListStore;
}

@observer
export class NearByRecommend extends React.Component<IProps, any> {
  public render() {
    const show = this.props.store.merchant.isEmpty && !this.props.store.merchant.loading;
    const renderView = show ? (
      <View style={styles.recommend}>
        <FastImage style={styles.recommend_img} source={require('img/emptyData.png')} />
        <Text style={styles.recommend_text}>您的搜索暂无数据</Text>
        <View style={styles.recommend_line}/>
        <Text style={styles.recommend_line_text}>为您推荐</Text>
      </View>
    ) : null;
    return renderView;
  }
}

const styles = StyleSheet.create({
  recommend: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    paddingLeft: W(3),
    paddingRight: W(3),
    height: W(30),
    transform: [{ translateY: -W(15) }],
  },

});
