
import React from 'react';
import {
  Alert,
  Image,
  Keyboard,
  ScrollView,
  StatusBar, 
  StyleSheet, 
  Text, TextInput, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { action, computed, observable,  } from 'mobx';
import { observer } from 'mobx-react/native';

import { API, Coupon, IResponse, SubmitOrder } from 'js/api';
import { RulesEnums } from 'js/const/RulesKeys';
import { hideLoading, showLoading } from 'js/helper/Loading';
import { errorHandle } from 'js/helper/Respone';
import {  test, testList } from 'js/helper/Rules';
import { F, W } from 'js/helper/UI';
import { FontWeight } from 'js/style/fonts';
import { LinerGradientButton } from 'js/ui/components/Common/LinerGradientButton';
import { showToast } from 'js/ui/components/Toast';
import { Touchable } from 'js/ui/components/Touchable';
import { ProductCoupon } from './ProductCoupon';

import { NavigationKeys } from 'js/const/NavigationKeys';
import { px2dp } from 'js/helper/Adapter';
import { navigate } from 'js/helper/navigate';
import { getStore } from 'js/helper/Store';
import { MerchantModel } from 'js/type/merchant';
import { merge } from 'lodash';
import { PopoverPayFail } from './PopupPayFail';
import { ProductPay } from './ProductPay';
import FastImage from 'react-native-fast-image';


interface IProps {
  merchantId: number;
  auditVersionId: number;
  discount: number;
  distance: number;
  navigation: NavigationScreenProp<any, any>;
  screenProps: any;
  plusDiscountSetting: number;
}

class Store {

  @observable public isFocus: boolean = true;

  @observable public inputText: string = '';
  public lastInputText: string = '';

  @observable public editable: boolean = false;

  constructor(isFocus = true, editable = false) {
    this.setFocus(isFocus);
    this.setEditable(editable);
  }

  @computed
  public get isShowTotal() {
    const t = this.total;
    return typeof t === 'number' ? (t > 0) : false;
  }

  @computed
  public get total(): number {
    return +this.inputText;
  }

  @action
  public setInputText(text: string) {
    this.inputText = text;
  }

  @action
  public setLastInputText(text: string) {
    this.lastInputText = text;
  }

  @action
  public setFocus(b: boolean) {
    this.isFocus = b;
  }

  @action
  public setEditable(b: boolean) {
    this.editable = b;
  }

}

class ModalStore {
  @observable public visible: boolean = false;
  @observable public payVisible: boolean = false;

  @action public setVisable(b: boolean) {
    this.visible = b;
  }

  @action public setPayVisable(b: boolean) {
    this.payVisible = b;
  }

}

class CouponModel implements Coupon {
  @observable public id?: number;
  @observable public status: Coupon.StatusEnum = Coupon.StatusEnum._0;
  @observable public reason?: string;
  @observable public  name?: string;
  @observable public  type?: Coupon.TypeEnum;
  @observable public  useMinimumComsumption?: number;
  @observable public money: number = 0;
  @observable public useStartTime?: string;
  @observable public useEndTime?: string;
}

export class CouponsStore {

  public parent: PageStore;

  constructor(_parent: PageStore) {
    this.parent = _parent;
  }

  @observable public amount: number = 0;

  @observable public allCouponList: CouponModel[] = [];

  @observable public availableCouponList: CouponModel[] = [];
  @observable public unavailableCouponList: CouponModel[] = [];

  @observable public index: number = -1;
  // @observable public indexCoupon: CouponModel = new CouponModel();

  @computed public get indexCoupon(): CouponModel {
    return this.availableCouponList[this.index];
  }

  @action public setIndex(_index: number) {
    this.index = _index;
  }

  private  fitterAvailable (item: CouponModel): boolean {
    const useMin = item.useMinimumComsumption || 0;
    if (item.status === 1 && useMin <= this.amount) {
      return true;
    }
    return false;
  }

  @action public gennerateMaxCoupon() {
    let maxIndex = -1;
    let maxMoney = -1;
    this.availableCouponList.forEach((item, index) => {
      if (item && item.money! > maxMoney) {
        maxIndex = index;
        maxMoney = item.money!;
      }
    });
    this.index = maxIndex;
  }

  @action public filterCoupon() {
    const a: CouponModel[] = [];
    const b: CouponModel[] = [];

    this.allCouponList.forEach((item: CouponModel) => {
      if (this.fitterAvailable(item)) {
        a.push(item);
      } else {
        b.push(item);
      }
    });

    this.availableCouponList = a;
    this.unavailableCouponList = b;
  }

  @action public setAmount (num: number) {
    this.amount = num;
    this.filterCoupon();
    this.gennerateMaxCoupon();
    setTimeout(this.parent.updateCoupon.bind(this.parent));
  }

  @action public getCouponsData(params: any) {
    return API.manager.getCouponByMerchent(params).then(action((rs: IResponse) => {
      // console.log(JSON.stringify(rs.data));
      this.allCouponList = rs.data;
      this.filterCoupon();
    })).catch(errorHandle);
  }

}

class PageStore {

  public readonly couponStore: CouponsStore;

  constructor() {
    this.couponStore = new CouponsStore(this);
  }

  @observable public orderWhere: SubmitOrder = {
    merchantId: -1,
    merchantVersionId: 0,

    totalMoney: 0,
    actualMoney: 0,
    outOfDiscountMoney: 0,

    couponId: undefined,
  };

  @observable public outCouponDiscount: number = 0;

  @observable public outDiscount: number = 1;

  // @observable public actualCallback?: (n: number) => void;

  @observable public distance: number = 0;

  @observable public coupon: CouponModel = new CouponModel();
  @observable public plusOutDiscount: number = 1;
  @computed public get actual() {
    const actual = this.orderWhere.totalMoney! - this.orderWhere.outOfDiscountMoney!;
    this.orderWhere.actualMoney = actual;
    // if (this.actualCallback) {
    //   this.actualCallback!(actual);
    // }
    this.couponStore.setAmount(actual);
    return actual;
  }

  @computed public get outCouponDiscountText() {
    return this.outCouponDiscount.toFixed(2);
  }

  @computed public get outDiscountText() {
    return this.outDiscount * 10;
  }

  @computed public get outDiscountMoneyText() {
    return ((1 - this.outDiscount) * this.actual).toFixed(2);
  }

  @computed public get lastActual() {
    const outOfDiscountMoney = (this.orderWhere.outOfDiscountMoney! || 0);
    // console.warn(`(${this.actual}) * ${this.outDiscount} + ${outOfDiscountMoney} - ${this.outCouponDiscount};`);
    return (this.actual - this.outCouponDiscount) * this.outDiscount + outOfDiscountMoney;
  }

  @computed public get lastActualText() {
    return this.lastActual.toFixed(2);
  }

  @computed public get actualText() {
    return this.actual.toFixed(2);
  }

  @computed public get lastPlusActual() {
    const plusOutOfDiscountMoney = (this.orderWhere.outOfDiscountMoney! || 0);
    // console.warn(`(${this.actual}) * ${this.outDiscount} + ${outOfDiscountMoney} - ${this.outCouponDiscount};`);
    return (this.actual - this.outCouponDiscount) * this.plusOutDiscount + plusOutOfDiscountMoney;
  }
  @computed public get lastPlusActualText() {
    return this.lastPlusActual.toFixed(2);
  }

  // @action
  // public setActualCaclCallback(callback: (n: number) => void) {
  //   this.actualCallback = callback;
  // }

  @action
  public setOutDiscount(n: number, isPlus: boolean) {
    if (isPlus) {
      this.plusOutDiscount = n > 1 ? 1 : n;
    } else {
      this.outDiscount = n > 1 ? 1 : n;
    }
  }

  @action
  public setOutCouponDiscount(n: number) {
    this.outCouponDiscount = n;
  }

  @action
  public updateOrderWhere(newOrderWhere: SubmitOrder) {
    merge(this.orderWhere, newOrderWhere);
    // recacl
  }

  @action
  public resetCouponDiscount() {
    this.outCouponDiscount = 0;
    this.orderWhere.couponId = undefined;
  }

  @action
  public setDistance(_distance: number) {
    this.distance = _distance;
  }

  @observable public orderResult: any = {};

  @action
  public requestSubmitOrder() {
    return API.order
      .submitProductOrder_1(this.orderWhere)
      .then((rs) => {
        console.log(rs);
        this.orderResult = rs.data;
        return rs.data;
      });
  }

  @action public updateCoupon() {
    const cou = this.couponStore.indexCoupon;
    let money = 0;
    let couponId;
    if (cou) {
      money = cou.money;
      couponId = cou.id;
    }
    this.setOutCouponDiscount(money);
    this.updateOrderWhere({ couponId });
  }
}

@observer
export class ProductOrder extends React.Component<IProps> {

  public static navigationOptions = ({ screenProps = { statusBarHeight: 0 }, navigation }: IProps) => {
    const _statusBarHeight = screenProps.statusBarHeight;
    const defaultConfig = {
      title: navigation.getParam('title'),
      headerLeft: (
          <TouchableHighlight
            onPress={navigation.getParam('goBack')}
            style={styles.arrow_left}
            underlayColor={'rgba(0,0,0,0)'}
          >
            <View>
             <FastImage source={require('img/merchant/back_black.png')} />
            </View>
          </TouchableHighlight>
      ),
      headerStyle: {
        paddingTop: _statusBarHeight,
        height: px2dp(107) + _statusBarHeight,
        elevation: 0,
        borderBottomColor: '#E6E6E6',
        borderBottomWidth: StyleSheet.hairlineWidth,
        backgroundColor: '#FBFBFB',
      },
      tabBarVisible:false,
      gesturesEnabled: false,
    };
    return defaultConfig;

  }

  private input?: TextInput;
  private offerInput?: TextInput;

  private inputStore = new Store(true, true);

  private offerStore = new Store(true, false);

  private modalStore = new ModalStore();

  // public couponStore = new CouponsStore();

  private pageStore = new PageStore();

  constructor(props: any) {
    super(props);
    this.props.navigation.setParams({
      goBack: this.goBack.bind(this),
    });
    StatusBar.setBarStyle('dark-content');
  }

  private keyboardDidHideListener: any;

  public componentWillMount () {
    // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  public componentWillUnmount () {
    this.keyboardDidHideListener.remove();
  }

  // public keyboardDidShow = () => { }

  public keyboardDidHide = () => {
    // this.onSubmitEditing();
    // this.onOfferSubmitEditing();
  }

  public componentDidMount() {
    this.pageStore.setOutDiscount(this.props.plusDiscountSetting || 1, true);

    const merchantId = this.props.navigation.getParam('merchantId');
    const auditVersionId = +this.props.navigation.getParam('auditVersionId');
    console.log(auditVersionId);
    // const discount = this.props.navigation.getParam('discount', 1);
    // const distance = this.props.navigation.getParam('distance', 0);

    const { longitude, latitude } = getStore().geolocationStore.location;

    // showLoading();

    API.merchant
      .getAppMerchantDetail({ merchantId, longitude, latitude })
      .then((rs: IResponse) => {
        return (rs.data as MerchantModel);
      })
      .then((m: MerchantModel) => {
        this.pageStore.couponStore.getCouponsData({ merchantId: merchantId.toString() });
  
        this.pageStore.setOutDiscount(m.discountSetting || 1, false);
        this.pageStore.updateOrderWhere({
          merchantId,
          merchantVersionId: auditVersionId,
        });

        // this.pageStore.setActualCaclCallback((actual) => {
        //   this.pageStore.couponStore.setAmount(actual);
        // });

        // this.pageStore.couponStore.setCouponCallback((cou: CouponModel) => {
        //   this.pageStore.updateCoupon(cou);
        // });

        this.pageStore.setDistance((m.distance || 0) * 1000);
        // hideLoading();
      })
      .catch(() => {
        // hideLoading();
      });
  }

  public goBack() {
    this.props.navigation.goBack();
  }

  public setInput = (_input: TextInput) => this.input = _input;
  public setOfferInput = (_input: TextInput) => this.offerInput = _input;

  public onInputLineClick = () => {
    this.inputStore.setFocus(true);
    this.offerStore.setFocus(false);
    (this.input as TextInput).focus();
  }

  public onOfferInputLineClick = () => {
    if (this.offerStore.editable === false) {
      return;
    }
    this.inputStore.setFocus(false);
    this.offerStore.setFocus(true);
    (this.offerInput as TextInput).focus();
  }

  public onOfferInputLeftIconClick = () => {
    this.offerStore.setEditable(!this.offerStore.editable);
    if (this.offerStore.editable === true) {
      setTimeout(this.onOfferInputLineClick);
    } else {
      this.offerStore.setFocus(false);
      this.offerStore.setInputText('');
    }
  }

  public onSubmitEditing = () => {
    // const rs = testList([{
    //   rex: RulesEnums.AMOUNT,
    //   value: this.inputStore.inputText,
    // }, {
    //   rex: () => {
    //     if (this.offerStore.total === 0) {
    //       return true;
    //     }
    //     return this.inputStore.total > this.offerStore.total;
    //   },
    //   message: '消费总额必须大于优惠金额',
    // }]);

    // if (rs !== true) {
    //   return showToast(rs);
    // }

    this.inputStore.setFocus(false);
    this.offerStore.setFocus(false);

    // update order flied
    // this.pageStore.updateOrderWhere({
    //   totalMoney: this.inputStore.total,
    // });

    // this.pageStore.resetCouponDiscount();

  }

  public onOfferSubmitEditing = () => {
    // const rs = testList([{
    //   rex: RulesEnums.AMOUNT,
    //   value: this.inputStore.inputText,
    // }, {
    //   rex: () => {
    //     if (this.inputStore.total === 0) {
    //       return true;
    //     }
    //     return this.inputStore.total > this.offerStore.total;
    //   },
    //   message: '优惠金额必须小于于消费总额',
    // }]);

    // if (rs !== true) {
    //   return showToast(rs);
    // }
    this.inputStore.setFocus(false);
    this.offerStore.setFocus(false);

    // update order flied
    // this.pageStore.updateOrderWhere({
    //   outOfDiscountMoney: this.offerStore.total,
    // });

    // this.pageStore.resetCouponDiscount();
  }

  public onChangeText = (text: string) => {
    this.offerStore.setInputText('');
    this.offerStore.setEditable(false);
    this.pageStore.updateOrderWhere({
      outOfDiscountMoney: this.offerStore.total,
    });

    const rsErr = testList([{
      rex: RulesEnums.MONEY,
      value: text,
    }, {
      rex: () => {
        if (this.offerStore.total === 0) {
          return true;
        }
        return +text > this.offerStore.total;
      },
      message: '消费总额必须大于优惠金额',
    }]);

    this.inputStore.setInputText(text);

    setTimeout(() => {
      if (text.length > 0 && rsErr !== true) {
        const t = this.inputStore.lastInputText;
        this.inputStore.setInputText(t);
        showToast(rsErr);
      } else {
        this.inputStore.setLastInputText(text);
        // this.offerStore.setInputText('');
        // update order flied
        this.pageStore.updateOrderWhere({
          totalMoney: this.inputStore.total,
        });
        this.pageStore.resetCouponDiscount();
      }
    });

  }

  public onOfferChangeText = (text: string) => {
    const rsErr = testList([{
      rex: RulesEnums.MONEY,
      value: text,
    }, {
      rex: () => {
        if (this.inputStore.total === 0) {
          return true;
        }
        return this.inputStore.total > +text;
      },
      message: '优惠金额必须小于于消费总额',
    }]);

    this.offerStore.setInputText(text);

    setTimeout(() => {
      if (text.length > 0 && rsErr !== true) {
        const t = this.offerStore.lastInputText;
        this.offerStore.setInputText(t);
        showToast(rsErr);
      } else {
        this.offerStore.setLastInputText(text);
        // this.offerStore.setInputText('');
        // update order flied
        this.pageStore.updateOrderWhere({
          outOfDiscountMoney: this.offerStore.total,
        });
        this.pageStore.resetCouponDiscount();
      }
    });
  }

  public getInputLineView = (isFocus: boolean, isShowTotal: boolean) => {
    const text = (
      <View style={styles.input_view}>
        <Text
          style={[{ fontSize: F(20), color: '#272727', marginRight: W(24) }, FontWeight.Medium]}
        >¥ {this.inputStore.total}
        </Text>
      </View>
    );

    const input = (
      <TextInput
        onFocus={this.inputStore.setFocus.bind(this.inputStore, true)}
        style={styles.input}
        ref={this.setInput}
        // autoFocus={true}
        keyboardType={'decimal-pad'}
        onSubmitEditing={this.onSubmitEditing}
        onBlur={this.onSubmitEditing}
        placeholder={'咨询服务员后输入'}
        onChangeText={this.onChangeText}
        value={this.inputStore.inputText}
        underlineColorAndroid={'rgba(0,0,0,0)'}
        maxLength={8}
      />);

    if (isFocus) {
      return input;
    }

    if (isShowTotal) {
      return text;
    }

    return input;
  }

  public getOfferInputLineView = (isFocus: boolean, isShowTotal: boolean) => {
    const text = (
      <View style={[styles.input_view, { justifyContent: 'space-between' }]}>
        <Text style={[styles.color_gray, FontWeight.Regular, styles.text_left, { marginLeft: 0 }]}>不参与优惠券金额:</Text>
        <Text
          style={[FontWeight.Regular, styles.text_left, { marginRight: 0 , color: '#272727' }, { fontSize: F(18) }]}
        >¥ {this.offerStore.total}
        </Text>
      </View>
    );

    const input = (
      <TextInput
        editable={this.offerStore.editable}
        onFocus={this.offerStore.setFocus.bind(this.offerStore, true)}
        style={styles.offerInput}
        ref={this.setOfferInput}
        // autoFocus={true}
        keyboardType={'decimal-pad'}
        onSubmitEditing={this.onOfferSubmitEditing}
        onBlur={this.onOfferSubmitEditing}
        placeholder={'输入不参加优惠金额，如酒水、特价菜'}
        placeholderTextColor={'#666666'}
        onChangeText={this.onOfferChangeText}
        defaultValue={this.offerStore.inputText}
        underlineColorAndroid={'rgba(0,0,0,0)'}
        maxLength={5}
      />);

    if (isFocus) {
      return input;
    }

    if (isShowTotal) {
      return text;
    }

    return input;
  }

  public onCouponClick = () => {
    // get total
    // if (this.pageStore.couponStore.availableCouponList.length === 0) {
    //   return;
    // }
    this.modalStore.setVisable(true);

  }

  public onCouponSelect = (cou: Coupon) => {
    this.pageStore.updateCoupon();
  }

  public onPayBtnClick = () => {
    this.onSubmitEditing();
    this.onOfferSubmitEditing();

    const errRs = testList([
      {
        rex: () => {
          return this.inputStore.inputText.trim().length !== 0;
        },
        message: '请输入金额',
      },
      {
        rex: () => {
          return this.pageStore.lastActual > 0;
        },
        message: '支付金额错误',
      },
    ]);

    if (errRs !== true) {
      return showToast(errRs);
    }
    new Promise((resolve, reject) => {
      if (this.pageStore.distance > 500) {
        Alert.alert(
          '温馨提示',
          '您可能不在本店内，请到店与服务员确认金额再付款',
          [
            { text: '取消付款', onPress: () => null , style: 'cancel' },
            { text: '继续', onPress: () => resolve() },
          ],
          { cancelable: false },
        );
      } else {
        resolve();
      }
    })
    .then(() => {
      showLoading('正在生成订单...', 5000);
      return this.pageStore.requestSubmitOrder();
    })
    .then(() => {
      hideLoading();
      return this.modalStore.setPayVisable(true);
    })
    .catch(errorHandle);
  }

  public closeCoupon = () => {
    this.modalStore.setVisable(false);
  }
  public closePay = () => {
    this.modalStore.setPayVisable(false);
  }
  public showPay = () => {
    this.modalStore.setPayVisable(true);
  }
  public goToPlusIntrod = () => {
    navigate(NavigationKeys.MemberOpen, { title:'开通' });
  }
  public renderPlusEntry = () => {
    const userStore = getStore().userStore;
    const isPlus = userStore.self.plusStatus === 0;
    const plusDiscount = this.props.navigation.getParam('plusDiscountSetting');

    if (isPlus) {
      return (
        <View style={styles.plusIntrod}>
          <View style={styles.leftView}>
            <FastImage source={require('img/plusMember/plusBottom.png')} />
            <View style={{ position:'absolute', left:W(15) }}>
              <Text style={{ color:'#F0C894', fontSize:F(16) }}>PLUS会员{plusDiscount}折</Text>
              <Text style={{ color:'#F0C894', fontSize:F(11) }}>新注册用户免费体验30天</Text>
            </View>
          </View>
          <View style={styles.rightView}>
            <FastImage source={require('img/plusMember/plusRect.png')} />
            <View style={{ position:'absolute', right:W(15) }}>
              <View style={{ flexDirection:'row' }}>
                {/* <Text style={{ color:'#fff', width:W(14), height:W(20), fontWeight:'400' }}>￥</Text> */}
                <Text style={{ color:'#fff', fontSize:F(14) }} numberOfLines={1}>
                  ￥{this.pageStore.lastPlusActualText}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={this.goToPlusIntrod} 
                activeOpacity={0.75}
                style={{ justifyContent:'center' }}
              >
                <Text style={styles.ktText}>立即开通</Text>
              </TouchableOpacity>
            </View>  
          </View>
        </View>);
    }
  }
  public render() {
    const inputLineView = this.getInputLineView(this.inputStore.isFocus, this.inputStore.isShowTotal);

    const offInputLineView = this.getOfferInputLineView(this.offerStore.isFocus, this.offerStore.isShowTotal);

    const couponRightView = this.pageStore.outCouponDiscount > 0 ?
    (
      <View style={styles.item_right}>
        <Text style={[styles.color_black, styles.text_right]}>¥ {this.pageStore.outCouponDiscountText}</Text>
      </View>
    )
     :
    (
      <View style={styles.item_right}>
        <Text style={[styles.color_gray, styles.text_right, FontWeight.Light]}>暂无可用</Text>
        <Image style={styles.icon_right} source={require('img/more_right.png')} />
      </View>
    );

    const offerInputLeftIcon = this.offerStore.editable ?
      require('img/Order/hollow_selected.png') : require('img/Order/hollow_unSelect.png');

    return (
      <ScrollView style={styles.wrap} keyboardShouldPersistTaps={'always'}>
      <View style={styles.wrap}>
        <View style={{ backgroundColor: '#FFF' }}>
          <Touchable onPress={this.onInputLineClick}>
            <View style={styles.wrap_item}>
              <Text style={[styles.color_gray, styles.text_left]}>消费总额:</Text>
              {inputLineView}
            </View>
          </Touchable>
          <View style={styles.wrap_line} />

          <Touchable onPress={this.onOfferInputLineClick}>
            <View style={styles.wrap_item}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: W(24), paddingRight: W(24) }}>
                <TouchableWithoutFeedback onPress={this.onOfferInputLeftIconClick}>
                <FastImage
                  style={{ width: W(20), height: W(20), marginRight: W(10) }}
                  source={offerInputLeftIcon}
                  resizeMode={FastImage.resizeMode.stretch}
                />
                </TouchableWithoutFeedback>
                {offInputLineView}
                {/* <Text style={[styles.color_gray, styles.text_left, { marginLeft: 0 }]}>输入不参加优惠金额，如酒水、特价菜</Text> */}
              </View>
            </View>
          </Touchable>

          <View style={{ height: W(6), backgroundColor: '#F8F8F8' }} />

          <Touchable onPress={this.onCouponClick}>
            <View style={styles.wrap_item}>
              <Text style={[styles.color_gray, styles.text_left]}>优惠券</Text>
              {couponRightView}
            </View>
          </Touchable>
          <View style={styles.wrap_line} />
          <View style={styles.wrap_item}>
            <Text style={[styles.color_black, styles.text_left]}>已优惠{this.pageStore.outDiscountText}折</Text>
            <View style={styles.item_right}>
              <Text style={[styles.text_right]}>¥ {this.pageStore.outDiscountMoneyText || 0}</Text>
            </View>
          </View>
          <View style={styles.wrap_line} />
          <View style={styles.wrap_item}>
            <Text style={[styles.color_black, styles.text_left]}>实付金额</Text>
            <View style={styles.item_right}>
              <Text
                style={[styles.color_red, styles.text_right, { fontSize: F(18) }]}
              >¥ {this.pageStore.lastActualText}
              </Text>
            </View>
          </View>
          <View style={[styles.wrap_line, { marginLeft: 0, width: W(375) }]} />
        </View>
        <View style={{ height: W(6), backgroundColor: '#F8F8F8' }} />
        {this.renderPlusEntry()}
        <LinerGradientButton
          onPress={this.onPayBtnClick}
          text={`¥ ${this.pageStore.lastActualText} 提交订单`}
          style={{ marginTop: W(20), marginBottom: W(10), opacity: this.pageStore.lastActual > 0 ? 1 : 0.7 }}
        />

        <View style={{ alignItems: 'center', paddingTop: W(8) }}>
          <Text style={{ color:'#ABABAB', fontSize: F(12) }}>买单仅限于到店支付，请确认金额后提交</Text>
        </View>

        <ProductCoupon
          visible={this.modalStore.visible}
          equestClose={this.closeCoupon}
          store={this.pageStore.couponStore}
          onSelect={this.onCouponSelect}
          // initSelectIndex={this.pageStore.couponStore.maxAvailableCouponIndex}
        />
        <ProductPay
          visible={this.modalStore.payVisible}
          show={this.showPay}
          equestClose={this.closePay}
          orderId={this.pageStore.orderResult.orderId}
          amount={this.pageStore.lastActual || 0}
          navigation={this.props.navigation}
        />

        <PopoverPayFail />

      </View>
      </ScrollView>
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

  backImage:{
    height:64,
    width:44,
    alignItems:'center',
    justifyContent:'center',
  },

  color_gray: {
    color: '#666666',
  },
  color_888: {
    color: '#888888',
  },
  color_black: {
    color: '#272727',
  },
  color_red: {
    color: '#FC0204',
  },
  font_size_15: {
    fontSize: F(15),
  },

  offerInput: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    paddingRight: W(24),
    fontSize: F(15),
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    paddingRight: W(24),
    marginLeft: W(88),
    fontSize: F(15),
  },
  input_view: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  wrap: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  wrap_item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    height: W(51),
    backgroundColor: '#FFF',
  },
  wrap_line: {
    width: W(328),
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E6E6E6',
    marginLeft: W(24),
  },

  item_right: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: W(24),
  },
  text_left: {
    marginLeft: W(24),
    fontSize: F(15),
  },
  text_right:{
    marginRight: W(10),
    fontSize: F(15),
  },
  icon_right: {
    width: W(7),
    height: W(13),
    marginTop: W(1),
  },
  plusIntrod:{
    flex:1,
    flexDirection: 'row',
    height:W(60),
  },
  leftView:{ 
    flex:3, 
    justifyContent: 'center', 
    alignItems:'flex-start', 
    backgroundColor:'#000',
    position:'relative', 
    // paddingLeft:W(15), 
  },
  rightView:{ 
    flex:1,   
    justifyContent: 'center', 
    alignItems: 'flex-end', 
    backgroundColor:'#F6D7B0', 
    position:'relative', 
    // paddingRight:W(15), 
  },
  ktText:{ 
    color:'#fff', 
    fontSize:F(12), 
    fontWeight: '400',
  },
});
