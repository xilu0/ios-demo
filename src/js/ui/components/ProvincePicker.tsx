
import React from 'react';

import {
  AppState,
  DeviceEventEmitter,
  EmitterSubscription, Modal, StyleSheet, TouchableWithoutFeedback, View,
} from 'react-native';

// https://github.com/beefe/react-native-picker/issues/273
import Picker from 'react-native-picker';

// tslint:disable-next-line
import areadata from 'json/test.json';

import { isiPhone } from 'js/helper/UI';
import { getIDList } from 'json/testid';

// import RNFS from 'react-native-fs';

// const getAreaData = () => {
//  return RNFS.readFileAssets('citydata.dump').then(JSON.parse);
// };

// let idlist: any;

// const getIDList = (nameList: string[]): Promise<number[]> => {
//   const getRs = () => {
//     return nameList.reduce((o, item, index) => {
//       o.rs.push(idlist[o.prev + item]);
//       o.prev = o.prev + item + '$';
//       return o;
//     },                     {
//       rs: [],
//       prev: '',
//     }).rs;
//   };
//   return new Promise((resolve, reject) => {
//     if (!idlist) {
//       RNFS.readFileAssets('city2id.dump').then(JSON.parse).then((data: object) => {
//         console.log(data);
//         idlist = data;
//         resolve(getRs());
//       }).catch(reject);
//     } else {
//       resolve(getRs());
//     }
//   });
// };

export interface IProvinceData {
  province: number;
  city: number;
  area: number;
  provinceName: string;
  cityName: string;
  areaName: string;
}

interface IProps {
  onConfrim: (data: IProvinceData) => void;
}

interface IState {
  visible: boolean;
}

export const toggleProvince = (visible: boolean) => {
  DeviceEventEmitter.emit('toggleProvince', visible);
};

export class ProvincePicker extends React.Component<IProps, IState> {

  private listener?: EmitterSubscription;

  private _timerShow = 0;

  public state = {
    visible: false,
  };

  private async initProvince() {
    // const areadata = await getAreaData();
    Picker.init({
      pickerConfirmBtnText: '确定',
      pickerConfirmBtnColor: [0, 0, 0, 1],

      pickerCancelBtnText: '取消',
      pickerCancelBtnColor: [100, 100, 100, 1],

      pickerTitleText: '地址',
      pickerTitleColor: [0, 0, 0, 1],
      pickerBg: [232, 232, 232, 1],

      pickerData: areadata,
      selectedValue: [59],
      onPickerConfirm: async (arr) => {
        const idarr = await getIDList(arr);
        console.log(idarr);
        const state: IProvinceData = {
          province: idarr[0],
          city: idarr[1],
          area: idarr[2],
          provinceName: arr[0],
          cityName: arr[1],
          areaName: arr[2],
        };
        this.setState({ visible: false });
        this.props.onConfrim(state);
      },
      onPickerCancel: (data) => {
        this.setState({ visible: false });
      },
    });
  }

  public componentWillMount() {
    this.initProvince();
    this.listener = DeviceEventEmitter.addListener('toggleProvince', (visible: boolean) => {
      this.setState({ visible });
    });
  }

  public componentWillUnmount() {
    if (this.listener) {
      this.listener.remove();
    }
    if (this._timerShow !== 0) {
      clearTimeout(this._timerShow);
    }
  }

  public render() {
    const { visible } = this.state;
    const equestClose = () => {
      Picker.hide();
      this.setState({
        visible: false,
      });
    };
    const onShow = () => {
      if (visible) {
        this._timerShow = setTimeout(() => {
          // https://github.com/beefe/react-native-picker/issues/319
          if (isiPhone()) {
            this.initProvince();
          }
          Picker.show();
        });
      }
    };
    return (
      <View>
        <Modal
            visible={visible}
            animationType={'none'}
            transparent={true}
            onRequestClose={equestClose}
            onShow={onShow}
        >
          <TouchableWithoutFeedback style={{ flex:1 }}>
            <View style={styles.modalBackground} />
          </TouchableWithoutFeedback>
        </Modal>
      </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
