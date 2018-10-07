
import React from 'react';
import { AsyncStorage, Modal, StyleSheet, Text, TextInput, TouchableHighlight,
  TouchableOpacity,View} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { BottomButton } from './BottomButton';

import { isIphone, px2dp, setFontSize } from 'js/helper/Adapter';
import { W } from 'js/helper/UI';
import { UserStore } from 'js/store/UserStore';
import _ from 'lodash';
import { inject } from 'mobx-react/native';
import { setBranchName } from 'js/api/manager';
import { appHeader } from 'js/ui/components/Navigation';
import FastImage from 'react-native-fast-image';

interface IProps {
  navigation: NavigationScreenProp<any, any>;
  userStore: UserStore;
}

@inject('userStore')
@appHeader('更多设置')
export class MoreSettings extends React.Component<IProps, any> {
  
  public constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      branchName: '',
    };
  }
  public componentDidMount() {
    AsyncStorage.getItem('branchName').then((val) => {
      this.setState({ branchName: val });
    });
  }
 
  public keyExtractor = (item: any, index: number) => {
    return item.title;
  }
  public renderInfoItem = (item: any, index: number) => {
    const arrow = index === 3 ? null : (<FastImage 
      source={require('img/more_right.png')} style={styles.arrow} resizeMode={FastImage.resizeMode.stretch}/>);
    const marRight = index === 3 ? { marginRight:W(18) } : null;

    return(

      <View style={{height:W(49)}} key={'cell_' + index}>
      <TouchableOpacity onPress={this.onClick.bind(this, index)}>
      <View style={[styles.infoItem]}>
        <Text style={styles.leftText}>{item.title}</Text>
        <View style={styles.rightView}>
        <Text style={[styles.rightText, marRight]} numberOfLines={1}>{item.content}</Text>
        {arrow}
        </View>
      </View>
      </TouchableOpacity>
      <View style={styles.line}/>
      </View>
    );
  }
  public setModalVisible(isvisible: boolean, fn?:any) {
    this.setState({ visible: isvisible }, () => {
      if (fn && typeof fn === 'function') fn();
    });
  }
  public _onClose = () => {
    this.setModalVisible(false);
  }
  public _onSave = () => {
    AsyncStorage.setItem('branchName', this.state.branchName);
    this.setModalVisible(false, setBranchName);
  }
  public clickFiveTimes = (fn: any, delay: number) => {
    let last:any;
    let count = 0;
    return  () => {
      const now:any = Date.now();
      if (last && now - last <= delay) {
        count += 1;
        last = now;
        if (count === 2) {
          fn.call();
          count = 0;
        }
      } else {
        last = now;
      }
    };
  }
  public countFive = this.clickFiveTimes(() => this.setModalVisible(true), 500);
  public setBranchName = (branchName: string) => {
    this.setState({ branchName });
  }
  public onClick = (index: number) => {
    if (index === 0) {
      this.props.navigation.navigate('PersonInfoScreen');
    } else if (index === 1) {
      this.props.navigation.navigate('SwapPhoneScreen');
    } else if (index === 2) {
      this.props.navigation.navigate('ModifyPassWord');

    } else if (index === 3) {
      this.countFive();
    }
  }

  public pushInfo = () => {
    setTimeout(() => {
      this.props.navigation.navigate('PersonInfoScreen');
    },         0);

  }

  public pushSwapPhone = () => {
    this.props.navigation.navigate('SwapPhoneScreen');
  }

  public pushModifyPsW = () => {
    this.props.navigation.navigate('ModifyPassWord');
  }
  public render() {
    const { self } = this.props.userStore;
    const data = [
      {
        title:'个人资料',
        content:'',
      },
      {
        title:'已绑定手机号',
        content: !self.mobile ? '未绑定' : self.mobile,
      },
      {
        title:'登录密码',
        content:'已设置',
      },
      {
        title:'版本号',
        content:'V3.0.0',
      },

    ];
    const contentView = data.map((item, index) => {
      return this.renderInfoItem(item, index);
    });
    return (
      <View style={styles.continer}>
 
        {contentView}
        <BottomButton {...this.props}/>
        <Modal
          animationType='none'
          transparent={true}
          visible={this.state.visible}
          onRequestClose={this._onClose}
        >
          <View style={styles.modalStyle}>
             <View style={styles.subView}>
               <Text style={styles.titleText}>
                 切换后端分支
               </Text>
               <View>
                <TextInput
                    style={styles.tf}
                    placeholderTextColor='#C6C6CC'
                    placeholder='输入分支名称'
                    underlineColorAndroid='transparent'
                    value={this.state.branchName}
                    onChangeText={this.setBranchName}
                />
               </View>
               <View style={styles.buttonView}>
                <TouchableHighlight
                    underlayColor='transparent'
                    style={styles.buttonStyle}
                    onPress={this._onClose}
                >
                   <Text style={styles.buttonText}>
                     取消
                   </Text>
                </TouchableHighlight>
                <View style={styles.verticalLine} />
                <TouchableHighlight
                    underlayColor='transparent'
                    style={styles.buttonStyle}
                    onPress={this._onSave}
                >
                   <Text style={styles.buttonText}>
                     确定
                   </Text>
                </TouchableHighlight>
               </View>
             </View>
           </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  continer:{
    flex:1,
    backgroundColor:'#fff',
  },
  list:{
    backgroundColor:'#fff',
  },
  backImage:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:44,
  },
  rightText:{
    fontSize:setFontSize(14),
    color:'#BFC2C7' ,
    fontWeight:'400',
    marginRight:W(6),
  },
  leftText:{
    fontSize:setFontSize(14),
    color:'#000',
    fontWeight:'400',
    marginLeft:W(15),
  },
  line:{
    height:isIphone() ? StyleSheet.hairlineWidth :W(0.8),
    width:px2dp(670),
    marginLeft:px2dp(30),
    backgroundColor:'#D9D9D9',
  },
  codetf:{
    height:px2dp(98),
    marginLeft:px2dp(40),
    flex:3,
    fontSize:px2dp(32),
    fontWeight:'400',
  },
  textCenter:{
    textAlign:'center',
  },
  modalStyle: {
    alignItems: 'center',
    justifyContent:'center',
    flex:1,
  },
  subView:{
    marginLeft:50,
    marginRight:50,
    backgroundColor:'#fff',
    alignSelf: 'stretch',
    justifyContent:'center',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor:'#ccc',
  },
  // 标题
  titleText:{
    marginTop:10,
    marginBottom:5,
    fontSize:16,
    fontWeight:'bold',
    textAlign:'center',
  },
  // 内容
  contentText:{
    margin:8,
    fontSize:14,
    textAlign:'center',
  },
  // 按钮
  buttonView:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonStyle:{
    flex:1,
    height:44,
    alignItems: 'center',
    justifyContent:'center',
  },
  // 竖直的分割线
  verticalLine:{
    width:0.5,
    height:44,
    backgroundColor:'#ccc',
  },
  buttonText:{
    fontSize:16,
    color:'#3393F2',
    textAlign:'center',
  },
  phonetf:{
    height:50,
    width: 100,
    fontSize:setFontSize(16),
    fontWeight:'400',
    marginBottom:-6,
  },
  tf:{
    height:px2dp(80),
    marginLeft:px2dp(20),
    marginRight:px2dp(20),
    marginBottom:px2dp(10),
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    fontSize: setFontSize(14),
    fontWeight:'400',
    color:'#000',
  },
  arrow:{
    width:W(8),
    height:W(13),
  },
  infoItem:{
    width:W(375),
    height:W(49),
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  rightView:{
    width:W(140),
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
    marginRight:W(15),
  },
});
