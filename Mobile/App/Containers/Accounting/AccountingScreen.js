import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import UserActions from '../../Stores/User/Actions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Style from './AccountingScreenStyle';
import {Screens} from '../../Utils/screens';
import {strings} from '../../Locate/I18n';
import {ApplicationStyles, Colors} from '../../Theme';
import TeamActions from '../../Stores/Team/Actions';
import {accountingService} from '../../Services/AccountingService';
import moment from 'moment';
import ItemDetailPayment from '../Accounting/ItemDetailPayment';
import AccountingActions from '../../Stores/Accounting/Actions';
import {TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import {
  Block,
  Text,
  Header,
  Input,
  Loading,
  ModalNotifcation,
} from '../../Components';
import {Constants} from '../../Utils/constants';

// const tabs = ["For You", "My Team"];
const YOUR_TAB = strings('your_accounting');
const TEAM_TAB = strings('team_accounting');
class AccountingScreen extends Component {
  constructor(props) {
    super(props);
    this.imagePicker = React.createRef();
    this.state = {
      keyword: '',
      isEditing: false,
      isChangeTab: false,
      active: strings('for_you'),
      searchType: strings('your_accounting'),
      messageNotification: '',
      isOpen: false,
      listAccounting: [],
      listCollecting: [],
      listExpired: [],
      tabs: [strings('for_you'), strings('my_team')],
      loading: false,
      isAdmin: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {errorCode, team} = nextProps;
    let {isChangeTab, tabs} = prevState;
    const data = {errorCode};

    if (!isChangeTab) {
      data.active = tabs[0];
    }
    tabs =
      team.teamMemberRole == Constants.TEAM_MEMBER && tabs.length > 1
        ? tabs.splice(-1)
        : tabs;
    data.isAdmin = team.teamMemberRole == Constants.TEAM_MEMBER ? false : true;

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
    const {isChangeTab} = this.state;
    !isChangeTab
      ? this.handleSearch('', YOUR_TAB)
      : this.handleSearch('', TEAM_TAB);
  };

  handleLoading = (loading) => {
    this.setState({
      loading: loading,
    });
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
    tab === strings('my_team')
      ? (this.handleSearch('', TEAM_TAB), this.setState({searchType: TEAM_TAB}))
      : (this.handleSearch('', YOUR_TAB),
        this.setState({
          searchType: YOUR_TAB,
        }));
  };

  handleSearch = async (keyword, searchType) => {
    const {team} = this.props;
    let {listAccounting} = this.state;
    const data = {
      teamId: team.teamId,
      searchType: searchType,
      keyword: keyword,
      firstResult: 0,
      maxResult: 10,
    };
    try {
      this.handleLoading(true);
      accountingService.searchAccounting(data).then((response) => {
        if (response.success) {
          this.handleLoading(false);
          listAccounting = response.data.accountings;
          this.setState({
            listAccounting,
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
        messageNotification: strings('search_failed'),
      });
    }
  };

  renderTab = (tab, key) => {
    const {active} = this.state;
    const isActive = active === tab;
    return (
      <TouchableOpacity
        key={key}
        onPress={() => this.handleTab(tab)}
        style={[Style.tab, isActive ? Style.active : null]}>
        <Text
          color={isActive ? '#4F4F4F' : Colors.gray6}
          size={isActive ? 16 : 13.5}
          medium
          style={{...ApplicationStyles.fontMPLUS1pBold}}>
          {tab}
        </Text>
      </TouchableOpacity>
    );
  };

  renderTabYourAccounting = () => {
    const {navigation} = this.props;
    const {listAccounting} = this.state;
    let listExpiredHtml = [];
    let listCollectingHtml = [];
    let listCollecting = [];
    let listExpired = [];
    if (listAccounting && listAccounting.length > 0) {
      listCollecting = listAccounting.filter((item) => item.isExpired == false);

      listExpired = listAccounting.filter((item) => item.isExpired == true);
    }
    if (listCollecting && listCollecting.length > 0) {
      listCollecting.forEach((item, index) => {
        listCollectingHtml.push(
          <ItemDetailPayment
            key={index}
            title={item.title}
            amount={item.amount}
            deadline={moment(item.dateDeadline).format('DD/MM/YYYY')}
            statusPaid={item.statusPaid}
            teamAccounting
            onPress={() =>
              navigation.navigate(Screens.ACCOUNTING_DETAIL, {
                isAdmin: false,
                accountingDetail: item,
                accountingId: null,
              })
            }
          />,
        );
      });
    }
    if (listExpired && listExpired.length > 0) {
      listExpired.forEach((item, index) => {
        listExpiredHtml.push(
          <ItemDetailPayment
            key={index}
            title={item.title}
            amount={item.amount}
            deadline={moment(item.dateDeadline).format('DD/MM/YYYY')}
            statusPaid={item.statusPaid}
            teamAccounting
            onPress={() =>
              navigation.navigate(Screens.ACCOUNTING_DETAIL, {
                isAdmin: false,
                accountingDetail: item,
                accountingId: null,
              })
            }
          />,
        );
      });
    }

    return (
      <Block>
        <Block column color={Colors.white} style={Style.viewsection}>
          <Text
            size={14}
            style={{
              ...ApplicationStyles.fontMPLUS1pBold,
            }}>
            Collecting
          </Text>
          {listCollectingHtml}
        </Block>
        <Block column color={Colors.white} style={Style.viewsection}>
          <Text
            size={14}
            style={{
              ...ApplicationStyles.fontMPLUS1pBold,
            }}>
            Expired
          </Text>
          {listExpiredHtml}
        </Block>
      </Block>
    );
  };

  renderTabTeamAccounting = () => {
    const {navigation} = this.props;
    const {listAccounting, isAdmin} = this.state;
    let listExpiredHtml = [];
    let listCollectingHtml = [];
    let listCollecting = [];
    let listExpired = [];

    if (listAccounting && listAccounting.length > 0) {
      listCollecting = listAccounting.filter((item) => item.isExpired == false);

      listExpired = listAccounting.filter((item) => item.isExpired == true);
    }
    if (listCollecting && listCollecting.length > 0) {
      listCollecting.forEach((item, index) => {
        listCollectingHtml.push(
          <ItemDetailPayment
            key={index}
            title={item.title}
            amount={item.amount}
            deadline={moment(item.dateDeadline).format('DD/MM/YYYY')}
            statusPaid={item.statusPaid}
            memberPaid={item.totalMemberPaid}
            totalPay={item.totalMemberInclude}
            onPress={() => {
              navigation.navigate(Screens.ACCOUNTING_DETAIL, {
                isAdmin: isAdmin,
                accountingDetail: null,
                accountingId: item.accountingId,
              });
            }}
          />,
        );
      });
    }
    if (listExpired && listExpired.length > 0) {
      listExpired.forEach((item, index) => {
        listExpiredHtml.push(
          <ItemDetailPayment
            key={index}
            title={item.title}
            amount={item.amount}
            deadline={moment(item.dateDeadline).format('DD/MM/YYYY')}
            statusPaid={item.statusPaid}
            memberPaid={item.totalMemberPaid}
            totalPay={item.totalMemberInclude}
            onPress={() => {
              navigation.navigate(Screens.ACCOUNTING_DETAIL, {
                isAdmin: isAdmin,
                accountingDetail: null,
                accountingId: item.accountingId,
              });
            }}
          />,
        );
      });
    }

    return (
      <Block>
        <Block column color={Colors.white} style={Style.viewsection}>
          <Text
            size={14}
            style={{
              ...ApplicationStyles.fontMPLUS1pBold,
            }}>
            Collecting
          </Text>
          {listCollectingHtml}
        </Block>
        <Block column color={Colors.white} style={Style.viewsection}>
          <Text
            size={14}
            style={{
              ...ApplicationStyles.fontMPLUS1pBold,
            }}>
            Expired
          </Text>
          {listExpiredHtml}
        </Block>
      </Block>
    );
  };

  render() {
    const {navigation} = this.props;
    const {
      keyword,
      active,
      messageNotification,
      isOpen,
      searchType,
      loading,
      tabs,
    } = this.state;
    return (
      <Block style={Style.view}>
        <Header
          isShowBack
          rightIcon={
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Screens.ACCOUNTING_CREATE_NEW, {
                  accountingTeam: null,
                })
              }
              style={{padding: 10}}>
              <Text color={Colors.white}>New</Text>
            </TouchableOpacity>
          }
          title={strings('accounting')}
          navigation={navigation}
        />
        <Block row flex={false} style={Style.viewInputSearch}>
          {!keyword ? (
            <Block flex={false} style={{width: '10%'}}>
              <AntDesign name={'search1'} size={18} color={Colors.gray17} />
            </Block>
          ) : null}
          <Block flex={false} style={{width: '90%'}}>
            <Input
              style={[Style.inputSearch]}
              onChangeText={(keyword) => {
                this.setState({keyword});
                this.handleSearch(keyword, searchType);
              }}
              value={keyword}
            />
          </Block>
        </Block>
        <Block flex={false}>
          <ScrollView horizontal style={Style.tabs}>
            {tabs.map((tab, index) => this.renderTab(tab, index))}
          </ScrollView>
        </Block>

        <ScrollView style={Style.view} showsVerticalScrollIndicator={false}>
          {loading ? (
            <Loading size={25} color={Colors.primary} />
          ) : (
            <Block style={Style.container}>
              {active === strings('for_you')
                ? this.renderTabYourAccounting()
                : this.renderTabTeamAccounting()}
            </Block>
          )}
        </ScrollView>
        {/* message notification call API */}
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
      </Block>
    );
  }
}

AccountingScreen.defaultProps = {};

AccountingScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  teamActions: PropTypes.object,
  profile: PropTypes.object,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  team: state.team.team,
  profile: state.user.profile,
  accountingTeam: state.accounting.accountingTeam,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
  accountingActions: bindActionCreators(AccountingActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountingScreen);
