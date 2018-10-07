import { getUserToken } from 'js/api';
import { NavigationKeys } from 'js/const/NavigationKeys';
import { px2dp } from 'js/helper/Adapter';
import { F, ifiPhoneX, W } from 'js/helper/UI';
import { HomeStore } from 'js/store/HomeStore';
import { UserStore } from 'js/store/UserStore';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal2 from 'react-native-modalbox';
import { NavigationScreenProp } from 'react-navigation';
import { formatString } from 'js/helper/Date';
import { getStore } from 'js/helper/Store';
import { StatusBarHeight } from 'js/helper/UI';
import { appHeader } from 'js/ui/components/Navigation';
import { PlusMember } from '.././Home/PlusMember';
import { HotShop } from '../Home/HotShop';
import { MemberRights } from './MemberRights';
import { TrialButton } from './TrialButton';
import FastImage from 'react-native-fast-image';

const ScreenWidth = Dimensions.get('window').width;

interface IProps {
  navigation: NavigationScreenProp<IProps>;
  userStore: UserStore;
}

interface IState {
  isShow: boolean;
}
const config = {
  
};
@appHeader('我的PLUS会员', {
  back:(navigation) => {
    if (navigation.getParam('type') === 'home') {
      navigation.navigate('Home');
    } else {
      navigation.navigate('Profile');
    }
  },
  headerStyle: {
    borderBottomWidth: 0,
    backgroundColor: '#FFF',
  },
})

@inject('userStore')
@observer
export class MemberIntrod extends React.Component<IProps, IState> {
  public static navigationOptions = {
    header: <View />,
  };
  private userStore: UserStore;
  private homeStore: HomeStore;
  constructor(props: IProps) {
    super(props);
    this.userStore = getStore().userStore;
    this.homeStore = getStore().homeStore;
  }
  public static defaultProps = {
    calcContent: [
      { type: 0,
        description: '单笔订单比普通用户少付5%~10%',
        originalPrice: '',
        currentPrice: '',
        days: '',
      },
    ],
  };

  public componentDidMount() {
    const token = getUserToken();
    if (token) {
      this.userStore.requestGetUserInfo();
    }
  }
  public state = {
    isShow:false,
  };

  public _onClose = () => {
    this.setState({
      isShow:false,
    });
  }
  public setModal = () => {
    this.setModalVisible(true);
  }
  public setModalVisible(isShow: boolean) {
    this.setState({ isShow });
  }
  public goBack = () =>  {
    const props = this.props;
    props.navigation.goBack();
  }
  public goTrial = () => {
    this.props.navigation.navigate(NavigationKeys.MemberTrial);
  }
  public goOpenCard = (type:string) => {

    const { self } = this.userStore;
    const title = type === 'kt' ? '开通' : '续费';
    this.setState({
      isShow:false,
    },            () => {
      this.props.navigation.navigate(NavigationKeys.MemberOpen, { title });
    });

  }
  public renderStatusZero = () => {
    const { self } = this.userStore;

    return (
      <View style={styles.jumpBtn}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={this.goTrial}
          style={styles.btn}
        >
          <View style={{ flex:1, flexDirection:'row' , alignItems:'center' , justifyContent:'center' }}>
            <Text style={styles.text}>{self.plusStatus === 0 ? '立即试用PLUS会员' : '立即续费'}</Text>
            <FastImage 
              source={require('img/plusMember/rightArrow.png')} 
              style={styles.rightArrow}
              resizeMode={FastImage.resizeMode.stretch}
            />
          </View>
        </TouchableOpacity>
      </View>);
  }

  public renderStatusAntiZ = () => {
    const { self } = this.userStore;
    const headPictureSource = self.headPicture ? { uri: self.headPicture } : require('img/2b.jpeg') ;
    return (
        <View style={{ position:'absolute', top: W(36), flex:1, width:W(285) }}>
          <View>
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.headerImage}
            >
              <FastImage source={headPictureSource} style={styles.avatar}/>
            </TouchableOpacity>
            <Text style={[styles.c_F0C894, styles.mt_6, styles.f_15]}>{self.name}</Text>
            <View style={styles.endTime}>
              <Text style={[styles.c_F0C894, styles.f_11]}>
                {formatString(new Date(+self.plusEndTime), 'yyyy-MM-dd')}
              </Text>
              <Text style={[styles.c_F0C894, styles.f_11]}>到期</Text>
            </View>
          </View>
          <View style={styles.xfBtn}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={this.goOpenCard.bind(this, 'xf')}
              style={styles.rightBtn}
            >
              <Text style={[styles.text, styles.f_12]}>立即续费</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
  public renderPlusTopView = () => {
    const { self } = this.userStore;
    const isNotPlusMember = self.plusStatus === 0;
    const picPath = isNotPlusMember ? require('img/plusMember/membercard.png') : require('img/plusMember/plusbg.png');
    const cardHeight = isNotPlusMember ? styles.h_224 : styles.h_196;
    return (
      <View>
        <View style={styles.tryContent}>
          <FastImage 
          source={picPath} 
          style={[styles.mcardImage, cardHeight]} resizeMode={FastImage.resizeMode.stretch}/>
           {isNotPlusMember ? this.renderStatusZero() : this.renderStatusAntiZ()} 
        </View>
      </View>);
  }

  public render = () => {

    const { self } = this.userStore;
    return(
      <SafeAreaView style={styles.allView}>
          <View style={styles.container}>
            {/* <View style={styles.header}>
              <TouchableOpacity
                onPress={this.goBack}
                style={styles.tapHeaderImage}                    
                activeOpacity={0.75}
              >
                <View style={styles.topBackView}>
                  <Image source={require('img/plusMember/topback.png')}/>
                  <Text style={styles.ownPlus}>我的PLUS会员</Text>
                </View>
              </TouchableOpacity>
            </View> */}
            <ScrollView style={{ flex:1 }}>
            <View style={styles.bg_fcfaf6}>
            {this.renderPlusTopView()}
            <MemberRights/>
            <View style={styles.ktContent}>
              <View style={styles.ktBtn}>
                <TrialButton
                  userStore={this.userStore}
                  navigation={this.props.navigation}
                  name={self.plusStatus === 0 ? '立即开通, 尽享权益' : '立即续费'}
                  callback={this.goOpenCard.bind(this, (self.plusStatus === 0 ? 'kt' : 'xf'))}
                  styles={styles.ktClickbtn}
                  textStyle={styles.kcText}
                />
              </View>
              <View style={styles.calcContent}>
                <View style={styles.calcTop}>
                  <View>
                  <TouchableOpacity
                    onPress={this.setModal}
                    activeOpacity={0.75}
                  >
                    <View style={styles.calcView}>
                      <FastImage 
                          source={require('img/plusMember/calc.png')} 
                          style={styles.calcImage}
                          resizeMode={FastImage.resizeMode.stretch}
                      />
                      <Text style={styles.calcTool}>省钱计算器</Text>
                      <FastImage
                        source={require('img/plusMember/rightArrow.png')}
                        style={styles.calcArrow}
                        resizeMode={FastImage.resizeMode.stretch}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                </View>
                <View style={styles.calcDesc}><Text style={styles.calcText}>（开通爱享到PLUS卡预计可省￥3510）</Text></View>
              </View>
            </View>
            </View>
            <View>
              <PlusMember
                homeStore={this.homeStore}
                title={'精选商品'}
                picPath={require('img/plusMember/waiting.png')}
              />
              <HotShop
                homeStore={this.homeStore}
                navigation={this.props.navigation}
                title={'PLUS会员精选商家'}
                isPlusType={true}
              />
            </View>
            <Modal2
              isOpen={this.state.isShow}
              style={[styles.wrap]}
              backButtonClose={true}
              onClosed={this._onClose}
              position={'center'}
              swipeToClose={false}
              backdropOpacity={0.7}
              animationDuration={250}
              coverScreen={true}
            >
              <View style={styles.modalStyle}>
                <FastImage source={require('img/plusMember/calcRules.png')} style={{ width:W(315), height:W(479) }}/>
                <View style={styles.modalBtn}>
                  <TrialButton
                    userStore={this.props.userStore}
                    navigation={this.props.navigation}
                    name={`立即${self.plusStatus === 0 ? '开通' : '续费'}PLUS会员`}
                    callback={this.goOpenCard.bind(this, 'kt')}
                    otherStyle={{ width: W(264) }}
                  />
                </View>
              </View>
            </Modal2>
            </ScrollView>
          </View>
      </SafeAreaView>
    );
  }
}
const SBH = ifiPhoneX(40, 20, StatusBarHeight);

const styles = StyleSheet.create({
  header:{
    flexDirection:'row',
    width:ScreenWidth,
    paddingTop: SBH,
    height: W(50) + SBH,
    zIndex:10,
  },
  tapHeaderImage:{
    height:W(35),
    left: W(15),
  },
  modalStyle: {
    position:'relative',
    flex:1,
    alignItems: 'center',
    justifyContent:'center',
    paddingHorizontal: W(40),
  },
  allView:{ 
    flex: 1, 
    backgroundColor: '#fff',
  },
  bg_fcfaf6:{
    backgroundColor:'#fcfaf6',
  },
  container:{
    flex:1,
  },
  topBackView:{ 
    flex:1, 
    flexDirection:'row', 
    justifyContent:'flex-start', 
    alignItems:'center', 
  },
  modalBtn:{
    position:'absolute',
    bottom:W(20),
  },
  ownPlus:{
    width: W(133),
    height: W(24),
    marginLeft: W(4),
    fontWeight:'500',
    color:'#333',
    fontSize:F(17),
  },
  mt_6:{
    marginTop:W(6),
  },
  rightArrow:{
    width:W(10),
    height:W(10),
    marginLeft: W(2),
    // tintColor:'#F0C894',
  },
  wrap: {
    width:W(315),
    height: W(479),
    backgroundColor: '#fff',
    top: 0,
  },
  headerImage:{
    width: W(65),
    height: W(65),
  },
  endTime:{ 
    flex:1, 
    flexDirection:'row', 
    justifyContent:'flex-start', 
    alignItems:'center', 
  },
  avatar:{
    width: W(65),
    height: W(65),
    borderColor:'#F0C894',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: W(65 / 2),
  },
  tryContent:{
    position:'relative',
    justifyContent:'center',
    alignItems: 'center',
    marginTop:W(10),
  },
  h_196: {
    height: W(196),
  },
  h_224:{
    height: W(224),
  },
  mcardImage:{
    // width: ScreenWidth,
    width:W(358),
    // marginHorizontal: W(30),
  },
  calcArrow:{
    marginLeft: W(4),
    width:W(10),
    height:W(10),
    // tintColor:'#DAB779',
  },
  jumpBtn:{
    top: -W(55),
    paddingLeft: W(15),
    justifyContent:'center',
    alignItems: 'center',
  },
  xfBtn:{
    width: W(100),
    top: -W(30),
    left: W(195),
    justifyContent:'flex-end',
    alignItems: 'center',
    borderColor: '#D7B489',
    borderWidth:W(0.5),
    borderRadius:40,
  },
  rightBtn:{
    width: W(82),
    height: W(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  f_6:{
    fontSize: W(6),
  },
  f_15:{
    fontSize: F(15),
  },
  f_12:{
    fontSize: F(12),
  },
  f_11:{
    fontSize: W(11),
  },
  c_F0C894:{
    color:'#F0C894',
    lineHeight:W(20),
  },
  btn:{
    width: W(160),
    height: W(30),
    borderRadius: 40,
    marginTop: -W(18),
    borderColor: '#D7B489',
    borderWidth: W(1),
    marginRight: W(30),
    justifyContent:'center',
    alignItems: 'center',
  },
  text:{
    fontSize: F(12),
    color:'#F0C894',
    fontWeight:'400',
  },
  ktContent:{
    paddingTop:px2dp(45),
    backgroundColor:'#fcfaf6',
  },
  ktBtn:{
    justifyContent:'center',
    alignItems: 'center',
    paddingBottom:W(20),
    marginHorizontal: W(24),
  },
  ktClickbtn:{
    width:W(328),
    height:W(46),
    backgroundColor:'#F0CC9D',
    borderRadius: W(40),
    marginTop:4,
    justifyContent:'center',
    alignItems: 'center',
  },
  kcText:{
    fontSize:F(16),
    color:'#9A6F44',
    letterSpacing:W(1),
  },
  calcTop:{
    justifyContent:'center',
    alignItems: 'center',
  },
  calcImage:{
    
    width:W(18),
    height:W(18),
    // tintColor:'#DAB779',
  },
  calcTool:{
    marginLeft:W(5),
    color:'#DAB779',
    fontSize: F(16),
  },
  calcView:{
    justifyContent:'center',
    flexDirection:'row',
    alignItems: 'center',
    marginBottom:W(6),
  },
  calcContent:{
    // height:px2dp(120),
    paddingTop:W(25),
    marginBottom:W(10),
    borderTopColor: 'rgba(240, 200, 148, 0.6)',
    borderTopWidth: W(0.5),
  },
  calcDesc:{
    justifyContent:'center',
    alignItems: 'center',
    marginBottom: W(20),
  },
  calcText:{
    color:'#666',
    fontSize: F(12),
  },
  mt_30:{
    marginTop:W(30),
  },
});
