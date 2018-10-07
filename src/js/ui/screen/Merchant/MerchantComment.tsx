import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { F,  isiPhone, W } from 'js/helper/UI';

import { Colors } from 'js/style/colors';
import { NavigationScreenProp } from 'react-navigation';
import Carousel from 'react-native-snap-carousel';


interface IProps {
  // merchantStore: MerchantStore;
  navigation: NavigationScreenProp<any>;
}

class CommmentItem extends React.Component {
  public render() {
    return(
      <View style={styles.continer}>
        <View style={styles.videoView}>
          <Image source={require('img/merchant/video_cover.png')} style={styles.coverImage}/>
          <Text style={styles.duration}>11:57</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>海参炒面
        <Text style={styles.commentContent}> 滑动至评论、系统判断用户是否处于wifi环境，是自动</Text></Text>
        <View style={styles.bottomView}>
         <View style={styles.bottomLeftView}>
            <Image source={require('img/2b.jpeg')} style={styles.avatar}/>
            <Text style={styles.nickName} numberOfLines={1}>你丫就是一个美工</Text>
         </View>
         <View style={styles.bottomRightView}>
          <Text style={styles.priseNum}>10</Text>
          <Image source={require('img/merchant/like.png')} style={styles.likeImage}/>
         </View>
        </View>
    </View >
    );
  }
}

export class MerchantComment extends React.Component<IProps, any> {


  public renderItem =(data:{item: any}) =>{

      return<CommmentItem />;
  }

  public render() {

    return(
        <Carousel
          data={[1,2,3]}
          renderItem={this.renderItem}
          sliderWidth={W(375)}
          itemWidth={W(352)}
          containerCustomStyle={styles.scrollViewStyle}
          activeSlideAlignment={'center'}
          ParallaxImage={true}
          layoutCardOffset={0}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
          swipeThreshold={15}
        />
    );
  }
}

const styles = StyleSheet.create({

  continer:{
    width:W(345),
    height:W(260),
  },
  videoView:{
    width:W(345),
    height:W(180),
  },
  coverImage:{
    width:W(345),
    height:W(180),
    resizeMode:'stretch',
    borderRadius: W(3),
  },
  duration:{
    backgroundColor:'rgba(0,0,0,0.7)',
    position:'absolute',
    right:W(6),
    bottom:W(6),
    lineHeight:W(12),
    color:'#fff',
    fontSize: F(10),
    paddingTop: isiPhone() ? 8 : 4,
    paddingBottom: isiPhone() ? 0 : 4,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 2,
    fontFamily: 'DIN-Medium',
    overflow: 'hidden',
  },
  title:{
    color:Colors.TITLE_BLACK,
    fontSize: F(14),
    fontFamily: 'PingFangSC-Medium',
    marginTop: W(8),
    width:W(345),
  },
  commentContent:{
    color:Colors.TITLE_BLACK,
    fontSize: F(13),
    fontFamily: 'PingFangSC-Light',
  },
  bottomView:{
    width:W(345),
    height:W(25),
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    marginTop: W(6),
  },
  bottomLeftView:{
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems: 'center',
  },
  avatar:{
    width:W(20),
    height:W(20),
    borderRadius: W(10),
  },
  nickName:{
    color:Colors.TITLE_BLACK,
    fontSize: F(11),
    fontFamily: 'PingFangSC-Regular',
    maxWidth:W(120),
    marginLeft: W(6),
    marginBottom:W(10),
  },
  bottomRightView:{
    marginRight:W(4),
    flexDirection: 'row',
    justifyContent:'flex-end',
    alignItems: 'baseline',
  },
  priseNum:{
    fontSize: F(11),
    color:'#888',
    fontFamily: 'PingFangSC-Regular',
    marginRight: W(6),

  },
  likeImage:{
    width:W(15),
    height:W(15),
  },
  scrollViewStyle:{
    width:W(375),
    height:W(260),
    paddingLeft:W(4),
  },
});
