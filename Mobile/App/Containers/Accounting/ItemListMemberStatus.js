import React from 'react';
import {StyleSheet, Image, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import {Block, Text, Button} from 'App/Components';
const {width} = Dimensions.get('window');
import {Colors, Images} from '../../Theme';
import {strings} from '../../Locate/I18n';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default class ItemListMemberStatus extends React.Component {
  render() {
    const {tab, name, onPress, onRedirect, onShowBill, avatar} = this.props;

    return (
      <Block row style={Style.parentView}>
        <TouchableOpacity onPress={() => onRedirect && onRedirect()}>
          <Image
            source={avatar}
            style={{
              width: 64,
              height: 64,
              marginRight: 10,
              borderRadius: 45,
            }}
          />
        </TouchableOpacity>

        <Block colum>
          <Text size={13.5}>{name}</Text>
          {tab == strings('not_paid') ? (
            <Button
              color={Colors.white}
              style={Style.button}
              onPress={() => onPress && onPress()}>
              <Text size={11}>Remind</Text>
            </Button>
          ) : null}
          {tab == strings('waiting') ? (
            <Block row>
              <Button
                color={Colors.white}
                style={[Style.button, {width: width / 8, marginRight: 10}]}
                onPress={() => onShowBill && onShowBill()}>
                <Image
                  source={Images.iconBill}
                  style={{resizeMode: 'center'}}
                />
              </Button>
              <Button
                color={Colors.white}
                style={Style.button}
                onPress={() => onPress && onPress()}>
                <Text size={11}>Confirm</Text>
              </Button>
            </Block>
          ) : null}
        </Block>
      </Block>
    );
  }
}

ItemListMemberStatus.propTypes = {
  amount: PropTypes.number,
  deadline: PropTypes.any,
};
const Style = StyleSheet.create({
  parentView: {
    height: width / 4.5,
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: Colors.black,
    height: 27,
    width: width / 5,
    alignItems: 'center',
  },
});
