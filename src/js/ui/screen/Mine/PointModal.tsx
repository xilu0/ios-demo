
import { F, W } from 'js/helper/UI';
import { UserStore } from 'js/store/UserStore';
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal2 from 'react-native-modalbox';

import { getStore } from 'js/helper/Store';

interface IProps {
  visible:boolean;
}

@inject('userStore')
@observer
export class PointModal extends React.Component<IProps, {}> {

  private userStore: UserStore;
  private timer:any;
  constructor(props: IProps) {
    super(props);
    this.userStore = getStore().userStore;
  }
  public componentDidMount = () => {
    this.timer = setTimeout(() => {
      this.userStore.setModalStatus(false);
    },                      3000);
  }
  public componentWillUnmount = () => {
    clearTimeout(this.timer);
  }
  public hide = () => {
    this.userStore.setModalStatus(false);
  }
  public render = () => {

    const { self } = this.userStore;
    const isPlus = !!(self.plusStatus === 1);
    return(
      <View style={styles.container}>
        <Modal2
          isOpen={this.userStore.pointModalVisible}
          style={[styles.wrap]}
          backButtonClose={true}
          // onClosed={this._onClose}
          position={'bottom'}
          swipeToClose={false}
          backdropOpacity={0}
          animationDuration={250}
          coverScreen={true}
        >
          <View style={styles.modalStyle}>
          <View style={styles.leftView}>
            <Text style={{ color:'#D1A17A', fontSize:F(14) }}>今日获得+{isPlus ? 20 : 10}积分</Text>
            <Text style={{ color:'#fff', fontSize:F(12) }}>每日登录可获得积分,请到我的页面查看</Text>
          </View>
          <View style={styles.rightView}>
            <TouchableOpacity 
              onPress={this.hide} 
              activeOpacity={0.75}
              style={styles.btn}
            >
              <Text style={{ color:'#fff', fontSize:F(12) }}>我知道了</Text>
            </TouchableOpacity>
          </View>
          </View>
        </Modal2>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: 'center',
  },
  wrap: {
    position:'relative',
    width: W(345),
    height: W(50),
    backgroundColor:'rgba(0, 0, 0, 0.7)',
    borderRadius: W(10),
    bottom: W(50),
  },
  modalStyle: {
    flex:1,
    flexDirection: 'row',
    height:W(65),
  },
  leftView:{ 
    flex:3 , 
    justifyContent: 'center', 
    alignItems:'flex-start',
    paddingLeft:W(15),
  },
  rightView:{ 
    flex:1,   
    justifyContent: 'center', 
    alignItems: 'flex-end', 
    paddingRight:W(15),
  },
  btn:{
    width:W(60),
    height:W(27),
    borderColor:'#fff',
    borderWidth:StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
