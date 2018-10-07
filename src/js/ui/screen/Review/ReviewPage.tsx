import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Swiper from 'react-native-swiper';
import Video from 'react-native-video';

export class ReviewPage extends React.Component<any> {
  public onIndexChanged = (index: number) => {
    // console.warn(index);
  }
  public render() {
    return (
      <View style={{ flex : 1 }}>
        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          horizontal={false}
          loop={false}
          showsPagination={false}
          onIndexChanged={this.onIndexChanged}
        >
          <View style={styles.slide1}>
          <Video
            source={{ uri: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4' }}
            style={styles.backgroundVideo}
            repeat={true}
          />
          </View>
          <View style={styles.slide2}>
            <Text style={styles.text}>Beautiful</Text>
          </View>
          <View style={styles.slide3}>
            <Text style={styles.text}>And simple</Text>
          </View>
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },

  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
