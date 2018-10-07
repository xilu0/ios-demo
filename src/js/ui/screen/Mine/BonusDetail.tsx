import { PointsDetail } from 'js/api';
import { F, W } from 'js/helper/UI';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {
  detail: PointsDetail;
  pointsType?: number;
}

interface IBody {
  title: string;
  point: number;
  createTime: Date;
}

const gennerateItem = (detail: PointsDetail, _status?: number): IBody => {
  const title = detail.title || '';
  const point = detail.point || 0;
  const createTime = detail.createTime || new Date();

  const o: IBody = {
    createTime,
    title,
    point,
  };
  return o;
};

export class BonusPointBody extends React.Component<IProps, {}> {
  public isPositiveNum = (num: number) => {
    return Math.sign(num) === 1;
  }

  public render() {

    const item = gennerateItem(this.props.detail, this.props.pointsType);
    return (
      <View style={styles.container}>
        <View>
          <Text style={[styles.f_14, styles.c_333]}>{item.title}</Text>
        </View>
        <View style={styles.mt_5}>
          <Text style={[styles.c_666, styles.f_12]}>{item.createTime}</Text>
        </View>
        <View style={[styles.point]}>
          <Text style={[styles.c_333, styles.f_14]}>
          {this.isPositiveNum(item.point) ? `+${item.point}` : item.point}
        </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: W(5),
    paddingTop: W(25),
    paddingHorizontal:W(22),
  },
  mt_5:{
    marginTop: W(5),
  },
  f_14:{
    fontSize: F(14),
  },
  f_12:{
    fontSize: F(12),
  },
  point:{
    position:'absolute',
    right:15,
    top:30,
  },
  c_666:{
    color:'#666',
  },
  c_333:{
    color:'#333',
  },
});
