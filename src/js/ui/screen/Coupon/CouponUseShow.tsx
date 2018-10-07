
import { F, isiPhone, W } from 'js/helper/UI';

import { OrderDetailInfo, OrderInfo } from 'js/api';
import { isPhoneX, px2dp } from 'js/helper/Adapter';
import { Colors } from 'js/style/colors';
import { FontWeight } from 'js/style/fonts';
import { LinerGradientButton } from 'js/ui/components/Common/LinerGradientButton';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import {
   Image,
   Modal,
   StyleProp,
   StyleSheet,
    Text,
    TextStyle,
    TouchableHighlight,
    TouchableWithoutFeedback, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import Swiper from 'react-native-swiper';
import { NavigationScreenProp } from 'react-navigation';

interface IProps {
  navigation: NavigationScreenProp<any, any>;
  screenProps: any;
}

export class CouponUseShow extends React.Component<IProps, any, any> {

  private order: OrderInfo = this.props.navigation.getParam('order');
  public orderDetails: OrderDetailInfo[] =  this.order.orderDetails || [];
  public state = {
    isShow: false,
    type:PopupType.Number,
    btntext:'确定',
    title:'选择本次消费券使用张数',
    currentIndex:0,
  };
  public onClose = () => {
    this.setState({ isShow:false });
  }

  public static navigationOptions = ({ screenProps = { statusBarHeight: 0 }, navigation }: IProps) => ({
    title: '代金券',
    headerLeft: (
        <TouchableHighlight
          onPress={navigation.getParam('goBack')}
          style={styles.arrow_left}
          underlayColor={'rgba(0,0,0,0)'}
        >
        <Image source={require('img/merchant/back_black.png')} />
        </TouchableHighlight>
    ),
    headerStyle: {
      paddingTop: screenProps.statusBarHeight,
      height: px2dp(107) + screenProps.statusBarHeight,
      elevation: 0,
      borderBottomColor: '#E6E6E6',
      borderBottomWidth: StyleSheet.hairlineWidth,
      backgroundColor: '#FBFBFB',
    },
    tabBarVisible:false,
    gesturesEnabled: false,
    // headerRight:(
    //   <TouchableHighlight
    //     onPress={navigation.getParam('rightClick')}
    //     style={styles.rightBtn}
    //     underlayColor={'rgba(0,0,0,0)'}
    //   >
    //     <Text style={{ color:'#272727', fontSize:F(16) }}>{navigation.getParam('righttext')}</Text>
    //   </TouchableHighlight>
    // ),
  })

  public constructor(props: any) {
    super(props);
    this.props.navigation.setParams({ goBack: this.goBack.bind(this) });
    this.props.navigation.setParams({ rightClick: this.rightClick.bind(this) });
    const text = this.order.orderDetails!.length > 1 ? '使用多张' :'';
    this.props.navigation.setParams({ righttext: text });

  }

  public goBack() {
    this.props.navigation.goBack();
  }
  public rightClick() {
    this.setState({ isShow:true });
  }
  public popUpClick = () => {
    this.onClose();
    this.setState({ isShow:true, btntext:'确定' , type:PopupType.Number, title:'选择本次消费券使用张数' });

    if (this.state.type === PopupType.Number) {
      this.setState({ isShow:true, btntext:'重新选择多张', type:PopupType.Code, title:'商家扫描券码即可消费' });
    }

  }

  public renderQRCode = (item: OrderDetailInfo) => {
    return (
      <View key={item.id} style={{ width:W(375), alignItems:'center', justifyContent:'center', height:W(350) }}>
      <View style={styles.item} >
        <View style={styles.qrcode}>
          <QRCode size={W(255)} value={item.productSn} />
        </View>
          <Text style={[styles.title_text]}>{`消费码 ${item.productSn}`}</Text>
      </View>
      </View>
    );
  }
  public onChange = (index: number) => {
    this.setState({ currentIndex:index });
  }

  public render() {
    const end = this.order.product!.effectEndTime === null ? '' : this.order.product!.effectEndTime;
    const userfulArray: OrderDetailInfo[] = [];
    this.orderDetails.forEach((item: OrderDetailInfo) => {
      if (item.useStatus === 0) {
        userfulArray.push(item);
      }
    });
    const qrcodeListView = userfulArray.map(this.renderQRCode);
    const page = userfulArray.length > 3 ? (
      <View style={styles.paginationStyle}>
        <Text style={{ color:'#fff', fontSize:F(16) }}>{`${this.state.currentIndex + 1}/${userfulArray.length}`}</Text>
      </View>
    ) : null;
    const show = userfulArray.length <= 3 ? true :false;
    const swiperView = (
      <View style={{ height:W(400) }}>
      <Swiper
        horizontal={true}
        showsButtons={false}
        autoplay={false}
        loop={false}
        showsPagination={show}
        key={userfulArray.length}
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        paginationStyle={styles.pagination}
        bounces={true}
        onIndexChanged={this.onChange}
      >
       {qrcodeListView}
      </Swiper>
      {page}
      </View>
    );

    return (
      <View style={styles.wrap}>
        <LinearGradient
          colors={['rgba(255,74,0,1)', 'rgba(255,115,1,1)']}
          style={styles.linearGradient}
        />
          <View style={styles.header}>
            <Text style={[styles.header_left_text, FontWeight.Semibold]}>
            {this.order.merchant!.name}(总共{`${this.order.orderDetails!.length}`}张)</Text>
            <Text style={[styles.header_right_text, FontWeight.Light]}>有效日期：{end}</Text>
          </View>
         {swiperView}
         <Modal
            transparent={true}
            animationType={'fade'}
            visible={this.state.isShow}
            onRequestClose={this.onClose}
         >
          <View style={{ backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', flex:1 }}>
          <PopupChooseCoupon
            onCloseClick={this.onClose}
            type={this.state.type}
            title={this.state.title}
            titleStyle={{ color:Colors.TITLE_BLACK_3, fontSize:F(15), fontWeight:'300' }}
            buttonText={this.state.btntext}
            onBottonClick={this.popUpClick}
            sum={userfulArray.length}
            data={userfulArray}
          />
          </View>
         </Modal>
      </View>
    );
  }
}

enum PopupType {
  Number= 1, Code= 2,
}

@observer
class PopupChooseCoupon extends React.Component<{
  onCloseClick?: () => void,
  onBottonClick?: () => void,
  type?: PopupType ,
  title?: string,
  buttonText?: string,
  titleStyle: StyleProp<TextStyle>,
  sum?: number,
  data?: any,
}> {

  @observable public orderNumber?: number;
  @observable public isMinus: boolean = false ;
  @observable public isEdgar: boolean = true;

  @computed get currentNumber(): number {
    return this.orderNumber || 1;
  }
  @action public setOrderNumber(num: number) {
    this.orderNumber = num;
  }
  @action public setMinus(enable: boolean) {
    this.isMinus = enable ;
  }
  @action public setEdgar(enable: boolean) {
    this.isEdgar = enable ;
  }

  public minusAction = () => {
    const num = this.currentNumber ;
    this.setOrderNumber(num - 1) ;
    this.setMinus(this.currentNumber > 1 ? true :false);
    this.setEdgar(true);

  }
  public edgarAction = () => {
    const num = this.currentNumber ;
    this.setOrderNumber(num + 1) ;
    this.setMinus(this.currentNumber > 1 ? true :false);
    if (num >= this.props.sum! - 1) {
      this.setEdgar(false);
      return;
    }

  }

  public render() {
    const  snArray: string[] = [];
    this.props.data.forEach((item: OrderDetailInfo) => {
      snArray.push(item.productSn!);
    });
    const closeBtn = (
      <TouchableWithoutFeedback onPress={this.props.onCloseClick}>
      <View style={styles.closeContent}>
        <Image  source={require('img/Order/close.png')} style={styles.closeBtn}/>
        </View>
      </TouchableWithoutFeedback>
    );
    const Title = (
      <Text style={[styles.popupTitle, this.props.titleStyle]}>
      {this.props.title}</Text>
    );

    const footer = (
      <View style={styles.popup_footer}>
      <LinerGradientButton
        buttonStyles={{ width: W(280), borderRadius: W(3), marginBottom:W(28) }}
        colors={['#FF4A00', '#FF7301']}
        text={this.props.buttonText!}
        textStyle={{ fontSize: F(15) }}
        onPress={this.props.onBottonClick}
      />
    </View>
    );

    const minusImage = this.isMinus ? require('img/Order/minus_red.png') :require('img/Order/minus_gray.png');
    const edgarImage = this.isEdgar ? require('img/Order/edgar_red.png') :require('img/Order/edgar_gray.png');
    const  rightContent = (
          <View style={styles.buttonView}>
              <TouchableWithoutFeedback
                disabled={!this.isMinus}
                onPress={this.minusAction}
              >
                <Image source={minusImage}/>
              </TouchableWithoutFeedback>
              <View style={styles.numView}>
              <Image source={require('img/Order/gray_border.png')} />
              <Text style={styles.numText}>{this.currentNumber}</Text>
              </View>
              <TouchableWithoutFeedback
                disabled={!this.isEdgar}
                onPress={this.edgarAction}
              >
              <Image source={edgarImage} style={{ marginLeft:W(11) }}/>
              </TouchableWithoutFeedback>
            </View >
    );

    const middleView = (
      <View style={{ width:W(335), justifyContent:'center', alignItems:'center' }}>
        {rightContent}
      </View>
    );

    const codeView = (
      <View style={{ width:W(335), justifyContent:'center', alignItems:'center' }}>
        <QRCode size={W(255)} value={snArray.slice(0, this.currentNumber).join(',')} />
        </View>
    );

    const contentView = this.props.type === PopupType.Number ? middleView : codeView;

    const padding = this.props.type === PopupType.Number ? { paddingBottom:W(60), paddingTop:W(60) }
    :{ paddingBottom:W(23), paddingTop:W(28) };

    return(
      <View
        style={styles.popup}
      >
        {closeBtn}
        {Title}
        <View style={[{ justifyContent:'center' }, padding]}>
          {contentView}
        </View>
        {footer}
      </View>

    );
  }
}

const styles = StyleSheet.create({
  arrow_left:{
    width: W(60),
    height: W(44),
    alignItems:'center',
    justifyContent:'center',
  },

  wrap: {
    flex: 1,
    position: 'relative',
  },
  linearGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  header: {
    paddingVertical: W(22),
    paddingHorizontal: W(15),
    // alignItems: 'center',
  },

  header_left_text: {
    color: '#FAFAFA',
    fontSize: F(15),
  },

  header_right_text: {
    color: '#FAFAFA',
    fontSize: F(13),
    marginTop: W(7),
  },

  backImage:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:44,
  },
  rightBtn:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:W(80),
    marginRight:6,
  },

  item: {
    width:W(335),
    height:W(350),
    alignItems: 'center',
    backgroundColor:'#fff',
    borderRadius:W(4) ,
  },

  title: {
    // paddingVertical: W(39),
    // alignItems: 'center',
  },

  title_text: {
    color: '#4B4B4B',
    fontSize: F(18),
    marginTop:W(15),
  },

  qrcode: {
    alignItems: 'center',
    marginTop: W(32),
  },
  dotStyle: {
    width: W(8),
    height: W(8),
    backgroundColor: '#fff',
    opacity: 0.5,
    borderRadius: W(4),
    marginLeft: W(8),
  },
  activeDotStyle: {
    width: W(8),
    height: W(8),
    backgroundColor: '#fff',
    borderRadius: W(4),
    marginLeft: W(8),

  },
  paginationStyle: {
    width:W(335),
    height:W(20),
    position:'absolute',
    top:W(370),
    left:W(19) ,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
  },
  pagination: {
    bottom:W(10),
  },
  menu:{
    width:W(150),
    height:W(90),
    position:'absolute',
    marginTop: isPhoneX ? W(84) : W(64) ,
    marginLeft: W(208),
    borderRadius: W(4),
    backgroundColor:'rgba(0,0,0,0.8)',
  },
  menuItem:{
    flexDirection: 'row',
    alignItems: 'center',
    height:W(45),
    width:W(150),

  },
  menuItem_image:{
    marginLeft: W(17),
    width:W(20),
    height:W(20),
  },
  menuItem_text:{
    marginLeft: W(15),
    color:'#C5C8C9',
    fontSize: F(15),
    fontWeight:'300',
  },
  menuLine:{
    height:isiPhone() ? StyleSheet.hairlineWidth : W(0.8),
    marginLeft: W(16),
    width:W(118),
    backgroundColor:'#565859',
  },
  popup_footer:{
    justifyContent:'center',
  },
  closeContent:{ width:W(44), height:W(44), alignItems: 'center', justifyContent:'center' },
  closeBtn:{ position:'absolute', marginLeft:W(15), marginTop:W(15),  resizeMode:'stretch' },

// choose coupons
  buttonView:{ flexDirection:'row', justifyContent:'flex-start', height:W(30), width:W(130), alignItems:'center' },
  numView:{ height:30, justifyContent:'center' , width:W(42), alignItems:'center', marginLeft:W(11) },
  numText:{
    position:'absolute',
    marginLeft:0 ,
    color:'#333334',
    fontSize: F(16),
    textAlign:'center',
  },
  popup:{
    position:'absolute', width:W(335), backgroundColor:'#fff', borderRadius:W(4), marginLeft:W(20),
  },
  popupTitle:{ marginTop:W(29) , width:W(335), textAlign:'center', position:'absolute' },
});
