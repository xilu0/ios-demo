import { F,  ifiPhoneX, isiPhone, StatusBarHeight, W, isiPhoneX } from 'js/helper/UI';
import { Colors } from 'js/style/colors';
import React from 'react';

import {
  Animated,
  FlatList,
  Image,
  Linking,
  ListView,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  StatusBarStyle,
  StyleProp,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  TextStyle,
  SafeAreaView,
} from 'react-native';

import { NavigationKeys } from 'js/const/NavigationKeys';
import {
  MerchantAttachmentModel,
  MerchantDishModel,
  MerchantModel, MerchantStore, ProductModel } from 'js/store/MerchantStore';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import { MerchantComment } from './MerchantComment';
import { MerchantCondition } from './MerchantCondition';
import { MerchantCoupons } from './MerchantCoupons';
import { MerchantInfo } from './MerchantInfo';
import { MerchantSpecial } from './MerchantSpecial';

import { getStore } from 'js/helper/Store';
import ImageViewer from 'react-native-image-zoom-viewer';
import { IImageInfo } from 'react-native-image-zoom-viewer/src/image-viewer.type';

import { StorageKeys } from 'js/const/StorageKeys';
import { getGlobalVal, setGlobalVal } from 'js/helper/Global';
import { NavigationEventSubscription, NavigationScreenProp } from 'react-navigation';
import { errorHandle } from '../../../helper/Respone';
import { HotMerchant } from '../Home/HotMerchant';
import ImageCapInset from 'react-native-image-capinsets';
import ActionSheet from 'react-native-actionsheet';
import { showToast } from 'js/ui/components/Toast';
import FastImage from 'react-native-fast-image';


interface IProps {
  navigation: NavigationScreenProp<IProps>;
}

class Sticker extends React.Component<{
  title?: string;
  rightTitle?: string;
  style?: StyleProp<ViewStyle>;
  onRightClick?: () => void;
  isFooter?: boolean;
  rightStyle?:TextStyle;
}, any> {

  public render() {
    const Title = this.props.title ? (
      <Text style={{ color: Colors.TITLE_BLACK,fontFamily:'PingFangSC-Regular', fontSize: F(18) }}>{this.props.title}</Text>
    ) : null;
    const RightTitle = this.props.rightTitle ? (
      <Text
        onPress={this.props.onRightClick}
        style={[{ color: '#888', fontSize: F(14),fontFamily:'PingFangSC-Light' }, this.props.rightStyle]}
      >{this.props.rightTitle}
      </Text>
    ) : null;

    const header = this.props.title ? (
      <View style={styles.sticker_header}>
         {Title}
         {RightTitle}
       </View>
    ) : <View style={styles.sticker_header_null}/>;
    const footer =  !this.props.isFooter ? (<View style={{ width: W(375), height: W(31) }} />) :null ;
    return (
     <View style={{ backgroundColor: '#FFFFFF' }}>
       <View style={styles.sticker_line} />
       {header}
       <View style={[{ paddingLeft: W(24), paddingRight: W(24) }, this.props.style]} >
          {this.props.children}
       </View>
     </View>
    );
  }

}

const SBH = ifiPhoneX(40, 20, StatusBarHeight);
@observer
export class MerchantDetail extends React.Component<IProps, any> {

  // Every Component Has Only One Store
  protected merchantStore = new MerchantStore();

  private merchantId: number = -1;

  @observable public isShow: boolean = false;
  @observable public images: IImageInfo[]  = [];
  @observable public currentIndex: number = 0;

  @computed public get isShowStatus() {
    return this.isShow;
  }
  @computed public get imageArray() {
    return this.images;
  }
  @computed public get imageIndex() {
    return this.currentIndex;
  }
  @action public setImages(images: IImageInfo[]) {
    this.images = images;
  }

  @action public setIShowStatus(isShow: boolean) {
    this.isShow = isShow;
  }

  @action public setCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  constructor(props: IProps) {
    super(props);
    this.setHeaderRef = this.setHeaderRef.bind(this);
    this.setHeaderMenuRef = this.setHeaderMenuRef.bind(this);
    this.pushGraphic = this.pushGraphic.bind(this);
    this.onMerchantCardClick = this.onMerchantCardClick.bind(this);
    this.onBackClick = this.onBackClick.bind(this);
    this.onImageHidden = this.onImageHidden.bind(this);
    this.getMearchantCardView = this.getMearchantCardView.bind(this);

    this.getBannerView = this.getBannerView.bind(this);
    this.getReasonView = this.getReasonView.bind(this);
    this.getCouponsView = this.getCouponsView.bind(this);

    // this.keyExtractor = this.keyExtractor.bind(this);

    this.onFooterClick = this.onFooterClick.bind(this);

  }

  public onTapBanner = (index: number) => {
    this.setIShowStatus(true);
    this.setCurrentIndex(index);
    this.setImages(this.merchantStore.images.map((item: MerchantAttachmentModel) => {
      return {
        url: item.attachUrl || '' ,
      };
    }));

  }

  public onClickSpecialDish = (model: MerchantDishModel, index: number) => {
    this.setIShowStatus(true);
    this.setCurrentIndex(index);
    this.setImages(this.merchantStore.dishs.map((item: MerchantDishModel) => {
      return {
        url: item.picPath || '' ,
      };
    }));
  }

  public componentWillMount() {

    this._navListener = this.props.navigation.addListener('willFocus', () => {
      this._timerSetStatusBar = setTimeout(() => {
        StatusBar.setBarStyle(this.statusBarStyle || 'light-content');
        this._isTopView = true;
        this._caclYHandler(this._lastY);
      });

    });
    this._navListener = this.props.navigation.addListener('willBlur', () => {
      StatusBar.setBarStyle('dark-content');
      this._isTopView = false;
    });

    // InteractionManager.runAfterInteractions(() => {
      // showLoading('', 5000);
    const lastchantId = getGlobalVal(StorageKeys.LAST_MERCHANT_ID);
    const merchantId = this.props.navigation.getParam('merchantId', lastchantId);
    this.merchantId = merchantId;
    setGlobalVal(StorageKeys.LAST_MERCHANT_ID, merchantId);

    const { latitude, longitude } =  getStore().geolocationStore.location;
    const { id } =  getStore().geolocationStore.city;

    this.props.navigation.addListener('willFocus', () => {
        StatusBar.setBarStyle('light-content');
      });
    Promise.all([

        this.merchantStore.requsetGetMerchantDetail({ merchantId, latitude, longitude }),
        this.merchantStore.requestGetmerchantImages({ merchantId }),
      ]).then(() => {
        // hideLoading();
        return Promise.all([
          this.merchantStore.requestGetmerchantDesc({ merchantId }),
          this.merchantStore.requestGetmerchantDishes({ merchantId }),
          this.merchantStore.requestGetmerchantServices({ merchantId }),
          this.merchantStore.requestGetmerchantProduct({ merchantId, pageIndex:0, pageSize:10 }),
        ]);
      }).then(() => {
        const parms = {
          longitude,
          latitude,
          cityId: id,
          pageIndex: 0,
          pageSize:6,
        };
        this.merchantStore.requestGetRecommendedMerchant(parms);
      }).catch(errorHandle);
    // });

  }

  private _navListener?: NavigationEventSubscription;

  private _timerSetStatusBar = 0;

  private statusBarStyle: StatusBarStyle = 'light-content';

  private _refHeader ?: View;
  private _refHeaderMenu ?: View;

  private _bannerHeight: number = W(264) - W(44 * 2) - SBH - W(15);
  private _absY = 1 / this._bannerHeight;

   // 是否在顶层焦点显示页面
  private _isTopView: boolean = true;
   // 记录非焦点的最后Y
  private _lastY: number = 0;

  @observable private barVisible: boolean = false;

  @action private setBarVisible(show: boolean) {
    this.barVisible = show;
  }

  private _caclYHandler = (Y: number) => {
    let st: number;
    let menu_st: number;
    if (Y < this._bannerHeight) {
      StatusBar.setBarStyle('light-content');
      st = 0;
      menu_st = 1;
    } else {
      StatusBar.setBarStyle('dark-content');
      const absy = Y - this._bannerHeight;
      st = absy / (W(44) + SBH);
      menu_st = st;
    }
    (this._refHeader as View).setNativeProps({
      opacity: st,
    });
    (this._refHeaderMenu as View).setNativeProps({
      opacity: menu_st,
    });
    this.setBarVisible(st !== 0);
  }

  private _onScroll = (event?: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!event) {
      return;
    }
    let Y;
    try {
      Y = (event as NativeSyntheticEvent<NativeScrollEvent>).nativeEvent.contentOffset.y || 0;
    } catch (err) {
      Y = 0;
    }
    if (!this._isTopView) {
      this._lastY = Y;
      return;
    }

    this._caclYHandler(Y);

  }

  public setHeaderRef = (header: View) => {
    this._refHeader = header;
  }
  public setHeaderMenuRef = (header_menu: View) => {
    this._refHeaderMenu = header_menu;
  }

  public pushGraphic = () => {
    this.props.navigation.navigate(NavigationKeys.MerchantGraphic);

  }
  public lookMore = () => {
    // const product = this.merchantStore.products[0];
    // this.props.navigation.navigate(NavigationKeys.PackageDetailPage, {
    //   item:product,
    //   store:this.merchantStore,
    //   index:0,
    // });
    this.props.navigation.navigate(NavigationKeys.ReviewPage);

  }

  public onMerchantCardClick = (id: number) => {
    this.props.navigation.push(NavigationKeys.MerchantDetail, {
      merchantId: id,
    });
  }

  public componentWillUnmount() {
    this.onImageHidden();
  }

  public onBackClick = () => {
    this.props.navigation.pop();
  }

  public onImageHidden = () => {
    this.setIShowStatus(false);
  }

  public getMearchantCardView = (item: MerchantModel) => {
    return <HotMerchant onPress={this.onMerchantCardClick.bind(this, item.id)} merchant={item} />;
  }

  public getBannerView = (arr: MerchantAttachmentModel[]) => {
    return arr.map((item: MerchantAttachmentModel, index: number) => {
      return (
        <TouchableWithoutFeedback key={item.id}  onPress={this.onTapBanner.bind(this, index)}>
         <View >
           <FastImage
              style={styles.banner}
              source={{
                uri: item.attachUrl,
                headers:{ Authorization: 'someAuthToken' },
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.stretch}
            />
          </View>
          </TouchableWithoutFeedback>
      );
    });
  }

  public getReasonView = (arr: string[] = []) => {
    return arr.map((item: string) => {
      return(
        <Text style={styles.sticker_text} numberOfLines={1} key={item}>{item}</Text>
      );
    });
  }

  public getCouponsView = (arr: ProductModel[] = []) => {
    return arr.map((item: ProductModel, index: number) => {
      return(
          <View style={{ flex:1 }} key={'coupon_' + item.id}>
            <MerchantCoupons
              item={item}
              navigation={this.props.navigation}
              merchantStore={this.merchantStore}
              index={index}
            />
          </View>
      );

    });
  }

  public keyExtractor = (item: any, index: number) => {
    return `key_${index}`;
  }

  public onFooterClick = () => {
    this.props.navigation.navigate(NavigationKeys.ProductOrder, {
      merchantId: this.merchantId,
      auditVersionId: this.merchantStore.merchantDetail.auditVersionId,
      distance: this.merchantStore.merchantDetail.distance,
      discount: this.merchantStore.merchantDetail.discountSetting,
      title: this.merchantStore.merchantDetail.name,
      plusDiscountSetting: this.merchantStore.merchantDetail.plusDiscountSetting,
    });

  }

  public throttle = (handle: any, wait: any): () => void => {
    let lastTime = 0;
    return () => {
      const nowTime = new Date().getTime();
      if (nowTime - lastTime > wait) {
        handle();
        lastTime = nowTime;
      }
    };
  }
  public jumpCouponDetail = () => {
    
    this.props.navigation.navigate(NavigationKeys.VoucherDetailPage, {
      item:this.merchantStore.products[0],
      store:this.merchantStore,
      index:0,
    });
    
  }

  public renderMerchantInfo = (img:any, name:string, content:string, onpress?: () => void, margin?:ViewStyle) => {
    return(
    <View style={[styles.merchantInfoView, margin]} key={name}>
      <FastImage source={img} style={styles.infoImage}/>
      <Text style={styles.title} >{name}</Text>
      <TouchableWithoutFeedback onPress={onpress!}>
        <View>
          <Text style={styles.infoContent} numberOfLines={1}>{content}</Text>
        </View>
      </TouchableWithoutFeedback>
      </View>
    );
  }

  private actionSheet = React.createRef<any>();

  public showActionSheet = () => {
    if (!this.merchantStore.telephones || this.merchantStore.telephones.length === 0) {
      return showToast('联系方式为空');
    }
    if (this.actionSheet.current) {
      this.actionSheet.current.show();
    }
  }

  public selectPhone = (index: number) => {
    const telephones: string[] = this.merchantStore.telephones!;

    if (telephones.length === 0) return;
    if (index !== telephones.length - 1) {
      const url = 'tel: ' + telephones[index];
      Linking.canOpenURL(url).then((supported: boolean) => {
        if (!supported) {
          // console.log('Can\'t handle url: ' + url);
        } else {
          return Linking.openURL(url);
        }
      }).catch(err => console.error('An error occurred', err));
    }

  }

  public render() {

    const footerFun = this.throttle(this.onFooterClick, 2000);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    const { recommendMerchantArray } = this.merchantStore;
    const merchant_data = ds.cloneWithRows(recommendMerchantArray.slice());

    const backIcon = this.barVisible ? require('img/merchant/back_black.png') : require('img/merchant/back.png');
    const shareIcon = this.barVisible ? require('img/merchant/share_black.png') : require('img/merchant/share.png');
    const aixinIcon = this.barVisible ? require('img/merchant/aixin_black.png') : require('img/merchant/aixin.png');

    const banner = this.getBannerView(this.merchantStore.images);

    const reason = this.merchantStore.merchantDetail.recommandReasons;

    const discount =  this.merchantStore.merchantDetail.discountSetting || 0;
    const discountPrice =  discount < 1 ? discount * 10 : discount;
    const coupons = this.getCouponsView(this.merchantStore.products.slice(0, 2));

    const swiperBannerView = (
      <Swiper
        height={W(264)}
        horizontal={true}
        showsButtons={false}
        autoplay={false}
        loop={false}
        showsPagination={true}
        key={banner.length}
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        paginationStyle={styles.paginationStyle}
        bounces={true}
      >
        {banner}
      </Swiper>
    );

    const detailView = (
      <View style={{ paddingBottom:W(31), backgroundColor:'#fff' }}>
        <MerchantInfo merchantStore={this.merchantStore} navigation={this.props.navigation} />
      </View>
    );

    const specialView = (
      <Sticker title={'特色菜'} style={{ paddingLeft: 0, paddingRight: 0 , paddingBottom:W(31) }}>
        <MerchantSpecial merchantStore={this.merchantStore} onItemClick={this.onClickSpecialDish}/>
      </Sticker>
    );

    const reasonText  = reason ? 
    <Text style={styles.reasonContent}>{reason}</Text> : <View style={styles.placeReason}/>;
    
    const reasonView = (
      <Sticker title={'推荐理由'} style={{ paddingLeft: W(15), paddingRight: 0, paddingBottom:W(31) }}>
          {reasonText}
          <TouchableWithoutFeedback onPress={this.pushGraphic}>
            <View>
              <Text style={styles.redButton}>图文详情</Text>
            </View>
          </TouchableWithoutFeedback>
      </Sticker>
    );

    const title = this.merchantStore.products.length  > 3 ? '查看更多' :'';

    const couponsView = (
      <Sticker
        title={'本店优惠'}
        style={{ paddingLeft: 0, paddingRight: 0 , paddingBottom:W(31) }}
        rightTitle={title}
        onRightClick={this.jumpCouponDetail}
        rightStyle={{ color:'#EF5C65' }}
      >
        {coupons}
      </Sticker>
    );

    const commentView = (
      <Sticker
        title={'评论视频库'}
        rightTitle={'2小时前'}
        onRightClick={this.lookMore}
        style={{ paddingLeft: 0, paddingRight: 0 , marginBottom:31 }}
        rightStyle={{ color:Colors.TITLE_BLACK }}
      >
        <MerchantComment navigation={this.props.navigation}/>
      </Sticker >
    );
    const merchantInfoData = [
      {
        img:require('img/merchant/addressIcon.png'),
        name:'商家地址',
        content:this.merchantStore.merchantDetail.detailAddress,
      },
      {
        img:require('img/merchant/teicon.png'),
        name:'商家电话',
        content:this.merchantStore.telephones![0],
      },
      {
        img:require('img/merchant/businssTime.png'),
        name:'营业时间',
        content:this.merchantStore.merchantDetail.businessTime,
      },
    ];
    const infoView =   merchantInfoData.map((item, index) => {
      const  fun  = index === 1 ? this.showActionSheet : undefined ;
      const margin =  index === 0 ? { marginTop:0 } : { marginTop:W(23) };
      return this.renderMerchantInfo(item.img, item.name, item.content!, fun, margin);
    });
    const merchantInfo = (
      <Sticker title='商家信息'        
       style={{ paddingLeft: 0, paddingRight: 0 , marginBottom:31 }}
      >
        {infoView}
      </Sticker>
    );

    const conditionView = (
      <Sticker  title={'温馨贴士'}  style={{ paddingLeft: 0, paddingRight: 0, paddingBottom:W(31)  }}>
        <MerchantCondition merchantStore={this.merchantStore} />
      </Sticker>
    );

    const merchanListView = (
      <Sticker title={'猜你喜欢'} style={{ paddingLeft: W(15), paddingRight: W(15) , paddingBottom:W(56) }} isFooter={true}>
        <ListView
          contentContainerStyle={styles.merchan_card_listview_container}
          dataSource={merchant_data}
          renderRow={this.getMearchantCardView}
          enableEmptySections={true}
          scrollEnabled={false}
        />
      </Sticker>
    );
    const isCouponsView = this.merchantStore.products.length === 0 ? null : couponsView ;
    const flatListData = [
      swiperBannerView,
      detailView,
      reasonView,
      specialView,
      isCouponsView,
      commentView,
      merchantInfo,
      conditionView,
      merchanListView,
    ];

    const getView = (info: any) => info.item;
    const imgHeight = isiPhone()  ? null : { height:W(42) };
    return (
      <View style={{ flex: 1, backgroundColor:'#fff' }}>

        <View ref={this.setHeaderRef} style={styles.header} />
        <View ref={this.setHeaderMenuRef} style={styles.header_menu}>
          <TouchableWithoutFeedback onPress={this.onBackClick}>
            <View style={styles.header_menu_item}>
              <FastImage source={backIcon} style={{ marginLeft:-W(20) }} />
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.header_right}>
            <View style={styles.header_menu_item}>
              <FastImage source={shareIcon} />
            </View>
            <View style={styles.header_menu_item}>
              <FastImage source={aixinIcon}  />
            </View>
          </View>
        </View>
        <LinearGradient
          colors={['rgba(0, 0, 0,0.5)', 'rgba(0, 0, 0,0)']}
          style={styles.linearGradient}
        />
        <SafeAreaView style={styles.footerAnimedView}>
         <Animated.View style={{    backgroundColor:'rgba(0,0,0,0)' }}>
          <ImageCapInset
                style={styles.headerBottomShadowImage}
                source={require('img/headerShaddow.png')}
                capInsets={{ top: 0, right: 5, bottom: 2, left: 5 }}
              />
            <View style={styles.footer}>
            <View style={styles.footer_leftView}>
              <FastImage source={require('img/merchant/Shape.png')}/>
              <Text style={styles.leftText}>拍摄视频</Text>
            </View>
            <TouchableWithoutFeedback onPress={footerFun}>
            <View style={styles.footer_rightView}>
                <FastImage source={require('img/merchant/footerBtn.png')} style={[styles.footerBtnBg, imgHeight]}/>
                <Text style={styles.rightText}>{discountPrice} <Text style={[{ fontSize:F(13),    fontFamily:'PingFangSC-Thin' }]}>折买单</Text></Text>
               
            </View>
            </TouchableWithoutFeedback>
          </View>
        </Animated.View>
        </SafeAreaView>
        <FlatList
          onScroll={this._onScroll}
          data={flatListData}
          keyExtractor={this.keyExtractor}
          renderItem={getView}
        />

        <Modal
            visible={this.isShow}
            transparent={true}
            onRequestClose={this.onImageHidden}
            animationType={'slide'}
        >
          <ImageViewer
              style={{ flex:1 }}
              imageUrls={this.imageArray}
              onClick={this.onImageHidden}
              index={this.imageIndex}
              saveToLocalByLongPress={false}
          />
        </Modal>

          <ActionSheet
          ref={this.actionSheet}
          options={this.merchantStore.telephones}
          cancelButtonIndex={this.merchantStore.telephones.length - 1}
          onPress={this.selectPhone}
          />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  header:{
    opacity: 0,
    backgroundColor: '#FFFFFF',
    height: W(44) + SBH,
    paddingTop: SBH,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 3,
    borderBottomColor: '#E6E6E6',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  header_menu: {
    backgroundColor: 'rgba(0,0,0,0)',
    height: W(44) + SBH,
    paddingTop: SBH,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 4,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  linearGradient:{
    width:W(375),
    height:W(44) + SBH,
    position:'absolute',
    zIndex: 2,
  },

  header_right: {
    flexDirection: 'row',
  },

  header_menu_item: {
    width: W(60),
    height: W(44),
    alignItems: 'center',
    justifyContent: 'center',
  },

  sticker_header: {
    paddingLeft: W(15),
    paddingRight: W(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: W(31),
    paddingBottom: W(23),
    alignItems: 'center' ,
  },
  sticker_header_null: {
    flexDirection: 'row',
    paddingTop: W(30),
  },

  sticker_line: { marginLeft: W(15), marginRight: W(15), width: W(345),
    height: isiPhone() ? StyleSheet.hairlineWidth : 0.5, backgroundColor:'#EBEBEB' },

  sticker_text: { color: Colors.TITLE_BLACK, fontSize: F(15), lineHeight: F(23) },

  merchan_card_listview_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  banner:{ width:W(375), height:W(264), backgroundColor:'#f4f4f4' },
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
    bottom: W(10),
  },
  placeImg:{
    width:W(375),
    height:W(264),
    resizeMode:'center',
  },
  placeReason:{
    backgroundColor:'#f4f4f4',
    marginRight:W(15),
    height:W(20),
  },

  footerText:{
    fontFamily: 'DIN-Medium',
    fontSize: F(18),
  },

  reasonContent:{
    marginRight: W(15),
    color:Colors.TITLE_BLACK,
    fontSize: F(14),
    fontFamily: 'PingFangSC-Light',
  },

  redButton:{
    color:'#EF5C65',
    fontSize: F(14),
    fontFamily: 'PingFangSC-Light',
    marginTop: W(9),
  },
  footer:{
    height:W(56),
    width:W(375),
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'#fff',
  },
  footer_leftView:{
    height:W(56),
    width:W(120),
    marginLeft:-W(5),
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  leftText:{
    color:'#666',
    fontSize:F(13),
    fontFamily: 'PingFangSC-Light',
    marginLeft:W(8),
  },
  footer_rightView:{
    width:W(145),
    height:W(56),
    justifyContent:'center',
    alignItems:'center',
    marginRight:W(10),
  },
  footerBtnBg:{
    position:'absolute',
    width:W(145),
  },
  rightText:{
    color:'#fff',
    fontSize:F(18),
    fontFamily: 'DIN-Medium',
    fontWeight:'bold',
    marginTop:isiPhone() ?W(5):W(0),
    marginLeft:W(4),
  },

  footerAnimedView: {
    height: isiPhoneX ? W(64) :W(56),
    justifyContent:'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: isiPhone() ? ifiPhoneX ? 0 : W(5) :0,
    zIndex: 3,
    backgroundColor:'#fff',

  },
  headerBottomShadowImage: {
    height: W(10),
    width:W(375),
    zIndex: 100,
    opacity: 0.5,
    backgroundColor:'rgba(0,0,0,0)',
    transform:  [{ rotateX: '180deg' }],
  },

  merchantInfoView:{
    marginLeft:W(15),
    marginRight:W(15),
    flexDirection:'row',
    alignItems:'center',
    width:W(345),
  },
  infoImage:{
    width:W(11),
    height:W(11),
  },
  title:{
    fontSize:F(14),
    fontFamily:'PingFangSC-Medium',
    color:Colors.TITLE_BLACK,
    marginLeft:W(9),
  },
  infoContent:{
    fontSize:F(14),
    fontFamily:'PingFangSC-Light',
    color:Colors.TITLE_BLACK,
    marginLeft:W(2),
    width:W(250),

  },
});
