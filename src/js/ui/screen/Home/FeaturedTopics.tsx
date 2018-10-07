
import { observer } from 'mobx-react';
import { inject } from 'mobx-react/native';
import React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View ,ScrollView} from 'react-native';

import { NavigationKeys } from 'js/const/NavigationKeys';
import {  px2dp } from 'js/helper/Adapter';
import { getStore } from 'js/helper/Store';
import {  F, isiPhone, W } from 'js/helper/UI';
import { HomeStore, TopicModel } from 'js/store/HomeStore';
import { QueryParams } from 'js/type/merchant';

import { PlaceholderItem } from 'js/ui/components/PlaceholderItem';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationScreenProp } from 'react-navigation';
import { navigate } from 'js/helper/navigate';
import FastImage from 'react-native-fast-image';

interface IProps {
  homeStore: HomeStore;
  topic: TopicModel;
  navigation: NavigationScreenProp<any>;
}

class TopicItem extends React.Component<{
  item:TopicModel,
  index:number,
  len:number,
},any>{

  public onItemClick = (item: TopicModel) => {
    const { merchantListStore: store } = getStore();
    store.resetMenuQueryStatus(new QueryParams({
      keyword: undefined,
      topicId: item.id,
    }));
    navigate(NavigationKeys.MerchantList, {
      name: item.name,
    });
  }

  render(){
    const item = this.props.item;
    const index = this.props.index;
    const len = this.props.len;
    const itemMarginLeft = index > 0 ? styles.itemLeft :null;
    const itemMarginRight = index === len - 1 ? styles.itemRight :null;
    const contentView = item.name !== undefined ?  (
      <TouchableWithoutFeedback onPress={this.onItemClick.bind(this, item)}>
            <View style={[styles.item, itemMarginLeft, itemMarginRight]}>
              <FastImage
                style={{ width:W(125), height:W(71) }}
                source={{
                  uri: item.coverPath,
                  headers:{ Authorization: 'someAuthToken' },
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.stretch}
              />
              <View style={styles.shadow_card}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemIntro}>{item.slogan}</Text>
              </View> 
           </View>
        </TouchableWithoutFeedback>
) : <PlaceholderItem  type={0} viewStyle={styles.item} key={index}/>;
    return(
      contentView
    );
  }
}


@inject('homeStore')
@observer
export class FeaturedTopics extends React.Component <IProps, any> {

  
  public renderAllItem() {

    const { topicArray } = this.props.homeStore;
    const itemArr = [];

    for (let i = 0; i < topicArray.length; i += 1) {

      const item  = <TopicItem item={topicArray[i]} index={i} len={topicArray.length} key={i}/>;
      itemArr.push(item);
    }
    return itemArr;
  }

  public render() {

    const textView = this.props.homeStore.topicArray.length > 0 ?
     (<Text style={styles.title}>精选专题</Text>) :<View style={styles.line}/>;
    const shadowW = this.props.homeStore.topicArray.length * 125 +   (this.props.homeStore.topicArray.length - 1) * 12 + 4;
    return(
      <View style={styles.continer}>
        {textView}
          <ScrollView
            style={styles.fastlist}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            bounces={true}
            decelerationRate={0.95}
          >
           <View style={[styles.bgShadow, { width:W(shadowW) }]}>
              <LinearGradient
                  colors={['rgba(255, 255, 255,0)', 'rgba(215, 215, 215,0.3)']}
                  style={[{ width:W(shadowW), height:W(69) ,borderRadius:W(3)}]}
              >
              </LinearGradient>
            </View> 
            {this.renderAllItem()}

          </ScrollView>
        
      </View>
    );
  }
}



const styles = StyleSheet.create({
  continer:{
    flex:1,
    backgroundColor:'#fff',
    // height:W(228),
  },

  title:{
    marginLeft:W(16),
    marginTop:W(48),
    fontSize:F(22),
    fontWeight:'900',
    fontFamily: 'PingFangSC-Semibold',
    lineHeight:W(30),
    height:W(30),
    color:'#484848',
  },
  fastlist:{
    marginTop:W(23),
    width:W(375),
    height:W(130),
    position:'relative',
  },
  item:{
    width: W(125),
    height: W(126),
    marginLeft:W(15),
    borderRadius: W(3),
    borderWidth: 0.5,
    overflow: 'hidden',
    borderColor:'#B3B3B3',

  },

  shadow_card: {
    width: W(125),
    height: W(54),
    backgroundColor:'#fff',

  },

  bgShadow:{
    position:'absolute',
    top:W(59),
    left:W(13),
    right:W(13),
    borderRadius:W(3),
  },

  itemLeft:{
    marginLeft: W(12),
  },

  itemRight:{
    marginRight:W(15),
  },

  itemImage:{
    width:W(125),
    height:W(71),
  },

  placeImg:{
    width:W(125),
    height:W(70),
    resizeMode:'center',
  },

  itemTitle:{
    marginLeft:W(10),
    marginTop:  W(6),
    fontSize:F(13),
    fontWeight:'700',
    lineHeight:W(18),
    color:'#484848',
  },
  itemIntro:{
    marginLeft:px2dp(21),
    marginTop: isiPhone() ? W(8) :W(2),
    fontSize:F(11),
    fontWeight:'500',
    color:'#666666',
  },

  placeitem:{
    backgroundColor:'#F4F4F4',
    width: W(125),
    height: W(124),
    padding: W(5),
    marginLeft:W(15),

  },
  line:{
    marginLeft: W(24),
    width:W(100),
    height:W(22),
  },

});
