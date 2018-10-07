
import React from 'react';

import { merge } from 'lodash';
import { action, observable } from 'mobx';
import {
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { setFontSize } from 'js/helper/Adapter';
import { strings } from 'js/helper/I18n';
import { F, ifiPhoneX, isiPhone, screenHeight, StatusBarHeight, W } from 'js/helper/UI';

import { City, GeolocationStore } from 'js/store/GeolocationStore';

import { CityModel, HomeStore } from 'js/store/HomeStore';
import { Touchable } from 'js/ui/components/Touchable';

import AlphabetListView from 'react-native-alphabetlistview';
import { NavigationScreenProp } from 'react-navigation';

import { inject, observer } from 'mobx-react';
import FastImage from 'react-native-fast-image';


interface IProps {
  navigation: NavigationScreenProp<IProps>;
  homeStore: HomeStore;
  geolocationStore: GeolocationStore;

}
@inject('homeStore', 'geolocationStore')
@observer
export class SelectCity extends React.Component<IProps> {

  public componentDidMount() {
    this.props.homeStore.requestGetHotCity();
    this.props.homeStore.requestGetAllCity();

    this.props.geolocationStore.getGeolocationCity().then((city: any | City) => {
      this.updateIndexCity(city);
    });

  }
  public goBack = () => {
    this.props.navigation.goBack();
  }
  public onTap = (item: City) => {
    if (item && item.id !== undefined && item.id >= 0) {
      this.props.homeStore.addHistory(item);
      this.props.geolocationStore.setSelectCity(item);
      this.goBack();
    }
  }

  public getItem = (item: CityModel, index: number) => {
    const leftStyle = index % 3 === 0 ? null : styles.itemMarginLeft;
    return (
      <TouchableWithoutFeedback onPress={this.onTap.bind(this, item)} key={item.id}>
        <View style={[styles.item, leftStyle]} >
          <Text style={styles.itemTitle}>{item.name}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  public getRecentItem = (item: CityModel, index: number) => {
    const leftStyle = index % 3 === 0 ? null : styles.itemMarginLeft;
    return (
      <TouchableWithoutFeedback onPress={this.onTap.bind(this, item)} key={item.id}>
        <View style={[styles.item, leftStyle]} >
          <Text style={styles.itemTitle} numberOfLines={1}>{item.name}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  public renderHistory = (item: any, keys: string) => {
    const items: any [] = [];
    let line;

    let bottomStyle = null;
    if (keys === 'hot') {
      line =  (<View style={styles.divider}/>) ;
      bottomStyle = styles.itemMarginBottom;
      for (let i = 0; i < item.length; i += 1) {
        items.push(this.getItem(item[i], i));
      }
    } else {
      line = null;
      for (let i = 0; i < item.length; i += 1) {
        items.push(this.getRecentItem(item[i], i));
      }
    }
    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.itemView, bottomStyle]}>
          <View style={styles.items}>
            {items}
          </View>
        </View>
        {line}
      </View>

    );
  }

  public getResultItem = (item: CityModel, index: number) => {

    return (
      <TouchableOpacity key={item.id} onPress={this.onTap.bind(this, item)} >
        <View style={styles.cell} >
          <Text style={styles.celltTitle}>{item.name}</Text>
          <View style={styles.line} />
        </View>
      </TouchableOpacity>
    );
  }

  public renderResultList = (item: any) => {
    const items: any[] = [];
    for (let i = 0; i < item.length; i += 1) {

      items.push(this.getResultItem(item[i], i));
    }
    return (
      <View style={{ flex: 1 }}>
        {items}
      </View>

    );
  }

  public state = {
    isShow: false,
  };

  public generateCityList(arr: CityModel[]) {

    return arr.map((item: CityModel) => {
      const allChar = (item.phoneticize || '').toUpperCase();
      return {
        allChar,
        fristChar: allChar[0],
        data: item,
      };
    })
      .sort((prev: any, next: any) => {
        return prev.allChar.charCodeAt() - next.allChar.charCodeAt();
      })
      .reduce((o: any, item: { data: CityModel, fristChar: string }) => {
        if (!o[item.fristChar]) {
          o[item.fristChar] = [];
        }
        o[item.fristChar].push(item.data);
        return o;
      },      {});
  }

  public renderSectionHeader = (data: any) => {
    return (
      <View style={styles.sectionView} >
        <Text style={styles.sectionTitle} >{data.sectionId}</Text>
      </View >
    );
  }

  public renderSectionItem = (data: any) => {
    return null;
    // (
    //   <View style={{ marginBottom: W(4),  alignItems:'center', justifyContent:'center' }}>
    //     <Text style={{ color:'#333333', maxWidth:W(30), fontSize: F(14) }}>{data.sectionId}</Text>
    //   </View>

    // );
  }
  public renderCell = (data: any) => {
    if (data.item === 0) {
      return this.renderHistoryView();
    }
    if (data.item === 1) {
      return this.renderHotView();
    }
    return (
      <TouchableOpacity onPress={this.onTap.bind(this, data.item)} key={data.item.id}>
        <View style={styles.cell} >
          <Text style={styles.celltTitle}>{data.item.name}</Text>
          <View style={styles.line} />
        </View>
      </TouchableOpacity>
    );
  }

  public renderHistoryView() {
    const { recentVisits } = this.props.homeStore;
    return this.renderHistory(recentVisits, 'history');
  }

  public renderHotView() {
    const { hotCitys } = this.props.homeStore;
    return this.renderHistory(hotCitys, 'hot');
  }
  public hiddenKeybord() {
    Keyboard.dismiss();
  }

  @observable public indexCity: CityModel = { id: -1, name: '未知' };
  @action public updateIndexCity(city: CityModel) {
    this.indexCity = city;
  }

  public render() {
    const { allCitys } = this.props.homeStore;
    const city = this.indexCity; // this.props.geolocationStore.city;
    const onChangeText = (text: string) => {
      if (text.length > 0) {
        this.setState({ isShow: true });
      } else {
        this.setState({ isShow: false });
      }
      this.props.homeStore.keyword = text;
    };

    const data = merge({ 最近访问城市: [0], 热门城市: [1] }, this.generateCityList(allCitys));

    const contentView = (
      <View style={{ flex: 1 }}>
        <Touchable onPress={this.onTap.bind(this, city)}>
          <View style={styles.selectedView}>
            <FastImage 
              source={require('img/homeIcon/positioning.png')} 
              style={styles.pointImage} 
            />
            <Text style={styles.pointName}> {city.name}</Text>
          </View>
        </Touchable>
        <View style={styles.divider} />
        <AlphabetListView
          data={data}
          cell={this.renderCell}
          cellHeight={W(46)}
          hideSectionList={true}
          // sectionListItem={this.renderSectionItem}
          // sectionListStyle={{ alignItems:'center' }}
          sectionHeader={this.renderSectionHeader}
          sectionHeaderHeight={W(35)}
          removeClippedSubviews={false}
        />
      </View>
    );
    const emptyView = (
      <TouchableWithoutFeedback onPress={this.hiddenKeybord}>
        <View style={styles.emptyView}>
          <FastImage source={require('img/emptyResult.png')} style={styles.emptyImage} />
          <Text style={styles.emptyText}>暂未开通您要查找的城市</Text>

        </View>
      </TouchableWithoutFeedback>
    );

    const arr = this.props.homeStore.thinkList;
    const resultList = this.renderResultList(arr);

    const views = () => {
      if (this.state.isShow) {
        return arr.length === 0 ? emptyView : resultList;
      }
      return contentView;
    };

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }} >
        <StatusBar
          hidden={false}
          animated={true}
          barStyle={'dark-content'}
        />
        <View style={styles.header}>
          <TouchableOpacity onPress={this.goBack} style={styles.backBtn}>
            <FastImage source={require('img/homeIcon/delete.png')} style={styles.backImage} />
          </TouchableOpacity>
          <View style={styles.searchView}>
            <FastImage source={require('img/homeIcon/sousuo.png')} style={styles.inputImage} />
            <TextInput
              placeholder={'请输入城市名'}
              style={styles.input}
              onChangeText={onChangeText}
              underlineColorAndroid='transparent'
              returnKeyType='search'
              returnKeyLabel={strings('search')}
            />
          </View>
        </View>

        {views()}
      </View >
    );
  }
}

const styles = StyleSheet.create({

  backImage: {
    height: W(15),
    width: W(15),
    marginRight: W(6),
  },
  header: {
    width: W(375),
    height: W(44) + ifiPhoneX(40, 20, StatusBarHeight),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },

  searchView: {
    width: W(302),
    height: W(33),
    borderRadius: W(17),
    backgroundColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: W(12),
    marginTop: ifiPhoneX(40, 20, StatusBarHeight),
  },

  inputImage: {
    width: W(14),
    height: W(14),
    marginLeft: W(10),
  },
  input: {
    height: W(44),
    width: W(302 - 23),
    marginLeft: W(11),
  },
  continer: {
    flex: 1,
    marginTop: W(44) + ifiPhoneX(40, 20, StatusBarHeight),
    backgroundColor: '#fff',
  },

  selectedView: {
    width: W(375),
    height: W(49),
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pointImage: {
    width: W(14),
    height: W(18),
    marginLeft: W(25),
  },
  pointName: {
    fontSize: F(20),
    fontWeight: '400',
    color: '#111',
    marginLeft: W(9),
  },
  divider: {
    width: W(375),
    height: W(10),
    backgroundColor: '#f2f2f2',
  },
  item: {
    width: W(100),
    height: W(35),
    borderRadius: W(2),
    borderWidth: W(1),
    borderColor: '#D7D7D7',
    justifyContent: 'center',
    marginLeft: W(24),
    marginTop: W(14),

  },
  itemMarginLeft: {
    marginLeft: W(14),
  },
  itemMarginBottom: {
    paddingBottom: W(14),
  },
  itemTitle: {
    fontSize: setFontSize(15),
    fontWeight: '400',
    color: '#111',
    textAlign: 'center',
    alignSelf: 'center',
    width: W(70),
  },
  itemView: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  items: {
    width: W(375),
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  itemViewTitle: {
    fontSize: setFontSize(13),
    fontWeight: '200',
    color: '#999',
    marginTop: W(14),
    marginLeft: W(24),

  },
  sectionView: {
    backgroundColor: '#fff',
    height: W(35),
  },
  sectionTitle: {
    fontSize: setFontSize(15),
    fontWeight: '400',
    color: '#999',
    marginLeft: W(24),
    marginTop: W(10),

  },
  cell: {
    backgroundColor: '#fff',
    height: isiPhone() ? W(50) : W(52),

  },
  celltTitle: {
    fontSize: setFontSize(15),
    fontWeight: '100',
    color: '#111',
    marginLeft: W(24),
    paddingBottom: W(15),
    paddingTop: W(15),

  },
  line: {
    height: isiPhone() && screenHeight < 667 ? W(0.5) : StyleSheet.hairlineWidth,
    marginLeft: W(15),
    marginRight: W(15),
    backgroundColor: 'rgb(215,214,215)',

  },
  backBtn: {
    width: W(44),
    height: W(44),
    justifyContent:
    'center',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  emptyView: {
    width: W(329),
    height: W(412),
    marginLeft: W(23),
    marginTop: W(15),
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyImage: {
    width: W(160),
    alignSelf: 'center',

  },

  emptyText: {
    width: W(160),
    alignSelf: 'center',
    fontSize: F(14),
    fontWeight: '200',
    color: '#0e0e0e',
    marginTop: W(-41),
  },
});
