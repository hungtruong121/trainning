import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Video from 'react-native-video';
import {StyleSheet, View, Image} from 'react-native';
import {Colors} from '../Theme';
import Icon from 'react-native-vector-icons/Entypo';

export default class Media extends Component {
  constructor(props) {
    super(props);
    this.state = {
      circleSize: 74,
    };
  }

  render() {
    const {circleSize} = this.state;
    const {style, type} = this.props;

    if (type && type.includes('video')) {
      return (
        <Video
          muted={true}
          {...this.props}
        />
      );
    } else if (type && type.includes('image_temp')) {
      return (
        <View
          style={style}
          onLayout={(event) =>
            this.setState({circleSize: event.nativeEvent.layout.height / 3})
          }>
          <Image {...this.props} />
          <View style={styles.videoTemp}>
            <View
              style={[
                styles.circle,
                {
                  width: circleSize,
                  height: circleSize,
                  borderRadius: circleSize / 2,
                },
              ]}>
              <Icon
                name={'triangle-right'}
                size={circleSize - 5}
                color={'white'}
              />
            </View>
          </View>
        </View>
      );
    }

    return <Image {...this.props} />;
  }
}

Media.propTypes = {
  type: PropTypes.string,
};

const styles = StyleSheet.create({
  videoTemp: {
    backgroundColor: Colors.opacity,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: '#3A3A3A',
    justifyContent: 'center',
    alignItems: 'center',
    width: 74,
    height: 74,
    borderRadius: 74 / 2,
  },
});
