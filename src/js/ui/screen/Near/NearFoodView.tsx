
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import {  NavigationScreenProp } from 'react-navigation';

import { F, ifiPhoneX, StatusBarHeight, W } from 'js/helper/UI';

import { Area, Category, Region } from 'js/api';
import { HomeStore } from 'js/store/HomeStore';
import { MerchantListStore } from 'js/store/MerchantListStore';
import { NearStore } from 'js/store/NearStore';
import { QueryParams } from 'js/type/merchant';
import { inject } from 'mobx-react';
import { observer, Observer } from 'mobx-react/native';

interface IProps {
  navigation: NavigationScreenProp<any>;
  store: NearStore | MerchantListStore;
  homeStore: HomeStore;
}

class LeftView extends React.Component<IProps, any> {

  private rightScrollViewRef?: ScrollView;

  constructor(props: IProps) {
    super(props);
    this.props.store.loadCategory(this.props.homeStore.allCategoryArray);
    this.areaLeftItemClick = this.areaLeftItemClick.bind(this);
    this.renderAreaLeft = this.renderAreaLeft.bind(this);
    this.areaRightItemClick = this.areaRightItemClick.bind(this);
    this.renderAreaRight = this.renderAreaRight.bind(this);
    this.setRightScrollViewRef = this.setRightScrollViewRef.bind(this);
  }

  public setRightScrollViewRef = (ref: ScrollView) => {
    this.rightScrollViewRef = ref;
  }

  public areaLeftItemClick = (item: Area, index: number) => {
    this.props.store.setAreaIndex(index);
    (this.rightScrollViewRef as ScrollView).scrollTo({ y:0, animated: true });
  }
  public renderAreaLeft = () => {
    return this.props.store.areaList.map((item: Area, index: number) => {
      const isIndex = this.props.store.areaIndex === index;
      const viewStyle = isIndex ? styles.food_left_view__active : null;
      const textStyle = isIndex ? styles.food_left_text__active : null;
      return (
        <TouchableWithoutFeedback key={item.id} onPress={this.areaLeftItemClick.bind(this, item, index)}>
          <View style={[styles.food_left_view, viewStyle]}>
            <Text style={[styles.food_left_text, textStyle]}>{item.name}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    });
  }

  public areaRightItemClick = (item: Region, index: number) => {
    const id = item.id || -1;
    const params: QueryParams = {
      // cityId: this.props.nearStore.indexArea.cityId,
      regionId: id,
      distance: undefined,
      pageIndex: 0,
    };
    if (id < 0) {
      params.distance = item.areaId;
      params.regionId = undefined;
    }

    this.props.store.setAreaRightItem(item);
    this.props.store.setVisible(false);
    this.props.store.updateMenuLeftText(item.name || '');
    this.props.store.merchant.clearMerchantList();
    this.props.store.merchant.updateQueryParamsAndRequest(params);
  }

  public renderAreaRight = () => {
    return this.props.store.areaSubList.map((item: Region, index: number) => {
      const isIndex = this.props.store.areaRightItem.id === item.id;
      const viewStyle = isIndex ? {
        borderBottomColor: 'red',
      } : null;
      const textStyle = isIndex ? { color: '#FF5A5F' } : null;
      return (
        <TouchableOpacity key={item.id || item.name} onPress={this.areaRightItemClick.bind(this, item, index)}>
          <View style={[styles.food_right_view, viewStyle]}>
            <Text style={[styles.food_right_text, textStyle]}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  }

  public render() {
    console.log('render left view');
    const areaLeftView = (
      <Observer render={this.renderAreaLeft} />
    );
    const areaRightView = (
      <Observer render={this.renderAreaRight} />
    );

    const food_pin_left = { left: 0 };

    return (
      <View style={styles.food_box}>
       <View style={[styles.food_pin, food_pin_left]}>
          <View style={styles.food_pin_img}/>
          {/* <Image style={styles.food_pin_img} source={require('img/near/pin_left.png')} /> */}
        </View>
        <View style={styles.food_view}>
          <View style={styles.food_left}>
            <ScrollView style={styles.food_left_scroll_view}>
            {areaLeftView}
            </ScrollView>

          </View>
          <View style={styles.food_right}>
            <ScrollView style={styles.food_right_scroll_view} ref={this.setRightScrollViewRef}>
            {areaRightView}
            </ScrollView>
          </View>
        </View>
      </View>
    );

  }
}

@inject('homeStore')
@observer
export class NearbyFoodView extends React.Component<IProps, any> {

  private centerRightScrollViewRef?: ScrollView;

  private viewList: JSX.Element[] = [];

  constructor(props: IProps) {
    super(props);
    this.props.store.loadCategory(this.props.homeStore.allCategoryArray);

    this.getCenterView = this.getCenterView.bind(this);
    this.getRightView = this.getRightView.bind(this);

    this.centerLeftItemClick = this.centerLeftItemClick.bind(this);

    this.renderCenterLeft = this.renderCenterLeft.bind(this);
    this.renderCenterRight = this.renderCenterRight.bind(this);
    this.centerRightItemClick = this.centerRightItemClick.bind(this);

    this.setCenterRightScrollViewRef = this.setCenterRightScrollViewRef.bind(this);
    this.onRightItemClick = this.onRightItemClick.bind(this);
  }

  public componentDidMount() {
    // StatusBar.setBarStyle('dark-content');
    this.viewList = [
      // this.getLeftView(),
      // this.getLeftView(),
      // this.getRightView(),
      // <Observer render={this.getLeftView} key={'left'}/>,
      <LeftView {...this.props} key={'left'} />,
      <Observer render={this.getCenterView} key={'center'}/>,
      <Observer render={this.getRightView} key={'right'}/>,
    ];
  }

  public state = {
    visible: true,
  };

  public equestClose = () => {
    this.props.store.setVisible(false);
  }

  public centerLeftItemClick = (item: Category, index: number) => {
    this.props.store.setCenterIndex(index);
    (this.centerRightScrollViewRef as ScrollView).scrollTo({ y:0, animated: true });
  }

  public centerRightItemClick = (item: Category, index: number) => {
    const id = item.id || -1;
    const params: QueryParams = {
      categoryId: item.id,
      pageIndex: 0,
    };
    if (id < 0) {
      params.categoryId  = undefined;
    }
    this.props.store.setCenterRightItem(item);
    this.props.store.setVisible(false);
    this.props.store.updateMenuCenterText(item.name || '');
    this.props.store.merchant.clearMerchantList();
    this.props.store.merchant.updateQueryParamsAndRequest(params);
  }

  public renderCenterRight = () => {
    // tslint:disable-next-line
    return (this.props.store.indexCenterSubList || []).map((item: Category, index: number) => {
      const isIndex = this.props.store.centerRightItem.id === item.id;
      const viewStyle = isIndex ? {
        borderBottomColor: 'red',
      } : null;
      const textStyle = isIndex ? { color: '#FF5A5F' } : null;
      return (
        <TouchableOpacity key={item.id || item.name} onPress={this.centerRightItemClick.bind(this, item, index)}>
          <View style={[styles.food_right_view, viewStyle]}>
            <Text style={[styles.food_right_text, textStyle]}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  }

  public renderCenterLeft = () => {
    return this.props.store.centerList.map((item: Category, index: number) => {
      const isIndex = this.props.store.centerIndex === index;
      const viewStyle = isIndex ? styles.food_left_view__active : null;
      const textStyle = isIndex ? styles.food_left_text__active : null;
      return (
        <TouchableWithoutFeedback
          key={item.id || item.name}
          onPress={this.centerLeftItemClick.bind(this, item, index)}
        >
          <View style={[styles.food_left_view, viewStyle]}>
            <Text style={[styles.food_left_text, textStyle]}>{item.name}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    });
  }

  public setCenterRightScrollViewRef = (ref: ScrollView) => {
    this.centerRightScrollViewRef = ref;
  }

  public onRightItemClick = (item: {name: string, value: string}, index: number) => {
    this.props.store.setRightIndex(index);
    // tslint:disable-next-line
    const params: QueryParams = {
      sortBy: item.value,
      pageIndex: 0,
    };
    this.props.store.setVisible(false);
    this.props.store.updateMenuRightText(item.name || '');
    this.props.store.merchant.clearMerchantList();
    this.props.store.merchant.updateQueryParamsAndRequest(params);
  }

  public getCenterView() {
    const centerLeftView = this.renderCenterLeft();
    const centerRightView = this.renderCenterRight();
    const food_pin_left = { left: 0 };

    return (
      <View style={styles.food_box}>
       <View style={[styles.food_pin, food_pin_left]}>
          <View style={styles.food_pin_img}/>
          {/* <Image style={styles.food_pin_img} source={require('img/near/pin_center.png')} /> */}
        </View>
        <View style={styles.food_view}>
          <View style={styles.food_left}>
            <ScrollView style={styles.food_left_scroll_view}>
            {centerLeftView}
            </ScrollView>

          </View>
          <View style={styles.food_right}>
            <ScrollView style={styles.food_right_scroll_view} ref={this.setCenterRightScrollViewRef}>
            {centerRightView}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }

  public getRightView() {
    const rightRenderView = this.props.store.rightList
      .map((item: {name: string, value: string}, index: number) => {
        const itemStyle = this.props.store.rightIndex === index ? styles.food_cell_item__active : null;
        const textStyle = this.props.store.rightIndex === index ? styles.food_cell_text__active : null;
        return (
          <TouchableOpacity key={item.value} onPress={this.onRightItemClick.bind(this, item, index)}>
            <View style={[styles.food_cell_item, itemStyle]}>
              <Text style={[styles.food_cell_item_text, textStyle]}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        );
      });

    const food_pin_left = { left: 0 };

    return (
      <View style={styles.food_box}>
        <View style={[styles.food_pin, food_pin_left]}>
          <View style={styles.food_pin_img}/>
          {/* <Image style={styles.food_pin_img} source={require('img/near/pin_right.png')} /> */}
        </View>
        <View style={styles.food_view}>
          <View style={styles.food_cell}>
           {rightRenderView}
          </View>
        </View>
      </View>
    );
  }

  public render() {
    const { modalVisible } = this.props.store;
    const SubView = this.viewList[this.props.store.menuIndex];

    const showView = modalVisible ? (
      <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <View style={styles._foodbar} />
        <Modal
          animationType='none'
          transparent={true}
          visible={modalVisible}
          onRequestClose={this.equestClose}

        >
          <View style={styles.food}>
            <TouchableWithoutFeedback onPress={this.equestClose}>
              <View style={styles.food_sub_view} />
            </TouchableWithoutFeedback>
            {SubView}
            <TouchableWithoutFeedback onPress={this.equestClose}>
              <View style={{ width: '100%', flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} />
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </View>
    ) : null;

    return showView;
  }
}

const SBH = ifiPhoneX(40, 20, StatusBarHeight);
const food_sub_view_height = SBH;

const styles = StyleSheet.create({
  _foodbar: {
    width: '100%', height: SBH, backgroundColor: ifiPhoneX('#FFFFFF', '#FFFFFF', 'rgba(0,0,0,0)'),
  },

  food: {
    // position: 'absolute',
    flex: 1,
    // left: 0,
    top: SBH + W(5),
    // width: W(375),
    // width: '100%',
    // maxHeight: W(36),
    backgroundColor: 'rgba(0,0,0,0)',

  },

  food_sub_view: {
    width: '100%',
    height: W(84) + food_sub_view_height,
    backgroundColor: 'rgba(0,0,0,0)',
  },

  food_box: {
    backgroundColor: 'rgba(0,0,0,0)',
    // paddingTop: W(8),
    position: 'relative' ,
    // transform: [{ translateY: -W(8) }],
    // marginTop: -W(8),
  },

  food_view: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    // borderTopWidth: W(1),
    // borderTopColor: '#F0F0F0',
    height: W(360),
    width: W(375),
  },

  food_left_scroll_view: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  food_right_scroll_view: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // food_view_left: {
  //   flexDirection: 'row',
  //   backgroundColor: '#FFFFFF',

  //   borderTopWidth: W(1),
  //   borderTopColor: '#F0F0F0',

  // },
  // food_view: {
  //   flexDirection: 'row',
  //   backgroundColor: '#FFFFFF',

  //   borderTopWidth: W(1),
  //   borderTopColor: '#F0F0F0',

  // },
  // food_view: {
  //   flexDirection: 'row',
  //   backgroundColor: '#FFFFFF',

  //   borderTopWidth: W(1),
  //   borderTopColor: '#F0F0F0',

  // },

  food_pin: {
    position: 'absolute',
    // left: '16.666666%',
    left: 0,
    top: 0,
    zIndex: 9,
    // width: W(10),
    width: '100%',
    height: W(8),
    backgroundColor: 'rgba(0,0,0,0)',
    // transform: [{ rotate:'45deg' }, { translateY: W(5) }],

    // borderLeftWidth: W(1),
    // borderLeftColor: '#F0F0F0',
    // borderTopWidth: W(1),
    // borderTopColor: '#F0F0F0',
  },

  food_pin_img: {

    width: W(375),
    // height: W(8),
    backgroundColor: '#E9E9E9',

    height: StyleSheet.hairlineWidth,

  },

  food_left: {
    flex: 1,
    borderLeftColor: '#F0F0F0',
  },
  food_left_view: {
    height: W(50),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: W(23),
    backgroundColor: '#F0F0F0',

  },
  food_left_view__active: {
    backgroundColor: '#FFFFFF',
  },
  food_left_text: {
    maxWidth: W(140),
    color: '#323232',
    fontSize: F(15),
  },
  food_left_text__active: {
    color: '#FF5A5F',
    fontWeight: '500',
  },

  food_right: {
    flex: 1,
    paddingLeft: W(16),
  },
  food_right_view: {
    height: W(50),
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#E9E9E9',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  food_right_text: {
    color: '#323232',
    fontSize: F(15),
  },

  food_cell: {
    paddingLeft: W(24),
    paddingRight: W(24),
    flex: 1,
  },
  food_cell_item: {
    height: W(44),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#E9E9E9',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  food_cell_item__active: {
    borderBottomColor: '#FF5A5F',
  },

  food_cell_item_text: {
    color: '#323232',
    fontSize: F(15),
  },

  food_cell_text__active: {
    color: '#FF5A5F',
    fontWeight: '500',
  },
});
