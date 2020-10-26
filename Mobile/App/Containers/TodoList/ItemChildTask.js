/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Image, Dimensions, ImageBackground} from 'react-native';
import PropTypes from 'prop-types';
import {Block, Text} from 'App/Components';
const {width} = Dimensions.get('window');
import {Colors, ApplicationStyles, Images} from '../../Theme';
import {Constants} from '../../Utils/constants';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {CheckBox, Progress} from '../../Components';

export default class ItemChildTask extends React.Component {
  render() {
    const {title, assigned, deadline, progress, onPress} = this.props;

    return (
      <Block flex={false} row style={Style.item}>
        <Block column flex={false} style={{width: '100%'}}>
          <TouchableOpacity
            onPress={() => onPress && onPress()}
            style={{
              height: '100%',
              justifyContent: 'space-around',
              paddingBottom: 10,
            }}>
            <Block row flex={false} space={'between'}>
              <Text size={13.5} style={{...ApplicationStyles.fontMPLUS1pBold}}>
                {title}
              </Text>
              {progress === 100 ? (
                <Image
                  source={Images.iconCheckGreen}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
              ) : null}
            </Block>
            <Block flex={false} row>
              <Text size={12.5}>Assigned: </Text>
              <Text size={12.5}>{assigned}</Text>
            </Block>
            <Block flex={false} row>
              <Text size={12.5}>Deadline: </Text>
              <Text color={Colors.primary} size={12.5}>
                {deadline}
              </Text>
            </Block>
            <Block flex={false} row>
              <Text size={12.5}>General progress: </Text>
              <Text size={12.5}>{progress}%</Text>
            </Block>
            <Block flex={false}>
              <Progress
                type="bar"
                progress={progress > 0 ? progress / 100 : 0.1 / 100}
              />
            </Block>
          </TouchableOpacity>
        </Block>
      </Block>
    );
  }
}

ItemChildTask.propTypes = {
  amount: PropTypes.string,
  deadline: PropTypes.any,
};
const Style = StyleSheet.create({
  item: {
    borderRadius: 5,
    height: width / 2.5,
    width: '100%',
    marginTop: 10,
    backgroundColor: Colors.white,
    paddingBottom: 10,
    paddingTop: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  itemLeft: {
    margin: 10,
  },
  itemRight: {
    height: '100%',
    width: width / 3.5,
    alignItems: 'center',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
});
