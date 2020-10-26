/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import UserActions from '../../Stores/User/Actions';
import {Constants} from '../../Utils/constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Style from './AccountingDetailScreenStyle';
import {Screens} from '../../Utils/screens';
import {strings} from '../../Locate/I18n';
import {Images, ApplicationStyles, Colors} from '../../Theme';
import TeamActions from '../../Stores/Team/Actions';
import moment from 'moment';
import ItemListMemberStatus from '../Accounting/ItemListMemberStatus';
import AccountingActions from '../../Stores/Accounting/Actions';
import ImagePicker from 'react-native-image-crop-picker';
import {accountingService} from '../../Services/AccountingService';
import {Config} from '../../Config/index';
const {width} = Dimensions.get('window');
import {Image, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import {
  Button,
  Block,
  Text,
  Header,
  Input,
  ModalNotifcation,
  BottomSheet,
} from '../../Components';

const tabs = [strings('not_paid'), strings('waiting'), strings('done')];
class AccountingDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      isEditing: false,
      isChangeTab: false,
      active: strings('not_paid'),
      accountingId: null,
      imageData: null,
      imageName: '',
      messageNotification: '',
      isOpen: false,
      isDelete: false,
      accounting: {},
      accountingEvidence: null,
    };
    this.bottomSheetMenu = React.createRef();
    this.bottomSheetAccoutingEvidence = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {errorCode, navigation, accountingTeam} = nextProps;
    const {isAdmin, accountingId, accountingDetail} = navigation.state.params;
    const {isChangeTab} = prevState;
    let data = {
      errorCode,
      isAdmin,
      accountingId,
    };
    if (!accountingId) {
      data.accounting = accountingDetail;
    } else {
      data.accounting = accountingTeam;
    }
    if (!isChangeTab) {
      data.active = tabs[0];
    }
    return data;
  }

  componentDidMount = async () => {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      // The screen is focused
      // Call any action
      this.fetchData();
    });
  };

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener && this.focusListener.remove();
  }

  fetchData = () => {
    const {accountingActions} = this.props;
    const {accountingId} = this.state;
    accountingActions.fetchAccounting(accountingId);
  };

  handleChangeTab = (isChangeTab) => {
    this.setState({
      isChangeTab: isChangeTab,
    });
  };

  handleTab = (tab) => {
    this.handleChangeTab(true);
    this.setState({
      active: tab,
    });
  };

  openPicker = async () => {
    const {team} = this.props;
    const {accounting} = this.state;
    ImagePicker.openPicker({
      forceJpg: true,
      mediaType: 'photo',
    }).then((image) => {
      if (image.path && image.mime) {
        const name = image.path.replace(/^.*[\\\/]/, '');
        let data = new FormData();
        data.append('file', {
          uri: image.path,
          name: name,
          type: image.mime,
        });
        data.append('accountingId', accounting.accountingId);
        data.append('teamId', team.teamId);
        this.setState({
          imageData: data,
          imageName: name,
        });
      }
    });
  };

  handleAddEvidencePay = () => {
    const {imageData, accounting} = this.state;
    try {
      accountingService.addEvidencePay(imageData).then((response) => {
        console.log(response);
        if (response.success) {
          accounting.statusPaid = response.data.statusId;
          this.setState({
            accounting,
          });
        } else {
          const {message} = response;
          this.setState({
            messageNotification: message,
            isOpen: true,
          });
        }
      });
    } catch (error) {
      this.setState({
        isOpen: true,
        messageNotification: strings('pay_failed'),
      });
    }
  };

  handleRemindAllMember = async (accountingId) => {
    const data = {
      accountingId: accountingId,
    };
    try {
      accountingService.remindAllMember(data).then((response) => {
        const {message} = response;
        if (response.success) {
          this.setState({
            messageNotification: message,
            isOpen: true,
          });
        } else {
          this.setState({
            messageNotification: message,
            isOpen: true,
          });
        }
      });
    } catch (error) {
      this.setState({
        isOpen: true,
        messageNotification: strings('remind_all_failed'),
      });
    }
  };

  handleRemindOneMember = async (accountingId, userId) => {
    const data = {
      accountingId: accountingId,
      userId: userId,
    };
    try {
      accountingService.remindOneMember(data).then((response) => {
        const {message} = response;
        if (response.success) {
          this.setState({
            messageNotification: message,
            isOpen: true,
          });
        } else {
          this.setState({
            messageNotification: message,
            isOpen: true,
          });
        }
      });
    } catch (error) {
      this.setState({
        isOpen: true,
        messageNotification: strings('remind_failed'),
      });
    }
  };

  handleConfirmOneMember = async (accountingId, userId) => {
    const {accountingActions} = this.props;
    const data = {
      accountingId: accountingId,
      userId: userId,
    };
    try {
      accountingService.confirmOneMember(data).then((response) => {
        const {message} = response;
        if (response.success) {
          this.setState({
            messageNotification: message,
            isOpen: true,
          });
          accountingActions.fetchAccounting(accountingId);
        } else {
          this.setState({
            messageNotification: message,
            isOpen: true,
          });
        }
      });
    } catch (error) {
      this.setState({
        isOpen: true,
        messageNotification: strings('confirm_failed'),
      });
    }
  };

  handleConfirmAllMember = async (accountingId) => {
    const {accountingActions} = this.props;
    const data = {
      accountingId: accountingId,
    };
    try {
      accountingService.confirmAllMember(data).then((response) => {
        const {message} = response;
        if (response.success) {
          this.setState({
            messageNotification: message,
            isOpen: true,
          });
          accountingActions.fetchAccounting(accountingId);
        } else {
          this.setState({
            messageNotification: message,
            isOpen: true,
          });
        }
      });
    } catch (error) {
      this.setState({
        isOpen: true,
        messageNotification: strings('confirm_all_failed'),
      });
    }
  };

  handleGetEvidence = (accountingEvidence) => {
    this.setState({
      accountingEvidence: accountingEvidence,
    });
    this.bottomSheetAccoutingEvidence.current.open();
  };

  handleDeleteAccounting = () => {
    const {accountingId} = this.state;
    const data = {
      accountingId: accountingId,
    };
    try {
      accountingService.deleteAccounting(data).then((response) => {
        const {message} = response;
        if (response.success) {
          this.setState({
            messageNotification: message,
            isDelete: true,
          });
          this.bottomSheetMenu.current.close();
        } else {
          this.setState({
            messageNotification: message,
            isDelete: true,
          });
          this.bottomSheetMenu.current.close();
        }
      });
    } catch (error) {
      this.setState({
        isOpen: true,
        messageNotification: strings('delete_failed'),
      });
    }
  };

  renderTab = (tab, key) => {
    const {active, accounting} = this.state;
    const {
      totalMemberNotPaid,
      totalMemberWaiting,
      totalMemberDone,
    } = accounting;

    const isActive = active === tab;

    return (
      <TouchableOpacity
        key={key}
        onPress={() => this.handleTab(tab)}
        style={Style.tab}>
        {tab == strings('not_paid') ? (
          <Block
            color={Colors.white}
            style={[
              Style.tabContent,
              {backgroundColor: isActive ? Colors.red : Colors.white},
            ]}>
            {this.renderTabContent(
              isActive,
              totalMemberNotPaid,
              isActive ? Images.iconWarning : Images.iconWarningRed,
              strings('not_paid'),
            )}
          </Block>
        ) : null}
        {tab == strings('waiting') ? (
          <Block
            color={Colors.white}
            style={[
              Style.tabContent,
              {backgroundColor: isActive ? Colors.red : Colors.white},
            ]}>
            {this.renderTabContent(
              isActive,
              totalMemberWaiting,
              isActive ? Images.iconInterfaceWhite : Images.iconInterfaceBlack,
              strings('waiting'),
            )}
          </Block>
        ) : null}
        {tab == strings('done') ? (
          <Block
            color={Colors.white}
            style={[
              Style.tabContent,
              {backgroundColor: isActive ? Colors.red : Colors.white},
            ]}>
            {this.renderTabContent(
              isActive,
              totalMemberDone,
              isActive ? Images.iconCheckCircle : Images.iconCheckGreen,
              strings('done'),
            )}
          </Block>
        ) : null}
      </TouchableOpacity>
    );
  };

  renderTabContent = (isActive, personNotPay, icon, status) => {
    return (
      <Block column center style={{justifyContent: 'center'}}>
        <Text
          color={isActive ? Colors.white : Colors.gray9}
          size={14}
          style={{...ApplicationStyles.fontMPLUS1pBold}}>
          {personNotPay}
        </Text>
        <Text
          color={isActive ? Colors.white : Colors.gray9}
          size={12}
          style={{...ApplicationStyles.fontMPLUS1pRegular, marginBottom: 4}}>
          members
        </Text>
        <Image
          source={icon}
          style={{
            resizeMode: 'center',
            width: 22,
            height: 23,
            marginBottom: 4,
          }}
        />
        <Text color={isActive ? Colors.white : Colors.black} size={12.5}>
          {status}
        </Text>
      </Block>
    );
  };

  renderTabNotPaid = () => {
    const {active, accounting} = this.state;
    const {userId, navigation} = this.props;
    const {listMemberNotPaid, accountingId} = accounting;
    let listHtml = [];
    if (listMemberNotPaid && listMemberNotPaid.length > 0) {
      listMemberNotPaid.forEach((item, index) => {
        let imageUrl = `${Config.GET_IMAGE_URL}${
          item.userAvatar ? item.userAvatar : null
        }`;
        listHtml.push(
          <ItemListMemberStatus
            key={index}
            avatar={{uri: imageUrl}}
            tab={active}
            onPress={() =>
              this.handleRemindOneMember(accountingId, item.userId)
            }
            onRedirect={() =>
              userId == item.userId
                ? navigation.navigate(Screens.PROFILE)
                : navigation.navigate(Screens.PROFILE_MEMBER, {
                    userId: item.userId,
                  })
            }
            name={item.userFullName}
          />,
        );
      });
    }

    return (
      <Block flex={false} column>
        <Button
          onPress={() => this.handleRemindAllMember(accountingId)}
          color={Colors.primary}
          style={{height: 35, width: width / 3.5, alignItems: 'center'}}>
          <Text color={Colors.white} size={12.5}>
            Remind All
          </Text>
        </Button>
        {listHtml}
      </Block>
    );
  };

  renderTabWaiting = () => {
    const {active, accounting} = this.state;
    const {userId, navigation} = this.props;
    const {listMemberWaiting, accountingId} = accounting;
    let listHtml = [];
    if (listMemberWaiting && listMemberWaiting.length > 0) {
      listMemberWaiting.forEach((item, index) => {
        let imageUrl = `${Config.GET_IMAGE_URL}${
          item.userAvatar ? item.userAvatar : null
        }`;
        listHtml.push(
          <ItemListMemberStatus
            key={index}
            onShowBill={() => this.handleGetEvidence(item.accountingEvidence)}
            avatar={{uri: imageUrl}}
            tab={active}
            onPress={() =>
              this.handleConfirmOneMember(accountingId, item.userId)
            }
            onRedirect={() =>
              userId == item.userId
                ? navigation.navigate(Screens.PROFILE)
                : navigation.navigate(Screens.PROFILE_MEMBER, {
                    userId: item.userId,
                  })
            }
            name={item.userFullName}
          />,
        );
      });
    }
    return (
      <Block flex={false} column>
        <Button
          onPress={() => this.handleConfirmAllMember(accountingId)}
          color={Colors.primary}
          style={{height: 35, width: width / 3.5, alignItems: 'center'}}>
          <Text color={Colors.white} size={12.5}>
            Confirm all
          </Text>
        </Button>
        {listHtml}
      </Block>
    );
  };

  renderTabDone = () => {
    const {active, accounting} = this.state;
    const {userId, navigation} = this.props;
    const {listMemberDone} = accounting;
    let listHtml = [];
    if (listMemberDone && listMemberDone.length > 0) {
      listMemberDone.forEach((item, index) => {
        let imageUrl = `${Config.GET_IMAGE_URL}${
          item.userAvatar ? item.userAvatar : null
        }`;
        listHtml.push(
          <ItemListMemberStatus
            key={index}
            avatar={{uri: imageUrl}}
            tab={active}
            onRedirect={() =>
              userId == item.userId
                ? navigation.navigate(Screens.PROFILE)
                : navigation.navigate(Screens.PROFILE_MEMBER, {
                    userId: item.userId,
                  })
            }
            name={item.userFullName}
          />,
        );
      });
    }
    return (
      <Block flex={false} column>
        {listHtml}
      </Block>
    );
  };

  renderMenuFeature = () => {
    const {navigation} = this.props;
    const {accounting} = this.state;

    return (
      <Block center>
        <TouchableOpacity
          style={Style.menuFeature}
          onPress={() => {
            navigation.navigate(Screens.ACCOUNTING_CREATE_NEW, {
              accountingTeam: accounting,
            });
            this.bottomSheetMenu.current.close();
          }}>
          <Text size={12}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={Style.menuFeature}
          onPress={() => this.handleDeleteAccounting()}>
          <Text size={12} color={Colors.red}>
            Delete
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={Style.menuFeature}
          onPress={() => this.bottomSheetMenu.current.close()}>
          <Text size={12}>Cancel</Text>
        </TouchableOpacity>
      </Block>
    );
  };

  renderMemberStatusDetail = (statusPaid) => {
    const {imageName} = this.state;
    let textColor = null;
    let icon = null;
    let status = null;
    if (statusPaid == Constants.STATUS_PAID_DONE) {
      icon = Images.iconCheckGreen;
      status = strings('done');
      textColor = Colors.green5;
    } else if (statusPaid == Constants.STATUS_PAID_WAITING) {
      icon = Images.iconInterfaceBlack;
      status = strings('waiting');
      textColor = Colors.black;
    } else {
      icon = Images.iconWarningRed;
      status = strings('not_paid');
      textColor = Colors.primary;
    }

    return (
      <Block flex={false}>
        <Text
          size={13.5}
          style={{
            ...ApplicationStyles.fontMPLUS1pBold,
            marginTop: 10,
            marginBottom: 10,
          }}>
          Status
        </Text>
        <Block column center style={Style.viewMemberStatus}>
          <Image
            source={icon}
            style={{
              marginBottom: 5,
              height: 30,
              width: statusPaid == Constants.STATUS_PAID_NOT_PAID ? 32 : 30,
            }}
          />
          <Text
            size={12.5}
            color={textColor}
            style={{...ApplicationStyles.fontMPLUS1pBold}}>
            {status}
          </Text>
        </Block>
        {statusPaid == Constants.STATUS_PAID_NOT_PAID ? (
          <Block flex={false} column>
            <Text
              size={13.5}
              style={{
                ...ApplicationStyles.fontMPLUS1pBold,
                marginTop: 10,
                marginBottom: 10,
              }}>
              Attach
            </Text>
            <TouchableOpacity onPress={() => this.openPicker()}>
              <Block flex={false} row style={Style.viewInputSearch}>
                <Block flex={false} style={{width: '5%', marginRight: 20}}>
                  <Image
                    source={Images.iconSelectFile}
                    style={{resizeMode: 'center'}}
                  />
                </Block>
                <Block flex={false} style={{width: '95%'}}>
                  <Text>{imageName ? imageName : strings('only_photo')} </Text>
                </Block>
              </Block>
            </TouchableOpacity>
            <Button
              onPress={() => this.handleAddEvidencePay()}
              color={Colors.primary}
              style={{height: 45, alignItems: 'center', marginTop: 15}}>
              <Text color={Colors.white} size={13.5}>
                Pay
              </Text>
            </Button>
          </Block>
        ) : null}
      </Block>
    );
  };

  renderDialogEvidence = () => {
    const {accountingEvidence} = this.state;
    const imageUrl = `${Config.GET_IMAGE_URL}${
      accountingEvidence ? accountingEvidence : null
    }`;
    return (
      <Block
        flex={false}
        column
        style={{
          justifyContent: 'center',
          height: '100%',
        }}>
        <TouchableOpacity
          onPress={() => this.bottomSheetAccoutingEvidence.current.close()}>
          <AntDesign
            name="close"
            size={20}
            style={{alignSelf: 'flex-end', marginRight: 10}}
          />
        </TouchableOpacity>
        <Image source={{uri: imageUrl}} style={Style.imageEvidence} />
      </Block>
    );
  };

  render() {
    const {navigation} = this.props;
    const {
      active,
      isAdmin,
      messageNotification,
      isOpen,
      accounting,
      isDelete,
    } = this.state;
    const {title, amount, dateDeadline, notice, statusPaid} = accounting;

    return (
      <Block style={Style.view}>
        <Header
          isShowBack
          rightIcon={
            isAdmin ? (
              <TouchableOpacity
                onPress={() => this.bottomSheetMenu.current.open()}>
                <Image
                  source={Images.iconFeatureWhite}
                  style={{
                    resizeMode: 'center',
                    height: 10,
                    width: 20,
                  }}
                />
              </TouchableOpacity>
            ) : null
          }
          title="Details"
          navigation={navigation}
        />
        <ScrollView style={Style.view} showsVerticalScrollIndicator={false}>
          <Block style={Style.container}>
            <Block
              column
              color={Colors.white}
              space={'between'}
              style={Style.viewHeaderDetail}>
              <Text size={16} style={{...ApplicationStyles.fontMPLUS1pBold}}>
                {title ? title : null}
              </Text>
              <Text
                size={12.5}
                color={Colors.gray9}
                style={{...ApplicationStyles.fontMPLUS1pBold}}>
                Amount:{' '}
                <Text
                  size={12.5}
                  color={Colors.primary}
                  style={{...ApplicationStyles.fontMPLUS1pBold}}>
                  {amount ? amount : 0}
                </Text>
              </Text>
              <Text
                size={12.5}
                color={Colors.gray9}
                style={{...ApplicationStyles.fontMPLUS1pBold}}>
                Deadline:{' '}
                <Text
                  size={12.5}
                  color={Colors.primary}
                  style={{...ApplicationStyles.fontMPLUS1pBold}}>
                  {dateDeadline
                    ? moment(dateDeadline).format('DD/MM/YYYY')
                    : null}
                </Text>
              </Text>
            </Block>
            <Text
              size={13.5}
              style={{
                ...ApplicationStyles.fontMPLUS1pBold,
                marginTop: 10,
                marginBottom: 10,
              }}>
              Notice
            </Text>
            <Input
              editable={false}
              placeholderTextColor={Colors.placeholder}
              placeholder={strings('enter_notice')}
              style={[Style.textArea]}
              textAlignVertical={'top'}
              multiline
              value={notice ? notice : null}
            />
            {isAdmin ? (
              <Block flex={false}>
                <ScrollView scrollEnabled={false} horizontal style={Style.tabs}>
                  {tabs.map((tab, index) => this.renderTab(tab, index))}
                </ScrollView>
                {active == strings('not_paid') ? this.renderTabNotPaid() : null}
                {active == strings('waiting') ? this.renderTabWaiting() : null}
                {active == strings('done') ? this.renderTabDone() : null}
              </Block>
            ) : (
              this.renderMemberStatusDetail(statusPaid ? statusPaid : 7)
            )}
          </Block>
        </ScrollView>
        {/* Menu feature */}
        <BottomSheet
          animated={true}
          style={Style.bottomSheetFeature}
          ref={this.bottomSheetMenu}>
          {this.renderMenuFeature()}
        </BottomSheet>
        {/* Accounting Evidence */}
        <BottomSheet
          animated={true}
          style={Style.viewEvidence}
          ref={this.bottomSheetAccoutingEvidence}>
          {this.renderDialogEvidence()}
        </BottomSheet>
        <ModalNotifcation
          isOpen={isOpen}
          message={messageNotification}
          onAccept={() => {
            this.setState({
              isOpen: false,
              messageNotification: '',
            });
          }}
        />
        <ModalNotifcation
          isOpen={isDelete}
          message={messageNotification}
          onAccept={() => {
            this.setState({
              isDelete: false,
              messageNotification: '',
            });
            navigation.goBack();
          }}
        />
      </Block>
    );
  }
}

AccountingDetailScreen.defaultProps = {};

AccountingDetailScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  teamActions: PropTypes.object,
  profile: PropTypes.object,
  accountingTeam: PropTypes.object,
  userId: PropTypes.string,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  team: state.team.team,
  profile: state.user.profile,
  accountingTeam: state.accounting.accountingTeam,
  userId: state.user.userId,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
  accountingActions: bindActionCreators(AccountingActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountingDetailScreen);
