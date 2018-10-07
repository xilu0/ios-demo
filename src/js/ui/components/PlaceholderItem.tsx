import React from 'react';
import { StyleSheet , View, ViewStyle } from 'react-native';
import { W } from '../../helper/UI';

export enum ContentMode {
  BottomLine = 3, RightLine = 2, noneLine = 1,
}
interface IProps {
  type: number;
  viewStyle?: ViewStyle;
  topviewStyle?: ViewStyle;

}

export class PlaceholderItem extends React.Component<IProps, any> {
  public render() {

    let noneView ;
    if (this.props.type === 0) {
      noneView = <View style={this.props.viewStyle}/>;
    } else if (this.props.type === 1) {
      noneView = <RightLineView/> ;
    } else {
      noneView = <BottomLineView topView={this.props.topviewStyle!} contentStyle={this.props.viewStyle}/>;
    }

    return (
        noneView
    );
  }
}
const styles = StyleSheet.create({
  container:{
    width:W(158),
    height:W(160),
  },
  topView:{
    width:W(158),
    height:W(106),
    backgroundColor:'#F4F4F4',
  },
  line:{
    marginLeft: 0,
    marginRight: 0,
    height:W(15),
    marginTop: W(4),
    backgroundColor:'#F4F4F4',
  },
  shortLine:{
    width:W(60),
    height:W(15),
    marginTop: W(4),
    backgroundColor:'#F4F4F4',
  },

  content:{
    flexDirection: 'row',
    width:W(375),
    height:W(123),
  },
  lefeView:{
    width:W(140),
    height:W(93),
    marginLeft: W(24),
    marginTop: W(15),
    backgroundColor:'#F4F4F4',
  },
  rightView:{
    marginTop: W(15),
    marginLeft: W(16),
  },
  rightLine:{
    width:W(200),
    height:W(15),
    marginTop: W(10),
  },
});

class BottomLineView extends React.Component <{
  contentStyle?: ViewStyle,
  topView?: ViewStyle,

}> {
  public render () {
    const style = this.props.contentStyle! ? this.props.contentStyle : styles.container;
    return(
    <View style={style}>
      <View style={[styles.topView, this.props.topView]}/>
      <View style={styles.line}/>
      <View style={styles.shortLine}/>
      </View>

    );
  }
}

class RightLineView extends React.Component {
  public render () {
    return(
    <View style={styles.content}>
      <View style={styles.lefeView}/>
      <View style={styles.rightView}>
      <View style={styles.line}/>
      <View style={styles.line}/>
      <View style={styles.line}/>
      <View style={styles.shortLine}/>
      </View>
      </View>

    );
  }
}
