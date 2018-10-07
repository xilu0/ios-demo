
import { F, W } from 'js/helper/UI';
import { appHeader } from 'js/ui/components/Navigation';
import _ from 'lodash';
import { observer } from 'mobx-react/native';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
interface IRules {
  title: string;
  index: number;
  content: string;
}
interface IProps {
  navigation: NavigationScreenProp<any, any>;
  rules: IRules[];
}
@appHeader('', {
  headerStyle: {
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderBottomColor: '#d8d8d8',
    backgroundColor: '#fff',
  },
})
@observer
export class IntegralRule extends React.Component<IProps, any> {
  public static defaultProps = {
    rules: [{
      title:'什么是积分? ',
      content:'积分是爱享到APP专属的一种虚拟货币，它能在客户端的积分商城中兑换商品。',
      index:1,
    }, {
      title:'积分可以干什么? ',
      content:'您获得的积分可以在积分商城中兑换各种超值服务，包括商品或服务。',
      index:2,
    }, {
      title:'如何获得积分？',
      content:'每日登陆可获取10积分；购买平台消费券获取等额积分；到店消费，使用平台优惠买单获取等额积分；将消费体验通过小视频分享点评获取50~150积分不等。',
      index:3,
    }, {
      title:'积分反作弊规则？',
      content:'为了保证所有用户的正当权益，我们会严厉打击违规行为。对于恶意盗刷积分的行为，我们将对作弊者进行积分清零及封禁处理。',
      index:4,
    }],
  };
  public renderRuleDetails = (item: IRules) => {
    let ele;
    if (item.index === 3) {
      const contents = item.content.split('；');
      ele = contents.map((ob: string, i: number) => {
        return ( 
          <Text key={i} style={[styles.fs_14, styles.w_345]}>
            {ob + ((contents.length === i + 1) ?  '' : '；')}
          </Text>
        );
      });
    } else {
      ele = <Text style={[styles.fs_14, styles.w_345]}>{item.content}</Text>;
    }
    return ele;
  }
  public renderItem = (o: {item: IRules}) => {
    return (
      <View style={styles.pv_10}>
        <Text style={styles.titleText}>{o.item.index}.{o.item.title}</Text>
        <View style={styles.contentText}>
          {this.renderRuleDetails(o.item)}
        </View>
      </View>
    );
  }
  public setUniq = () => _.uniqueId();
  public render = () => {
    const props = this.props;
    const rules = props.rules;
    return (
      <View style={styles.container}>
        <View style={styles.plusTitle}>
          <Text style={styles.headerTitle}>积分规则</Text>
        </View>
        <View style={styles.middleView}>
          <FlatList
            renderItem={this.renderItem}
            data={rules}
            keyExtractor={this.setUniq}
            onEndReachedThreshold={0.5}
          />
          <Text style={styles.decText}>以上信息的最终解释权归爱享到所有</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff',
  },
  plusTitle:{
    paddingLeft: W(15),
    paddingTop: W(17),
    paddingBottom: W(18),
    backgroundColor:'#FFF',
  },
  headerTitle:{
    fontSize: F(22),
    color: '#333',
    fontWeight: 'bold',
  },
  middleView:{
    marginHorizontal:W(15),
  },
  pv_10:{
    paddingVertical: W(10),
  },
  titleText:{
    fontSize:F(16),
    fontWeight:'bold',
    color:'#333',
    marginBottom:W(6),
  },
  contentText:{
    paddingLeft: W(12),
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  item:{
    paddingHorizontal:  W(24),
    paddingVertical: W(10),
    justifyContent: 'space-between',
  },
  fs_14:{
    fontSize:F(14),
    color:'#333',
    lineHeight:W(20),
  },
  decText:{
    marginTop:W(20),
    fontSize:F(14),
    color:'#333',
    fontWeight: 'bold',
  },
  w_345:{
    width:W(330),
  },
});
