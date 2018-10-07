import React, { Component } from 'react';
import {Text, View, Alert} from 'react-native';
import Barcode from 'react-native-smart-barcode';
import { navigate } from 'js/helper/navigate';
import { NavigationKeys } from 'js/const/NavigationKeys';
// import TimerEnhance from 'react-native-smart-timer-enhance';
export class ScanScreen extends React.Component  {
  
  private _barCode = React.createRef<any>();

render() {

  return (
      <View style={{flex: 1, backgroundColor: 'black',}}>
           <Barcode style={{flex: 1,}}
              ref={this._barCode}
               onBarCodeRead={this._onBarCodeRead}/>
      </View>
  )
}

jumpMerchantDetail=(merchantId:number)=>{
  navigate(NavigationKeys.MerchantDetail, {
    merchantId,
  });

}

_onBarCodeRead = (e) => {
  console.log(`e.nativeEvent.data.type = ${e.nativeEvent.data.type}, e.nativeEvent.data.code = ${e.nativeEvent.data.code}`);
  this.stopScan();
  const code = e.nativeEvent.data.code;
  const merchant_id = code.split('?merchant_id=')[1];

  // Alert.alert(e.nativeEvent.data.type, e.nativeEvent.data.code, [
  //     {text: 'OK', onPress: () => this.startScan()},
  // ]);
} 

startScan = () => {
  this._barCode.current.startScan()
}

stopScan = () => {
  this._barCode.current.stopScan()
}



}