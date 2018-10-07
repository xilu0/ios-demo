import React from 'react';
import { Dimensions ,  StyleSheet, TouchableHighlight, View,TextInput,Text } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { RulesEnums } from 'js/const/RulesKeys';
import { px2dp, setFontSize } from 'js/helper/Adapter';
import { IRule, testList } from 'js/helper/Rules';
import { getStore } from 'js/helper/Store';
import { UserStore } from 'js/store/UserStore';
import { showToast } from 'js/ui/components/Toast';
import { toJS } from 'mobx';
import { inject } from 'mobx-react';
import FastImage from 'react-native-fast-image';


const ScreenHeight = Dimensions.get('window').height;

interface IProps {
  navigation: NavigationScreenProp<IProps, any>;
  userStore: UserStore;
  name: string;
  screenProps: any;

}
@inject('userStore')
export class ModifyNameScreen extends React.Component<IProps, any> {

  private static save = (navigation: any) => {
    const { userStore } = getStore();
    const name = navigation.getParam('name');
    const rulelist: IRule[] = [
      {
        rex: RulesEnums.USERNAME,
        value: name,
      },
    ];
    const errmsg = testList(rulelist);
    if (errmsg !== true) {
      return showToast(errmsg);
    }
    userStore.requestUpdateUserInfo({ name }).then(() => {
      navigation.goBack();
    });
  }


  public static navigationOptions = ({ screenProps = { statusBarHeight: 0 }, navigation }: IProps) => {
    const _statusBarHeight = screenProps.statusBarHeight;

    const defaultConfig = {
      headerLeft: (
        <TouchableHighlight
          onPress={navigation.getParam('goBack')}
          style={styles.backImage}
          underlayColor={'rgba(0,0,0,0)'}
        >
           <View>
              <FastImage source={require('img/navBack.png')} resizeMode={FastImage.resizeMode.stretch}/>
            </View>
        </TouchableHighlight>
      ),
    title:'个人资料',
    headerRight:(
        <TouchableHighlight
            onPress={ModifyNameScreen.save.bind(null, navigation)}
            underlayColor={'rgba(0,0,0,0)'}
            style={styles.rightBtn}
        >
          <Text style={{ color:'#000', alignSelf:'center', fontSize:setFontSize(17), fontWeight:'400' }}>保存</Text>
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

  public constructor(props: any) {
    super(props);
    this.props.navigation.setParams({ goBack: this.goBack.bind(this) });
  }

  public goBack() {
    this.props.navigation.goBack();
  }

  public render() {
    const change =  this.textChange.bind(this);
    const name = toJS(this.props.userStore.self.name) || '';
    return(
      <View style={styles.container}>
      <View style={styles.content}>
        <TextInput
          style={styles.phonetf}
          placeholder={name}
          placeholderTextColor='#C6C6CC'
          onChangeText={change}
          maxLength={16}
          underlineColorAndroid='rgba(0,0,0,0)'
        />
        <Text style={styles.line}/>
        </View>
    </View>
    );
  }
  public textChange(name: string) {
    this.setState({
      name,
    });
    this.props.navigation.setParams({
      name,
    });

  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#fff',
    height:ScreenHeight ,

  },

  content:{
    marginTop:0,
    height: px2dp(140),
  },
  phonetf:{
    height:px2dp(100),
    marginTop:px2dp(40),
    marginLeft:px2dp(62),
    width:px2dp(670),
    fontSize:setFontSize(16),
    fontWeight:'400',
    color:'#000',
  },
  line:{
    backgroundColor:'#000',
    height:px2dp(2),
    marginLeft:px2dp(40),
    width:px2dp(670),
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
    width:44,
    marginRight:6,
  },
});
