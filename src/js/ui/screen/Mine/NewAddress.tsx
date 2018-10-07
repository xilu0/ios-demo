import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  TouchableOpacity,
  } from 'react-native';

import { isIphone, px2dp, setFontSize } from 'js/helper/Adapter';
import { NavigationScreenProp } from 'react-navigation';

import { getStore } from 'js/helper/Store';
import { AddressModel , AddressStore } from 'js/store/UserStore';
import { showToast } from 'js/ui/components/Toast';

import { RulesEnums } from 'js/const/RulesKeys';
import { IRule, testList } from 'js/helper/Rules';
import { W } from 'js/helper/UI';
import { IProvinceData, ProvincePicker, toggleProvince } from 'js/ui/components/ProvincePicker';
import { Touchable } from 'js/ui/components/Touchable';
import { inject } from 'mobx-react/native';
import FastImage from 'react-native-fast-image';


const ScreenWidth = Dimensions.get('window').width;

interface INavigationProp {
  params: any;

}

interface IProps {
  navigation: NavigationScreenProp<INavigationProp>;
  addressStore: AddressStore;
  addressModel: AddressModel;
  screenProps: any;
}

enum DefaultMode {
  Default, UnDefault,
}
interface IState {
  mode: DefaultMode;
  address: string;
  contactName: string;
  mobile: string;
  province: number;
  city: number;
  area: number;
  provinceName: string;
  cityName: string;
  areaName: string;

}

@inject('addressStore')
// @observer
export class NewAddress extends React.Component<IProps, IState> {

  public state = {
    mode:DefaultMode.Default,
    address:'',
    contactName:'',
    mobile:'',
    province:0,
    city:0,
    area:0,
    provinceName:'',
    cityName:'',
    areaName:'',
  };

  private static isSaveIng: boolean = false;

  private static save = (navigation: any) => {
    const { addressStore } = getStore();
    const addr: AddressModel = new AddressModel();
    addr.contactMobile = navigation.getParam('mobile');
    addr.contactName = navigation.getParam('contactName');
    addr.address =  navigation.getParam('address');
    addr.isDefault = navigation.getParam('val');
    addr.province = navigation.getParam('province');
    addr.city = navigation.getParam('city');
    addr.area = navigation.getParam('area');

    addr.areaName = navigation.getParam('areaName');
    addr.provinceName = navigation.getParam('provinceName');
    addr.cityName = navigation.getParam('cityName');

    const isEdit = navigation.getParam('isEdit');
    const index =  navigation.getParam('index');

    if (!addr.province || addr.province === 0) {
      showToast('请选择省市区!');
      return;
    }
    if (!addr.address || addr.address.length === 0) {
      showToast('请输入地址!');
      return;
    }
    if (!addr.contactName || addr.contactName.trim().length === 0) {
      showToast('请输入姓名!');
      return;
    }

    const  mobile  = addr.contactMobile;
    const rulelist: IRule[] = [
      {
        rex: RulesEnums.TELPHONE,
        value: mobile,
      },
    ];
    const errmsg = testList(rulelist);
    if (errmsg !== true) {
      return showToast(errmsg);
    }
    if (NewAddress.isSaveIng) {
      return;
    }
    NewAddress.isSaveIng = true;

    if (isEdit === 1) {
      addr.id = navigation.getParam('id');
      addressStore.requestUpdateAddress(addr, index).then(() => {
        NewAddress.isSaveIng = false;
        navigation.goBack();
      }).catch((rs) => {
        NewAddress.isSaveIng = false;
        rs.json().then(console.log);
      });
    } else {

      addressStore.requestAddAddress(addr).then(() => {
        NewAddress.isSaveIng = false;
        navigation.goBack();
      }).catch((rs) => {
        NewAddress.isSaveIng = false;
        rs.json().then(console.log);
      });
    }

  }

  private updateProvice(data: any) {
    this.setState(data);
    this.props.navigation.setParams(data);

  }

  public static navigationOptions = ({ screenProps = { statusBarHeight: 0 }, navigation }: IProps) => {
    const _statusBarHeight = screenProps.statusBarHeight;

    const defaultConfig = {
      title: '新建地址',
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

      headerRight:(
        <TouchableOpacity
        onPress={NewAddress.save.bind(null, navigation)}
        style={styles.rightBtn}
      >
        <Text style={{ color:'#000', fontSize:setFontSize(16), fontWeight:'400' }}>保存</Text>
      </TouchableOpacity>


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

  public constructor(props: any) {
    super(props);
    this.props.navigation.setParams({ goBack: this.goBack.bind(this) });
  }

  public goBack() {
    this.props.navigation.goBack();
  }

  private shouldRender: boolean = false;

  public componentDidMount() {

    let val = 1;
    this.props.navigation.setParams({ val });

    const isEdit =  this.props.navigation.state.params.type === 'edit' ? 1 :0;
    if (isEdit === 1) {
      const addressModel =  this.props.navigation.state.params.model;
      const index =  this.props.navigation.state.params.index;
      this.shouldRender = true;

      const {
        id,
        address,
        contactName,
        contactMobile: mobile,
        city, area, province,
        cityName, areaName, provinceName,

      } = addressModel;

      val = addressModel.isDefault;

      this.setState({
        address,
        contactName,
        province,
        city,
        area,
        provinceName,
        cityName,
        areaName,
        mobile,
      });

      this.props.navigation.setParams({
        isEdit, id , index , contactName, mobile , address, val, city, area, province,
      });
      if (addressModel.isDefault === 0) {
        this.setState({
          mode:DefaultMode.UnDefault,
        });
      } else {
        this.setState({
          mode:DefaultMode.Default,
        });
      }
    }

  }

  public addressChange(address: string) {
    this.setState({
      address,
    });
    this.props.navigation.setParams({ address });
  }

  public nameChange(contactName: string) {
    this.setState({
      contactName,
    });
    this.props.navigation.setParams({ contactName });
  }
  public mobileChange(mobile: string) {
    this.setState({
      mobile,
    });
    this.props.navigation.setParams({ mobile });
  }
  public setDefaut = () => {
    const targetMode = this.state.mode === DefaultMode.Default ? DefaultMode.UnDefault :DefaultMode.Default;
    this.shouldRender = true;
    this.setState({
      mode: targetMode,
    });
    const val = targetMode === DefaultMode.Default ? 1 : 0;
    this.props.navigation.setParams({ val });
  }
  public deleteAddress() {
    const model: AddressModel =  this.props.navigation.state.params.model;
    this.props.addressStore.requestDeleteAddress(model).then((rs) => {
      console.log(rs);
      this.props.navigation.goBack();
    }).catch(console.log);

  }

  public shouldComponentUpdate() {
    if (this.shouldRender) {
      this.shouldRender = false;
      return true;
    }
    return false;
  }

  public render() {

    const img = this.state.mode === DefaultMode.Default ? require('img/Checknumber.png') : require('img/round.png');
    const changeAddress =  this.addressChange.bind(this);
    const changeName =  this.nameChange.bind(this);
    const changeMobile =  this.mobileChange.bind(this);
    const deleteAddress =  this.deleteAddress.bind(this);
    const setDefaut = () => this.setDefaut();

    const onProvinceConfirm = (data: IProvinceData) => {
      console.log(data);
      this.shouldRender = true;
      this.updateProvice(data);
    };

    const onProvinceClick = () => {
      toggleProvince(true);
    };

    const addressText = this.state.provinceName ?
      ((this.state.provinceName || '') + (this.state.cityName || '') + (this.state.areaName || '')) :
      '省份、城市、区县';
    const addressTextStyle = this.state.provinceName ? { color: '#000' } : null;
    this.shouldRender = false;
    return(
      <ScrollView  style={styles.continer}>
        <View style={styles.content}>
         <TouchableHighlight style={styles.addressText} onPress={onProvinceClick} underlayColor={'rgba(0,0,0,0)'}>
              <Text
                style={[styles.checkText, addressTextStyle]}
              >
              {addressText}
              </Text>
          </TouchableHighlight>
          <View style={styles.line}/>
          <TextInput
            style={styles.tf}
            placeholder='详细地址.如街道.楼牌号等'
            placeholderTextColor='#7F7F7F'
            defaultValue={this.state.address}
            onChangeText={changeAddress}
            underlineColorAndroid={'rgba(0,0,0,0)'}
          />
          <View style={styles.line}/>
          <TextInput
            style={styles.tf}
            placeholder='姓名'
            placeholderTextColor='#7F7F7F'
            defaultValue={this.state.contactName}
            onChangeText={changeName}
            underlineColorAndroid={'rgba(0,0,0,0)'}

          />
          <View style={styles.line}/>
          <TextInput
            style={styles.tf}
            placeholder='手机号码'
            placeholderTextColor='#7F7F7F'
            defaultValue={this.state.mobile}
            onChangeText={changeMobile}
            keyboardType='number-pad'
            maxLength={11}
            underlineColorAndroid={'rgba(0,0,0,0)'}

          />
          <View style={styles.line}/>
          <Touchable style={styles.checkBtn} onPress={setDefaut} underlayColor={'rgba(0,0,0,0)'}>
            <View style={styles.checkBox}>
              <Text style={styles.checkText}>设置默认地址</Text>
              <FastImage source={img} style={styles.checkImg}/>
            </View>
          </Touchable>
          <View style={styles.space}/>
          <TouchableHighlight style={styles.delete} underlayColor={'rgba(0,0,0,0)'} onPress={deleteAddress}>
              <Text style={styles.deleteText}>删除地址</Text>
          </TouchableHighlight>
          </View>

          <ProvincePicker
            onConfrim={onProvinceConfirm}
          />
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

  continer:{
    flex:1,
  },
  content:{
    backgroundColor:'#fff',
  },

  backImage:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:44,
  },
  areatf:{
    backgroundColor: 'red',
    height: px2dp(102),
    marginLeft:20,
    width:px2dp(679),
    paddingLeft: 0,
    fontSize:setFontSize(15),
    fontWeight:'400',
  },
  line:{
    backgroundColor:'#D9D9D9',
    height: isIphone() ? StyleSheet.hairlineWidth :W(0.8),
    marginLeft:px2dp(40),
    width:px2dp(679),
  },
  tf:{
    height: px2dp(102),
    marginLeft: px2dp(40),
    width:px2dp(679),
    paddingLeft: 0,
    fontSize:setFontSize(15),
    fontWeight:'400',
  },
  checkBtn:{
    width:ScreenWidth,
    height:51,
  },

  addressText: {
    left: px2dp(40),
    width:px2dp(679),
    height:px2dp(102),
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
  },

  checkBox:{
    left:20,
    width:px2dp(679),
    height:51,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  checkImg:{
    width:px2dp(42),
    height:px2dp(42),
  },
  checkText:{
    color:'#7F7F7F',
    fontSize:setFontSize(15),
    fontWeight:'400',

  },
  rightBtn:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:44,
    marginRight:6,
  },
  space:{
    backgroundColor:'#F2F2F2',
    height:px2dp(20),
  },
  delete:{
    height:52,
    alignItems:'center',
    justifyContent:'center',
  },
  deleteText:{
    color:'#FA4141',
    fontSize:setFontSize(15),
    fontWeight:'400',
  },
});
