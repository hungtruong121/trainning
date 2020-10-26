import React from 'react';
import {StyleSheet, Image, Dimensions, ImageBackground} from 'react-native';
import PropTypes from 'prop-types';
import {Block, Text} from 'App/Components';
const {width} = Dimensions.get('window');
import {Colors, ApplicationStyles, Images} from '../../Theme';
import {Constants} from '../../Utils/constants';
import {strings} from '../../Locate/I18n';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default class ItemDetailPayment extends React.Component {
  render() {
    const {
      statusPaid,
      title,
      amount,
      deadline,
      teamAccounting,
      memberPaid,
      totalPay,
      onPress,
    } = this.props;
    let background = null;
    let icon = null;
    let status = null;
    if (statusPaid == Constants.STATUS_PAID_DONE) {
      icon = Images.iconCheckCircle;
      status = strings('done');
      background = Colors.green5;
    } else if (statusPaid == Constants.STATUS_PAID_WAITING) {
      icon = Images.iconInterface;
      status = strings('waiting');
      background = Colors.gray13;
    } else {
      icon = Images.iconWarning;
      status = strings('not_paid');
      background = Colors.primary;
    }

    return (
      <TouchableOpacity onPress={() => onPress && onPress()}>
        <Block
          row
          flex={false}
          color={Colors.gray15}
          space={'between'}
          style={Style.item}>
          <Block column flex={false} space={'between'} style={Style.itemLeft}>
            <Text size={13.5} style={{...ApplicationStyles.fontMPLUS1pBold}}>
              {title}
            </Text>
            <Block row flex={false}>
              <Image
                source={Images.iconAmount}
                style={{height: 18, width: 18, marginRight: 5}}
              />
              <Text
                size={12.5}
                color={Colors.gray9}
                style={{...ApplicationStyles.fontMPLUS1pBold}}>
                Amount:{' '}
                <Text
                  size={12.5}
                  color={Colors.primary}
                  style={{...ApplicationStyles.fontMPLUS1pBold}}>
                  {amount}
                </Text>
              </Text>
            </Block>
            <Block row flex={false}>
              <Image
                source={Images.iconClock}
                style={{height: 18, width: 18, marginRight: 5}}
              />
              <Text
                size={12.5}
                color={Colors.gray9}
                style={{...ApplicationStyles.fontMPLUS1pBold}}>
                Deadline:{' '}
                <Text
                  size={12.5}
                  color={Colors.primary}
                  style={{...ApplicationStyles.fontMPLUS1pBold}}>
                  {deadline}
                </Text>
              </Text>
            </Block>
          </Block>
          <ImageBackground
            source={Images.bgStatusPayment}
            style={[
              Style.itemRight,
              {
                backgroundColor: background,
                justifyContent: !teamAccounting ? 'center' : null,
              },
            ]}>
            {teamAccounting ? (
              <Block center flex={false}>
                <Image source={icon} style={{resizeMode: 'center'}} />
                <Text
                  size={15}
                  bold
                  color={Colors.white}
                  style={{
                    position: 'absolute',
                    top: '80%',
                  }}>
                  {status}
                </Text>
              </Block>
            ) : (
              <Block flex={false} column center>
                <Block flex={false} row>
                  <Text
                    color={Colors.white}
                    size={16}
                    style={{...ApplicationStyles.fontMPLUS1pBold}}>
                    {memberPaid ? memberPaid : 0}/
                  </Text>
                  <Text
                    color={Colors.white}
                    size={16}
                    style={{...ApplicationStyles.fontMPLUS1pBold}}>
                    {totalPay ? totalPay : 0}
                  </Text>
                </Block>
                <Text
                  color={Colors.white}
                  size={12.5}
                  style={{...ApplicationStyles.fontMPLUS1pBold}}>
                  Members paid
                </Text>
              </Block>
            )}
          </ImageBackground>
        </Block>
      </TouchableOpacity>
    );
  }
}

ItemDetailPayment.propTypes = {
  amount: PropTypes.string,
  deadline: PropTypes.any,
};
const Style = StyleSheet.create({
  item: {
    borderRadius: 5,
    height: width / 4,
    width: '100%',
    marginTop: 10,
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
