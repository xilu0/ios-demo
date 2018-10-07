import { F,  ifiPhoneX, StatusBarHeight, W } from 'js/helper/UI';
import React from 'react';
import { NavigationScreenProp } from 'react-navigation';

import { Body15, Keyword } from 'js/api';
import { NavigationKeys } from 'js/const/NavigationKeys';
import { strings } from 'js/helper/I18n';
import { navigate } from 'js/helper/navigate';
import { getStore } from 'js/helper/Store';
import { SearchStore } from 'js/store/SearchStore';
import { QueryParams } from 'js/type/merchant';
import { Touchable } from 'js/ui/components/Touchable';
import { inject, observer } from 'mobx-react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';


interface IProps {
  navigation: NavigationScreenProp<IProps>;
  searchStore: SearchStore;
}

const getQeuryParams = (item: Keyword) => {
  const queryParams: QueryParams = new QueryParams({
    keyword: item.name,
  });
  if (item.type === Keyword.TypeEnum.Category) {
    queryParams.keyword = undefined;
    queryParams.categoryId = +(item.id || '-1');
  } else if (item.type === Keyword.TypeEnum.Region) {
    queryParams.keyword = undefined;
    queryParams.regionId = +(item.id || '-1');
  } else if (item.type === Keyword.TypeEnum.Dish) {
    queryParams.keyword = undefined;
    queryParams.regionId = +(item.id || '-1');
  }
  return queryParams;

};

@inject('searchStore')
@observer
class SearchPanel extends React.Component<IProps, any> {

  private getHistory() {
    const list = this.props.searchStore.keywordHistoryList.slice();
    const onClick = (item: Keyword) => {
      this.props.searchStore.addKeywordHistory(item);
      const { merchantListStore: store } = getStore();
      const queryParams = getQeuryParams(item);
      store.resetMenuQueryStatus(queryParams);
    this.props.navigation.navigate(NavigationKeys.MerchantList,{name:item.name});
    };
    return list.map((item: Keyword, index: number) => {
      return (
        <TouchableOpacity key={item.id || item.name} onPress={onClick.bind(this, item)}>
          <View style={styles.panel_wrap_line_view} >
            <FastImage style={styles.panel_item__line_icon} source={require('img/homeIcon/clock.png')} />
            <Text style={styles.panel_item__line_text}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  }

  public componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      this.props.searchStore.clearKeyword();
    });
    this.props.searchStore.requestGetHotSearchTips();
  }

  public render() {
    const historyList = this.getHistory();
    const clearHistory = () => this.props.searchStore.clearKeywordHistory();

    const historyView = historyList.length > 0 ? (
      <View style={styles.panel}>
          <Text style={styles.panel_title}>历史搜索</Text>
          <View style={styles.panel_wrap_line}>
            {historyList}
          </View>
          <Touchable onPress={clearHistory} underlayColor={'rgba(0,0,0,0)'}>
            <View style={styles.panel_clear}>
              <Text style={styles.panel_clear_text}>清除搜索历史</Text>
            </View>
          </Touchable>
        </View>
    ) :  (
    <View style={styles.panel}>
        <Text style={styles.panel_title}>历史搜索</Text>
    </View>);
    const hotKeywords = this.props.searchStore.hotKeywords.slice();

    const onHotKeywordClick = (item: Keyword) => {
      this.props.searchStore.addKeywordHistory({
        name: item.name,
      });
      const { merchantListStore: store } = getStore();
      const queryParams = getQeuryParams(item);
      store.resetMenuQueryStatus(queryParams);
     this.props.navigation.navigate(NavigationKeys.MerchantList,{name:item.name});
    };
    const hotKeyWordsView = hotKeywords.map((item: Keyword, index: number) => {
      return (
        <Text
          onPress={onHotKeywordClick.bind(this, item)}
          key={item.id}
          style={styles.panel_item}
        >{item.name}
        </Text>
      );
    });

    return (
      <ScrollView keyboardShouldPersistTaps='always'>
        <View style={styles.panel}>
          <Text style={styles.panel_title}>热门搜索</Text>
          <View style={styles.panel_wrap}>
            {hotKeyWordsView}
          </View>
        </View>

        {historyView}
      </ScrollView>

    );
  }
}

@inject('searchStore')
@observer
class SearchLenovoPanel extends React.Component<IProps> {

  private getMerchantView(item: Keyword) {
    const ext = item.ext ||  {
      categoryName: '',
      address: '',
      dishName: null,
      isApproveDiscount: null,
      hasCoupon: null,
      distance: 0,
    };

    // styles.heightColor
    return (
      <Touchable key={item.id} underlayColor={'rgba(0,0,0,0)'} onPress={this.onMerchantItemClick.bind(this, item)}>
        <View style={[styles.lenovo_item, styles.lenovo_item_store]}>
          <View style={styles.lenovo_item_store_line}>
            <Image style={styles.lenovo_icon_store} source={require('img/search/history.png')} />
            <Text style={[styles.lenovo_text_store, null]} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.lenovo_m_store} numberOfLines={1}>{ext.distance}km</Text>
          </View>
          <View style={[styles.lenovo_item_store_line]}>
            <Text style={styles.lenovo_content_store}  numberOfLines={1}>{ext.categoryName}|{ext.address}</Text>
          </View>
        </View>
      </Touchable>
    );
  }

  private getCategoryView(item: Keyword) {

    return (
      <Touchable key={item.id} underlayColor={'rgba(0,0,0,0)'} onPress={this.onItemClick.bind(this, item)}>
        <View style={[styles.lenovo_item, styles.lenovo_item_address]}>
          <Image style={styles.lenovo_icon_search} source={require('img/search/search.png')} />
          <Text style={[styles.lenovo_text_address, null]} numberOfLines={1}>{item.name}</Text>
        </View>
      </Touchable>
    );
  }

  private getRegionView(item: Keyword) {

    return (
      <Touchable key={item.id} underlayColor={'rgba(0,0,0,0)'} onPress={this.onItemClick.bind(this, item)}>
        <View style={[styles.lenovo_item, styles.lenovo_item_address]}>
          <Image style={styles.lenovo_icon_address} source={require('img/search/Scoordinates.png')} />
          <Text style={[styles.lenovo_text_address, null]} numberOfLines={1}>{item.name}</Text>
        </View>
      </Touchable>
    );
  }

  private getViewByType(type: Keyword.TypeEnum) {
    const viewDir: any = {
      [Keyword.TypeEnum.Merchant]: this.getMerchantView.bind(this),
      [Keyword.TypeEnum.Category]: this.getCategoryView.bind(this),
      [Keyword.TypeEnum.Region]: this.getRegionView.bind(this),
      [Keyword.TypeEnum.Dish]: this.getMerchantView.bind(this),
      [Keyword.TypeEnum.Area]: this.getCategoryView.bind(this),
    };
    return viewDir[type];
  }

  private onItemClick(item: Keyword) {
    this.props.searchStore.addKeywordHistory(item);
    const { merchantListStore: store } = getStore();
    const queryParams = getQeuryParams(item);
    store.resetMenuQueryStatus(queryParams);
    this.props.navigation.navigate(NavigationKeys.MerchantList,{name:item.name});
  }

  private onMerchantItemClick(item: Keyword) {
    navigate(NavigationKeys.MerchantDetail, { merchantId: item.id });
  }

  public getItemView(item: Keyword) {
    return this.getViewByType(item.type || Keyword.TypeEnum.Category)(item);
  }

  public getDefaultView() {
    const item = {
      id: -1,
      name: this.props.searchStore.keyword,
      keyword: this.props.searchStore.keyword,
      keywordType: Body15.KeywordTypeEnum.Default,
    };
    return (
      <Touchable key={item.id} underlayColor={'rgba(0,0,0,0)'} onPress={this.onItemClick.bind(this, item)}>
        <View style={[styles.lenovo_item, styles.lenovo_item_address]}>
          <Image style={styles.lenovo_icon_search} source={require('img/search/search.png')} />
          <Text style={[styles.lenovo_text_store, null]} numberOfLines={1}>搜索"{item.name}"</Text>
        </View>
      </Touchable>
    );
  }

  public render() {

    const list = this.props.searchStore.keywordResults.slice();

    const listView = list.map((item: Keyword, index: number) => {
      return this.getItemView(item);
    });

    listView.unshift(this.getDefaultView());

    return (
      <ScrollView keyboardShouldPersistTaps='always'>
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <View style={styles.lenovo}>
            {listView}
          </View>
        </View>
      </ScrollView>
    );
  }
}

@inject('searchStore')
@observer
export class Search extends React.Component<IProps, any> {
  private input?: TextInput  ;

  private inputThrottling: number = 0;
  private inputThrottDelayTime: number = 0;
  private _timerCancel: number = 0;

  public state = {
    text: '',
    text2: '',
  };

  constructor(props: IProps) {
    super(props);
    this.setInputRef = this.setInputRef.bind(this);
    this.onBackClick = this.onBackClick.bind(this);

    this.onCancelClick = this.onCancelClick.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onSubmitEditing = this.onSubmitEditing.bind(this);
  }

  public componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      this.setState({
        text: '',
        text2: '',
      });
      StatusBar.setBarStyle('dark-content');
      (this.input as TextInput).focus();
    });
  }

  public componentWillUnmount() {
    if (this.inputThrottling !== 0) {
      clearTimeout(this.inputThrottling);
    }
    if (this.inputThrottling !== 0) {
      clearTimeout(this.inputThrottling);
    }
    if (this._timerCancel !== 0) {
      clearTimeout(this._timerCancel);
    }
  }

  public setInputRef = (c: TextInput) => {
    this.input = c;
  }

  public onBackClick = () => {
    this.onCancelClick();
    this.props.navigation.pop();
  }

  public onCancelClick = () => {
    this.props.searchStore.clearKeyword();
    this.setState({ text: this.state.text2 });
    this._timerCancel = setTimeout(() => {
      this.setState({ text: '' });
    });
  }

  public onChangeText = (text: string) => {
    if (this.inputThrottling !== 0) {
      clearTimeout(this.inputThrottling);
    }
    this.setState({
      text2: text,
    });
    if (Platform.OS === 'android') {
      this.setState({
        text,
      });
    }
    this.inputThrottling = setTimeout(() => {
      this.props.searchStore.setKeyWord(text);
      this.inputThrottling = 0;
    },                                this.inputThrottDelayTime);

  }

  public onBlur = () => this.setState({ text: this.state.text2 });

  public onSubmitEditing = () => {
    const keyword = this.props.searchStore.keyword;
    this.props.searchStore.addKeywordHistory({
      name: keyword,
    });
    const { merchantListStore: store } = getStore();
    store.resetMenuQueryStatus(new QueryParams({
      keyword,
      keywordType: Body15.KeywordTypeEnum.Default,
    }));
    this.props.navigation.navigate(NavigationKeys.MerchantList,{name:keyword});
    this.setState({
      text: '',
      text2: '',
    });

  }

  public render() {

    const search_img =  this.props.searchStore.valid ?
      require('img/search/search1.png') : require('img/search/search.png');
    const search_cancel = require('img/search/search_cancel.png');

    const PanelView = this.props.searchStore.valid ? SearchLenovoPanel : SearchPanel;

    const showClearIcon = this.props.searchStore.valid ? (
      <TouchableWithoutFeedback onPress={this.onCancelClick}>
        <FastImage source={search_cancel} style={styles.input_icon_cancel}/>
      </TouchableWithoutFeedback>
    ) : null;

    return (
      <View style={{ flex: 1, backgroundColor:'#FFFFFF' }}>
        <View style={styles.header}>
          <FastImage source={search_img} style={styles.input_icon_search}/>
          {showClearIcon}
          <TextInput
            ref={this.setInputRef}
            style={styles.input}
            placeholder='搜索 菜品 店铺 分类'
            placeholderTextColor='#92969C'
            underlineColorAndroid='transparent'

            onChangeText={this.onChangeText}
            returnKeyType='search'
            returnKeyLabel={strings('search')}
            keyboardType='web-search'

            autoCorrect={false}
            // defaultValue={this.state.clearInput ? '' : this.state.searchInput}
            value={this.state.text}
            enablesReturnKeyAutomatically={true}
            // onEndEditing={(evt) => this.props.searchStore.setKeyWord(evt.nativeEvent.text)}
            //   }); // 当内容改变时执行该方法
            // }}
            onSubmitEditing={this.onSubmitEditing}
            // secureTextEntry
            //   onFocus={() =>console.log('onFocus')} //选中文本框
            onBlur={this.onBlur}// 离开文本框
            //  onChange={() =>console.log('onChange')}//文本框内容变化
            //  onChangeText={(text) =>console.log(text)}//文本框内容变化，变化的内容
            //  onEndEditing={() =>console.log('onEndEditing')}//文本框编译结束
            //   onSubmitEditing={() =>console.log('onSubmitEditing')}//按下回车键
            autoFocus={true}
            // defaultValue={this.props.searchStore.keyword}
            // autoCorrect={false}
            // editable={false}
          />
          <Text onPress={this.onBackClick} style={styles.input_cancel}>取消</Text>
        </View>

        <PanelView {...this.props} />

      </View>
    );
  }

}

const SBH = ifiPhoneX(40, 20, StatusBarHeight);

const styles = StyleSheet.create({
  header:{
    backgroundColor: '#FFFFFF',
    height: W(44) + SBH,
    paddingTop: SBH,
    paddingLeft: W(23),
    paddingRight: W(6),
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // zIndex: 3,
    // borderBottomColor: '#E6E6E6',
    // borderBottomWidth: StyleSheet.hairlineWidth,

    flexDirection: 'row',
    alignItems: 'center',

  },

  input: {
    width: W(280),
    height: W(33),
    backgroundColor: '#F0F0F0',
    borderRadius: W(17),
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: W(35),

    color: '#333333',
    fontSize: F(13),

  },

  input_icon_search: {
    position: 'absolute',
    width: W(14),
    height: W(14),
    left: W(23 + 10),
    top: W(10 + 6) + SBH,
    // bottom: W(10),
    zIndex: 5,

  },

  input_icon_cancel: {
    position: 'absolute',
    width: W(16),
    height: W(16),
    right: W(81),
    top: W(9 + 6) + SBH,
    // bottom: W(10),
    zIndex: 5,

  },

  input_cancel: {
    flex: 1,
    color: '#111111',
    fontSize: F(16),
    textAlign: 'center',
  },

  panel: {
    paddingLeft: W(24),
    backgroundColor: '#FFFFFF',
  },
  panel_title: {
    color: '#999999',
    fontSize: F(15),
    paddingTop: W(17),
    paddingBottom: W(17),
  },
  panel_wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  panel_item: {
    color: '#111111',
    backgroundColor: '#F2F2F2',
    fontSize: F(14),
    height: W(30),
    lineHeight: F(30),
    alignSelf: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: W(12),
    paddingRight: W(12),
    borderRadius: W(15),
    marginTop: W(12),
    marginRight: W(12),
    overflow: 'hidden',
  },

  panel_wrap_line: {
    paddingRight: W(24),
  },

  panel_wrap_line_view: {
    height: W(44),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D7D7D7',
    flexDirection: 'row',
    alignItems: 'center',
  },

  panel_item__line_icon: {
    width: W(14),
    height: W(14),
    marginRight: W(8),
  },

  panel_item__line_text: {
    color: '#111111',
    fontSize: F(15),

  },

  panel_clear: {
    height: W(44),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D7D7D7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panel_clear_text: {
    color: '#FF3939',
    fontSize: F(12),
  },

  lenovo: {
    flex: 1,
    // flexDirection: '',
    paddingLeft: W(24),
    paddingRight: W(24),
  },
  lenovo_item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D7D7D7',
  },

  lenovo_item_address: {
    height: W(44),
    flexDirection: 'row',
    alignItems: 'center',
  },
  lenovo_text_address: {
    color: '#111111',
    fontSize: F(15),
    maxWidth: W(300),
  },
  lenovo_icon_address: {
    width: W(11),
    height: W(15),
    marginRight: W(12),
    marginTop: W(1),
    resizeMode:'stretch',
  },

  lenovo_icon_search: {
    width: W(12),
    height: W(12),
    marginRight: W(11),
    marginTop: W(1),
  },

  lenovo_item_store: {
    flex: 1,
    height: W(66),
    paddingTop: W(8),
    paddingBottom: W(8),
  },
  lenovo_item_store_line: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  lenovo_icon_store: {
    width: W(15),
    height: W(13),
    marginRight: W(8),
    marginTop: W(1),
  },
  lenovo_text_store: {
    color: '#333333',
    fontSize: F(15),
    width: W(260),
  },
  lenovo_m_store: {
    color: '#999999',
    fontSize: F(12),
    position: 'absolute',
    right: 0,
  },
  lenovo_content_store: {
    width: W(300),
    color: '#999999',
    fontSize: F(13),
    marginLeft: W(20),
  },

  heightColor: {
    color: '#FF6633',
  },

});
