/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Colors} from 'App/Theme';
import {Image} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Block, Text, Button} from '../../../Components';

export default class SurveyImageItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: {},
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {selection} = nextProps;
    if (selection != prevState.selection) {
      return {selection};
    }

    return null;
  }

  onPress = () => {
    const {selection} = this.state;
    selection.userSelected = true;
    this.setState({selection});
    this.props.onPress(selection.ansId);
  }

  render() {
    const {selection} = this.state;
    const {imageWidth, mainColor, disabled, ...props} = this.props;

    return (
      <Button
        style={{marginVertical: 0, height: null, justifyContent: 'flex-start'}}
        disabled={disabled}
        onPress={this.onPress}>
        <Block
          flex={false}
          width={imageWidth}
          border
          card
          {...props}>
          {selection.ansImage ? (
            <Image
              style={{
                width: imageWidth,
                height: (imageWidth * 3) / 5,
                borderRadius: 5,
              }}
              source={{ uri: selection.image.uri }}
            />
          ) : (
            <Block
              color={'#8E8E8E'}
              middle
              height={(imageWidth * 3) / 5}
              center
              card>
              <MaterialIcons
                name={'image'}
                size={47}
                color={Colors.white}
              />
            </Block>
          )}
          <Block
            style={{
              justifyContent: 'space-between',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            absolute>
            <Block
              flex={false}
              row
              right
              margin={[5, 5, 0, 0]}>
              <Text color={Colors.white} style={{ backgroundColor: Colors.primary, paddingHorizontal: 5 }}>
                {selection.rate || 0}%
            </Text>
            </Block>
          </Block>
          <Block padding={[2, 0, 2, 0]} center>
            <Text color={mainColor}>
              {selection.ansContent}
            </Text>
          </Block>
        </Block>
      </Button>
    );
  }
}

SurveyImageItem.defaultProps = {};

SurveyImageItem.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
};
