import { isIphone, px2dp } from 'js/helper/Adapter';
import { hideLoading, showLoading } from 'js/helper/Loading';
import { F, W } from 'js/helper/UI';
import { UserStore } from 'js/store/UserStore';
import { inject, observer } from 'mobx-react';
import React from 'react';
import {  StyleSheet, Text , TouchableWithoutFeedback, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { PlusMemberType } from 'js/api/api';
import { formatString } from 'js/helper/Date';
import FastImage from 'react-native-fast-image';


interface IExtPlusMemberType extends PlusMemberType {
  isActive: boolean;
}
interface IProps {
  navigation: NavigationScreenProp<any>;
  // data: IExtPlusMemberType[];
  bottomDesc: string[];
  userStore: UserStore;
}

@inject('userStore')
@observer
export class TrialWays extends React.Component<IProps, any> {
  public userStore: UserStore;
  constructor(props: IProps) {
    super(props);
    this.userStore = props.userStore;
    this.state = {
      subData:[{
        isActive:false,
      }],
      currentDays: formatString(new Date(this.setTimes(31)), 'yyyy-MM-dd'),
    };
  }
  public onpress = (item: IExtPlusMemberType, index: number) => {
    const subData = this.userStore.plusTypes;
    this.userStore.setPlusData(item, index);
    const days = this.userStore.plusTypes[index].days || 31;
    const currentDay = formatString(new Date(this.setTimes(days)), 'yyyy-MM-dd');

    this.setState({ subData:this.userStore.plusTypes, currentDays: currentDay });
  }
  public renderPic = (item: IExtPlusMemberType, index: number) => {
    const subData = this.state.subData;
    return (((subData[index] && subData[index].isActive) || item.isActive) ?
      <FastImage 
        source={require('img/plusMember/tick.png')} 
        style={styles.statusPic} 
        resizeMode={FastImage.resizeMode.stretch} 
        /> :
      <FastImage source={require('img/round.png')} style={styles.statusPic} />);
  }
  public setTimes = (day: number) => {
    const { self } = this.userStore;
    const isPlus = self.plusStatus === 1;
    const date = isPlus ? new Date(+self.plusEndTime) : new Date();
    return date.setDate(date.getDate() + (day));
  }

  public renderItem = (data: IExtPlusMemberType[]) => {
    const props = this.props;
    const subData = this.state.subData;
    return data.map((item, index) => {
      const activeStyle = ((subData[index] && subData[index].isActive) || item.isActive)
                        ? styles.activeBorder : styles.normoalBorder;
      const activeFW = ((subData[index] && subData[index].isActive) || item.isActive) ? styles.fw_b : styles.fw_n;

      return (
        <TouchableWithoutFeedback onPress={this.onpress.bind(this, item, index)} key={item.type}>
          <View
            style={[styles.container, activeStyle]}
          >
            <View style={[styles.topWay]}>
              <Text style={[styles.f_15, styles.c_333, activeFW]}>{item.name}</Text>
              <Text style={styles.f_15}>{item.currentPrice}</Text>
            </View>
            <View style={[styles.topWay, styles.p_r]}>
              <Text style={[styles.c_999, styles.f_12]}>{item.description}</Text>
              <Text style={[styles.text_through, styles.c_c, styles.f_12]}>{item.originalPrice}</Text>
            </View>
            <View style={[styles.pic]}>
              {this.renderPic(item, index)}
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    });
  }
  public renderBottomDesc = () => {
    const props = this.props;
    const { plusTypes } = this.userStore;
    return props.bottomDesc.map((item, index) => {
      return <Text key={index} style={[styles.leftText, styles.desc_item]} >{item}{this.state.currentDays}</Text>;
    });
  }

  public componentWillMount = () => {
    showLoading('', 3000);
    this.props.userStore.requestGetPlusMemberType().then(() => {
      hideLoading();
    });
  }

  public render() {
    const { plusTypes } = this.userStore;
    return(
      <View>
        {this.renderItem(plusTypes)}
        <View style={styles.desc}>{this.renderBottomDesc()}</View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container:{
    position:'relative',
    width: W(346),
    height:W(80),
    borderWidth: W(1),
    borderRadius: 10,
    marginBottom: W(14),
  },
  fw_n:{
    fontWeight: 'normal',
  },
  fw_b:{
    fontWeight: 'bold',
  },
  normoalBorder:{
    borderColor: '#D8D8D8',
  },
  activeBorder:{
    borderColor: '#d1b17a',
  },
  topWay:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'center',
    alignContent: 'center',
    paddingTop:W(15),
    width: W(300),
    paddingHorizontal: W(10),
  },
  p_r: {
    position:'relative',
    top:-W(15),
  },
  f_15:{
    fontSize: F(15),
  },
  f_12:{
    fontSize: F(12),
  },
  pic:{
    position:'absolute',
    right:15,
    top:30,
  },
  statusPic:{
    height:px2dp(35),
    width:px2dp(35),
  },
  leftText:{
    height:px2dp(40),
    color:'#333',
    fontWeight:'400',
  },
  c_C3A78F:{
    color:'#C3A78F',
  },
  c_333:{
    color:'#333',
  },
  c_999:{
    color:'#999',
  },
  c_c:{
    color:'#ccc',
  },
  text_through:{
    textDecorationLine:'line-through',
  },
  desc:{
    // marginTop:W(10),
    height:W(33),
    width:W(221),
    left:W(10),
  },
  desc_item:{
    color:'#666',
    fontSize:F(12),
  },
});
