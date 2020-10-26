/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Colors} from 'App/Theme';
import {Block, Text, Button} from '../../../Components';

export default class SurveyPercentBar extends Component {
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
    const {style, disabled} = this.props;

    return (
      <Button
        style={[{marginVertical: 0, height: null}, style]}
        disabled={disabled}
        onPress={this.onPress}>
        <Block
          flex={false}
          height={35}
          color={Colors.black}
          row
          card
          style={{
            overflow: 'hidden',
            justifyContent: 'space-between',
          }}
          center>
          <Block
            flex={false}
            height={35}
            width={`${selection.rate}%`}
            color={selection ? Colors.primary : Colors.gray9}
            row
            absolute
          />
          <Text color={Colors.white} size={12} style={{flex: 1, marginLeft: 10}}>
            {selection.ansContent}
          </Text>
          <Text color={Colors.white} size={12} style={{marginHorizontal: 10}}>
            {selection.rate}%
          </Text>
        </Block>
      </Button>
    );
  }
}

SurveyPercentBar.defaultProps = {};

SurveyPercentBar.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
};
