
import { inject, observer } from 'mobx-react/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';

import DatePicker from 'react-native-datepicker';
import { NavigationScreenProp } from 'react-navigation';

import {  isIphone, px2dp } from 'js/helper/Adapter';
import { UserStore } from 'js/store/UserStore';

import { Body1 } from 'js/api';

import { F, W } from 'js/helper/UI';
import ImageCropPicker from 'react-native-image-crop-picker';
import { appHeader } from 'js/ui/components/Navigation';
import { NavigationKeys } from 'js/const/NavigationKeys';
import FastImage from 'react-native-fast-image';



interface IProps {
  navigation: NavigationScreenProp<any, any>;
  userStore: UserStore;
}
@inject('userStore')

@appHeader('个人资料')
@observer
export class PersonInfoScreen extends React.Component<IProps, any> {

  public state = {

    date:'2018-07-10',
    isShow:false,
    avatarSource:null,
  };

  public constructor(props: any) {
    super(props);
    this.props.navigation.setParams({ goBack: this.goBack.bind(this) });
  }

  public goBack() {
    this.props.navigation.goBack();
  }
  public renderInfoItem = (item: any, index: number) => {

    const rightTextStyle = index !== 4 ? styles.rightText :styles.rightLevel;

    const right = index === 0 ?
    (<FastImage source={{ uri:item.content}} style={styles.rightImage}/>)
    :(<Text style={rightTextStyle} numberOfLines={1}>{item.content}</Text>);
    const arrow = index === 4 ? null : (<FastImage 
      source={require('img/more_right.png')} style={styles.arrow} resizeMode={FastImage.resizeMode.stretch}/>);
    const itemHeight = index === 0 ? { height:W(79) } :null;
    return(
      <View style={itemHeight} key={item.name} >
      <TouchableOpacity onPress={this.onClick.bind(this, index)} >
      <View style={[styles.infoItem, itemHeight]}>
        <Text style={styles.leftText}>{item.title}</Text>
        <View style={styles.rightView}>
        {right}
        {arrow}
        </View>
      </View>
      </TouchableOpacity>
      <View style={styles.line}/>
      </View>
    );
  }

  public onClick = (index: number) => {
    if (index === 1) {
      this.props.navigation.navigate(NavigationKeys.ModifyNameScreen);
    } else if (index === 2) {
      this.showActionSheet();
    } else if (index === 3) {
      if (this.datePicker.current) {
        this.datePicker.current.onPressDate();
      }
    } else if (index === 0) {
      this.showImageSelectActionSheet();
    }
  }

  public selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
      title:'选择照片',
      takePhotoButtonTitle:'打开相机',
      chooseFromLibraryButtonTitle:'打开相册',
      cancelButtonTitle:'取消',
    };

    ImagePicker.showImagePicker(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };

        this.setState({
          avatarSource: source,
        });
        this.convertImageToBase64(source.uri);
      }
    });

  }

  public convertImageToBase64(path: string) {
    if (!path) {
      return '';
    }

    RNFS.readFile(path, 'base64')
        .then((content: string) => {
            // content 为base64数据
          const filename = path.split('\/').pop() || '';
          const parsms = {
            fileContent:content,
            fileName:filename,
          };
          console.log(parsms);
          this.props.userStore.requestUploadHeadImage(parsms);

        })
        .catch((err: Error) => {
          console.log('reading error: ' + err.message);
        });

  }

  private datePicker = React.createRef<any>();
  private actionSheet = React.createRef<any>();

  private imageSheet = React.createRef<any>();

  public updateSex(index: number) {
    const sex = index === 0 ? Body1.SexEnum.NUMBER_1 : Body1.SexEnum.NUMBER_2;
    this.props.userStore.requestUpdateUserInfo({ sex });
  }

  public updateBirthDay(birthday: Date) {
    this.props.userStore.requestUpdateUserInfo({ birthday });
  }

  public showActionSheet = () => {
    if (this.actionSheet.current) {
      this.actionSheet.current.show();
    }
  }

  public showImageSelectActionSheet = () => {
    if (this.imageSheet.current) {
      this.imageSheet.current.show();
    }
  }

  public render() {
    const data = [
      {
        title: '我的头像',
        content: this.props.userStore.self.headPicture ,
        name: 'headPicture',
      },
      {
        title: '用户名',
        content: this.props.userStore.self.name,
        name: 'name',

      },
      {
        title: '性别',
        content: this.props.userStore.self.sex === 1 ? '男' : '女',
        name: 'sex',
      },

      {
        title: '生日',
        content: this.props.userStore.self.birthday,
        name: 'birthday',
      },
      {
        title: '会员等级',
        content: 'V' + this.props.userStore.self.level,
        name: 'level',
      },
    ];
    const update = (index: number) => this.updateSex(index);
    const birthdayChange = (date: Date) => this.updateBirthDay(date);

    const onImageSelectClick = (index: number) => {
      if (index === 2) { return; }
      if (index === 0) {
        ImageCropPicker.openCamera({
          width: 300,
          height: 300,
          cropping: true,
        }).then((image: any) => {
          const source = { uri: image.path };
          this.setState({
            avatarSource: source,
          });
          this.convertImageToBase64(source.uri);
        });
      } else if (index === 1) {
        ImageCropPicker.openPicker({
          width: 300,
          height: 300,
          cropping: true,
        }).then((image: any) => {
          const source = { uri: image.path };
          this.setState({
            avatarSource: source,
          });
          this.convertImageToBase64(source.uri);
        });
      }

    };

    const list = data.map((item: any, index: number) => {
      return(
        this.renderInfoItem(item, index)
      );
    });

    return (
      <View style={styles.continer}>
        {list}
        <ActionSheet
          ref={this.actionSheet}
          options={['男', '女', '取消']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={update}
        />
        <ActionSheet
          ref={this.imageSheet}
          options={['照相机', '相册', '取消']}
          cancelButtonIndex={2}
          destructiveButtonIndex={0}
          onPress={onImageSelectClick}
        />
        <DatePicker
          ref={this.datePicker}
          style={{ width: 200 }}
          date={this.state.date}
          mode='date'
          placeholder=''
          format='YYYY-MM-DD'
          minDate='900-05-01'
          maxDate={new Date()}
          confirmBtnText='确定'
          cancelBtnText='取消'
          hideText={true}
          showIcon={false}
          onDateChange={birthdayChange}
        />
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
  leftText:{
    fontSize:F(14),
    color:'#000',
    fontWeight:'400',
    marginLeft: W(20),

  },
  rightText:{
    fontSize:F(14),
    color:'#BFC2C7',
    fontWeight:'400',
    width:W(100),
    textAlign:'right',
    marginRight: W(7),

  },
  rightLevel:{
    fontSize:F(14),
    color:'#666666',
    fontWeight:'400',
    marginRight: W(16),

  },
  backImage:{
    alignItems:'center',
    justifyContent:'center',
    height:64,
    width:44,
  },

  line:{
    marginLeft:px2dp(30),
    width:px2dp(680),
    height:isIphone() ? StyleSheet.hairlineWidth :W(0.8),
    backgroundColor:'#D9D9D9',
  },
  infoItem:{
    width:W(375),
    height:W(49),
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
  },
  rightImage:{
    width:W(53),
    height:W(53),
    borderRadius: W(53 / 2),
    marginRight: W(7),

  },
  arrow:{
    width:W(8),
    height:W(13),
  },

  rightView:{
    width:W(140),
    flexDirection: 'row',
    justifyContent:'flex-end',
    alignItems: 'center',
    marginRight: W(20),
  },
});
