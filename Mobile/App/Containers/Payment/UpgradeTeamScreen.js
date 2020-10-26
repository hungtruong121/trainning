/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {TouchableOpacity, ScrollView, Platform, Image} from 'react-native';
import RNIap, {
  acknowledgePurchaseAndroid,
  consumePurchaseAndroid,
  finishTransaction,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import {Block, Text, Header} from '../../Components';
import UserActions from '../../Stores/User/Actions';
import PaymentActions from '../../Stores/Payment/Actions';
import {strings} from '../../Locate/I18n';
import Style from './CommonStyle';
import {ApplicationStyles, Images} from '../../Theme';
import ProductsComponent from './ProductsComponent';
import {Config} from '../../Config/index';
import {
  formatBytes,
  timeConverter,
  isShowIconExpire,
} from '../../Utils/commonFunction';

let purchaseUpdateSubscription;
let purchaseErrorSubscription;
const itemSkus = Platform.select({
  ios: [
    'com.teamsport.product.network.10.6',
    'com.teamsport.product.network.10.8',
  ],
  android: ['android.test.purchased', 'com.teamsport.rank.silver'],
});

class UpgradeTeamScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receipt: '',
      // productList: [],
      teamRank: [],
      teamInfo: {},
      teamId: null,
      indexProduct: 0,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {errorCode, teamInfo, teamRank, navigation} = nextProps;
    const {teamId} = navigation.state.params;
    const data = {errorCode, teamInfo, teamRank, teamId};
    const {teamRankId} = teamInfo;
    if (teamRank && teamRank.length > 0) {
      const indexProduct = teamRank.findIndex(
        (item) => item.teamRankId === teamRankId,
      );
      if (indexProduct >= 0) {
        data.indexProduct = indexProduct;
      }
    }
    return data;
  }

  componentDidMount = async () => {
    const {paymentActions} = this.props;
    const {teamId} = this.state;
    paymentActions.fetchTeamInfo(teamId);
    try {
      const result = await RNIap.initConnection();
      await RNIap.consumePurchaseAndroid(
        'inapp:com.teamsport:android.test.purchased',
      );
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      console.log('connection is =>', result);
    } catch (err) {
      console.warn(err.code, err.message);
    }

    purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      console.log(purchase);
      alert(JSON.stringify(purchase));
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        try {
          if (Platform.OS === 'ios') {
            finishTransactionIOS(purchase.transactionId);
          } else if (Platform.OS === 'android') {
            // If consumable (can be purchased again)
            consumePurchaseAndroid(purchase.purchaseToken);
            // If not consumable
            acknowledgePurchaseAndroid(purchase.purchaseToken);
          }
          const ackResult = await finishTransaction(purchase);
          console.log('ackResult', ackResult);
        } catch (ackErr) {
          console.warn('ackErr', ackErr);
        }

        this.setState({receipt}, () => this.goNext());
      }
    });
    purchaseErrorSubscription = purchaseErrorListener((error) => {
      console.log('purchaseErrorListener', error);
    });
  };

  componentWillUnmount = () => {
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
    RNIap.endConnection();
  };

  goNext = () => {
    console.log('Receipt', this.state.receipt);
    alert(JSON.stringify(this.state.receipt));
  };

  // getItems = async () => {
  //   try {
  //     const products = await RNIap.getProducts(itemSkus);
  //     // const products = await RNIap.getSubscriptions(itemSkus);
  //     console.log('Products', products);
  //     alert(JSON.stringify(products));
  //     this.setState({productList: products});
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  getAvailablePurchases = async () => {
    try {
      console.info(
        'Get available purchases (non-consumable or unconsumed consumable)',
      );
      const purchases = await RNIap.getAvailablePurchases();
      console.info('Available purchases :: ', purchases);
      if (purchases && purchases.length > 0) {
        this.setState({
          availableItemsMessage: `Got ${purchases.length} items.`,
          receipt: purchases[0].transactionReceipt,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  requestPurchase = async (sku) => {
    try {
      const products = await RNIap.getProducts([sku]);
      if (products.length > 0) {
        RNIap.requestPurchase(products[0].productId);
      }
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  render() {
    const {navigation} = this.props;
    const {teamInfo, teamRank, indexProduct} = this.state;
    const {
      currentMembers,
      currentStorageCapacity,
      teamRankExpire,
      teamRankId,
      storageCapacity,
      teamRankMemberLimit,
    } = teamInfo;
    const teamAvatar =
      teamInfo && teamInfo.teamInfo ? teamInfo.teamInfo.teamAvatar : null;
    const teamName =
      teamInfo && teamInfo.teamInfo ? teamInfo.teamInfo.teamName : null;

    return (
      <Block style={Style.view}>
        <Header title={strings('payment')} isShowBack navigation={navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            ...ApplicationStyles.paddingHorizontalView,
            paddingVertical: 10,
          }}>
          {/* <TouchableOpacity onPress={() => this.getItems()}>
            <Text>Get list product</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => this.requestPurchase(itemSkus[0])}>
            <Text>Buy product</Text>
          </TouchableOpacity>
          <Block style={Style.container}>
            <Block center>
              <Image
                source={{uri: `${Config.GET_IMAGE_URL}${teamAvatar}`}}
                style={Style.avatar}
              />
              <Text bold style={{marginTop: 10}}>
                {teamName ? teamName : ''}
              </Text>
            </Block>
            <Block row space="between" style={Style.info}>
              <Block flex={false} style={{width: '60%'}}>
                <Text style={Style.text}>Current member quantity</Text>
                <Text style={Style.text}>Current file capacity</Text>
                <Text style={Style.text}>Rank</Text>
                <Text style={Style.text}>Validation util</Text>
              </Block>
              <Block flex={false} style={{width: '39%'}}>
                <Text right style={Style.text}>
                  {currentMembers ? currentMembers : ''}
                </Text>
                <Text right style={Style.text}>
                  {formatBytes(currentStorageCapacity)}
                </Text>
                <Text
                  right
                  style={[
                    Style.text,
                    {...ApplicationStyles.fontMPLUS1pExtraBold},
                  ]}>
                  SILVER
                </Text>
                <Text right style={Style.text}>
                  {isShowIconExpire(teamRankExpire) ? (
                    <Image
                      source={Images.iconExclamation}
                      style={{width: 20, height: 20}}
                    />
                  ) : null}
                  {`  ${timeConverter(teamRankExpire, 'DD/MM/YYYY')}`}
                </Text>
              </Block>
            </Block>
            <Block flex={false}>
              <Text style={Style.text}>Benefits</Text>
              <Text style={Style.textBenefit}>
                <Image
                  source={Images.iconCheckGreen}
                  style={{width: 20, height: 20}}
                />
                {` ${strings('upload_file_videos_up_to_50GB_in_size').replace(
                  '50',
                  storageCapacity,
                )}`}
              </Text>
              <Text style={Style.textBenefit}>
                <Image
                  source={Images.iconCheckGreen}
                  style={{width: 20, height: 20}}
                />
                {` ${strings(
                  'the_maximum_number_of_member_is_up_to_100_people',
                ).replace('100', teamRankMemberLimit)}`}
              </Text>
            </Block>
          </Block>
          <Block center style={{marginVertical: 10}}>
            <ProductsComponent
              products={teamRank}
              teamRankId={teamRankId}
              indexProduct={indexProduct}
              packageIdSelected={12}
            />
          </Block>
        </ScrollView>
      </Block>
    );
  }
}

UpgradeTeamScreen.defaultProps = {};

UpgradeTeamScreen.propTypes = {
  userActions: PropTypes.object,
  userId: PropTypes.string,
  paymentActions: PropTypes.object,
  teamRank: PropTypes.array,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  userId: state.user.userId,
  teamRank: state.payment.teamRank,
  teamInfo: state.payment.teamInfo,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  paymentActions: bindActionCreators(PaymentActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeTeamScreen);
