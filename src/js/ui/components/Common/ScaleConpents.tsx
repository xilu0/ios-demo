import React from 'react';
import {  TouchableWithoutFeedback, Animated} from 'react-native';


export class ScaleConpents extends React.Component <{
  onPress:()=>void,
}, any> {

  constructor(props:any){
    super(props);
    this.state={
      scaleAnima :new Animated.Value(1),
    }
  }

  startAnimation =()=>{
    Animated.timing(
      this.state.scaleAnima,
      {
        toValue:0.95,
        duration:300,
      }
    ).start();
   }

   endAnimation =()=>{
    Animated.timing(
      this.state.scaleAnima,
      {
        toValue:1,
        duration:300,
      }
    ).start();
   }

  onPressIn=()=>{
    this.startAnimation();
  }

    onPressOut=()=>{
      this.endAnimation();
  }

  render(){
    return(
      <TouchableWithoutFeedback onPress={this.props.onPress} onPressIn={this.onPressIn} onPressOut={this.onPressOut}>
          <Animated.View style={{transform:[{scale:this.state.scaleAnima}]}}>
            {this.props.children}
          </Animated.View>
        </TouchableWithoutFeedback>
    );
  }
}