import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import UserActions from '../../Stores/User/Actions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Style from './AccountingCreateNewScreenStyle';
import {ApplicationStyles, Colors} from '../../Theme';
import TeamActions from '../../Stores/Team/Actions';
import moment from 'moment';
import {strings} from '../../Locate/I18n';
import {accountingService} from '../../Services/AccountingService';
import * as RNLocalize from 'react-native-localize';
const {width} = Dimensions.get('window');
import {Config} from '../../Config/index';
import {
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  Block,
  Text,
  Header,
  Input,
  TextSelect,
  DateTimePicker,
  ModalNotifcation,
  BottomSheet,
  CheckBox,
} from '../../Components';
class AccountingCreateNewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      isOpenDateTime: false,
      dateTimePicker: new Date(),
      checkedAll: false,
      checkedOnly: false,
      listStatusIncluce: [],
      listUserIncluce: [],
      accounting: {},
      allTeam: null,
      messageNotification: '',
      isOpen: false,
      isUpdate: false,
      firstResult: 0,
      maxResult: 100,
      listUserMember: [],
    };

    this.bottomSheetPickMember = React.createRef();
  }

  static getDerivedStateFromProps(nextProps) {
    const {errorCode, navigation, memberList} = nextProps;
    const {accountingTeam} = navigation.state.params;
    const data = {errorCode};
    const userAdmin = memberList.teamAdmin ? memberList.teamAdmin : [];
    const userMember = memberList.teamMember ? memberList.teamMember : [];
    data.listUserMember = userAdmin.concat(userMember);
    if (accountingTeam) {
      data.accounting = accountingTeam;
      data.isUpdate = true;
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
    this.fetchMemberList();
    this.convertListUserIncluce();
  };

  defineDateTimePicker = (date) => {
    const split = date.split(' ');
    const dateArray = split[0].split('/');
    const timeArray = split[1].split(':');
    return new Date(
      dateArray[2],
      dateArray[1] - 1,
      dateArray[0],
      timeArray[0],
      timeArray[1],
    );
  };

  showDatePicker = () => {
    this.setDatePickerVisibility(true);
  };

  hideDatePicker = () => {
    this.setDatePickerVisibility(false);
  };

  handleConfirm = (date) => {
    let {accounting} = this.state;
    accounting.dateDeadline = date.getTime();
    this.setState({
      accounting,
    });

    this.hideDatePicker(accounting.deadline);
  };

  setDatePickerVisibility = (isOpenDateTime) => {
    this.setState({
      isOpenDateTime,
    });
  };

  handleSelectMember = (userId) => {
    let {listStatusIncluce, listUserIncluce, listUserMember} = this.state;
    let listIncluce = [];

    for (let index = 0; index < listUserMember.length; index++) {
      const element = listUserMember[index];
      const elementIncluce = listStatusIncluce[index];
      if (element.userId === userId) {
        listStatusIncluce[index] = elementIncluce ? false : true;
      }

      if (listStatusIncluce[index]) {
        listIncluce.push(element.userId);
      }
    }
    listUserIncluce = listIncluce;
    this.setState({
      listStatusIncluce,
      listUserIncluce,
    });
  };

  handleSelectAllTeam = () => {
    let {listUserIncluce, checkedAll, allTeam, listUserMember} = this.state;
    let listUser = [];
    checkedAll = !checkedAll;
    allTeam = null;
    listUserMember.forEach((item) => {
      if (checkedAll) {
        listUser.push(item.userId);
        allTeam = strings('all_team');
      }
    });
    listUserIncluce = listUser;
    this.setState({
      allTeam,
      checkedAll,
      listUserIncluce,
    });
  };

  handleSelectOnlyMe = () => {
    let {listUserIncluce, checkedOnly} = this.state;
    let listUser = [];
    const {profile} = this.props;
    checkedOnly = !checkedOnly;
    if (checkedOnly) {
      listUser.push(profile.userId);
    }
    listUserIncluce = listUser;
    this.setState({
      listUserIncluce,
      checkedOnly,
    });
  };

  handleConfirmPickMember = () => {
    const {listUserIncluce, accounting, allTeam, listUserMember} = this.state;
    let userFullNameList = [];

    for (let i = 0; i < listUserIncluce.length; i++) {
      const elementPick = listUserIncluce[i];
      for (let j = 0; j < listUserMember.length; j++) {
        const element = listUserMember[j];
        if (element.userId == elementPick) {
          userFullNameList.push(listUserMember[j].userFullName);
        }
      }
    }

    accounting.userInclude = allTeam ? allTeam : userFullNameList;
    this.setState({
      accounting,
    });
    this.bottomSheetPickMember.current.close();
  };

  convertListUserIncluce = () => {
    let {accounting, allTeam, listUserMember, listUserIncluce} = this.state;
    let {userInclude} = accounting;
    let userFullNameList = [];
    if (listUserIncluce.length == 0) {
      listUserIncluce = userInclude;
      this.setState({
        listUserIncluce,
      });
    }
    if (userInclude && userInclude.length > 0) {
      for (let i = 0; i < userInclude.length; i++) {
        const elementPick = userInclude[i];
        for (let j = 0; j < listUserMember.length; j++) {
          const element = listUserMember[j];
          if (element.userId == elementPick) {
            userFullNameList.push(listUserMember[j].userFullName);
          }
        }
      }
    }

    accounting.userInclude = allTeam ? allTeam : userFullNameList;
    this.setState({
      accounting,
    });
  };

  handleCancelPickMember = () => {
    this.setState({
      listUserIncluce: [],
      listStatusIncluce: [],
      checkedOnly: false,
      checkedAll: false,
    });
    this.bottomSheetPickMember.current.close();
  };

  handleChangeText = (key, value) => {
    let {accounting} = this.state;
    accounting[key] = value;
    this.setState({
      accounting,
    });
  };

  handleCreateAccounting = async () => {
    const timeZone = RNLocalize.getTimeZone();
    const {accounting, listUserIncluce, isUpdate} = this.state;
    const {team} = this.props;
    const {title, amount, dateDeadline, notice, accountingId} = accounting;
    const {teamId} = team;
    const data = {
      accountingId: isUpdate ? accountingId : null,
      teamId: teamId,
      userInclude: listUserIncluce,
      title: title,
      amount: amount,
      deadline: moment(dateDeadline).format('DD/MM/YYYY h:mm'),
      notice: notice,
      timeZone: timeZone,
    };
    try {
      accountingService.createAccounting(data).then((response) => {
        const {message} = response;
        if (response.success) {
          this.setState({
            messageNotification: message,
            isOpen: true,
            accounting: {},
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
        messageNotification: isUpdate
          ? strings('update_accounting_failed')
          : strings('create_accounting_failed'),
      });
    }
  };

  fetchMemberList = (keyword) => {
    const {teamActions, team} = this.props;
    const {firstResult, maxResult} = this.state;
    const data = {
      teamId: team.teamId,
      keyword: keyword,
      firstResult,
      maxResult,
    };
    teamActions.fetchMemberList(data);
  };

  renderItem = ({item, index}) => {
    const {listStatusIncluce} = this.state;
    let imageUrl = `${Config.GET_IMAGE_URL}${
      item.userAvatar ? item.userAvatar : null
    }`;

    return (
      <TouchableOpacity onPress={() => this.handleSelectMember(item.userId)}>
        <Block
          flex={false}
          row
          center
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.gray17,
            height: 60,
          }}>
          <Block row center>
            <Image
              source={{uri: imageUrl}}
              style={{
                height: 50,
                width: 50,
                marginRight: 30,
                borderRadius: 40,
              }}
            />
            <Text size={12.5} style={{...ApplicationStyles.fontMPLUS1pRegular}}>
              {item.userFullName}
            </Text>
          </Block>
          <CheckBox
            checked={listStatusIncluce[index]}
            onSelected={() => this.handleSelectMember(item.userId)}
            size={19}
          />
        </Block>
      </TouchableOpacity>
    );
  };

  renderDialogPickMember = () => {
    const {keyword, checkedOnly, checkedAll, listUserMember} = this.state;
    return (
      <Block flex={false}>
        <Block
          flex={false}
          row
          space={'between'}
          style={{
            backgroundColor: Colors.primary,
            paddingRight: 10,
            paddingLeft: 10,
          }}>
          <TouchableOpacity
            style={{paddingVertical: 10}}
            onPress={() => this.handleCancelPickMember()}>
            <Text color={Colors.white} size={15}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text
            color={Colors.white}
            size={16}
            style={{...ApplicationStyles.fontMPLUS1pBold, marginTop: 10}}>
            Pick Member
          </Text>
          <TouchableOpacity
            style={{paddingVertical: 10}}
            onPress={() => this.handleConfirmPickMember()}>
            <Text
              color={Colors.white}
              size={13.5}
              style={{...ApplicationStyles.fontMPLUS1pBold}}>
              OK
            </Text>
          </TouchableOpacity>
        </Block>
        <Block column flex={false} margin={[15, 0, 0, 0]}>
          <TouchableOpacity onPress={() => this.handleSelectOnlyMe()}>
            <Block
              row
              flex={false}
              style={Style.sectionHeader}
              space={'between'}>
              <Text size={12.5} style={{...ApplicationStyles.fontMPLUS1pBold}}>
                You
              </Text>
              <CheckBox
                size={19}
                checked={checkedOnly}
                onSelected={() => this.handleSelectOnlyMe()}
              />
            </Block>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.handleSelectAllTeam()}>
            <Block
              row
              flex={false}
              style={Style.sectionHeader}
              space={'between'}>
              <Text size={12.5} style={{...ApplicationStyles.fontMPLUS1pBold}}>
                All team
              </Text>
              <CheckBox
                size={19}
                checked={checkedAll}
                onSelected={() => this.handleSelectAllTeam()}
              />
            </Block>
          </TouchableOpacity>
          <Block
            row
            flex={false}
            style={[Style.sectionHeader, {borderBottomColor: Colors.white}]}
            space={'between'}>
            <Text size={12.5} style={{...ApplicationStyles.fontMPLUS1pBold}}>
              Specific people
            </Text>
          </Block>
          <Block row flex={false} style={Style.viewInputSearch}>
            {!keyword ? (
              <Block flex={false} style={{width: '5%', marginRight: 5}}>
                <AntDesign name={'search1'} size={18} color={Colors.gray17} />
              </Block>
            ) : null}
            <Block flex={false} style={{width: '95%'}}>
              <Input
                style={Style.inputSearch}
                onChangeText={(keyword) => {
                  this.setState({keyword});
                  this.fetchMemberList(keyword);
                }}
                value={keyword}
              />
            </Block>
          </Block>
        </Block>
        <Block flex={false} style={{paddingRight: 10, paddingLeft: 10}}>
          <FlatList
            data={listUserMember}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </Block>
      </Block>
    );
  };

  render() {
    const {navigation} = this.props;
    const {
      isOpenDateTime,
      accounting,
      allTeam,
      isOpen,
      messageNotification,
      isUpdate,
    } = this.state;
    const {title, amount, notice, userInclude, dateDeadline} = accounting;
    let choiceUser = null;
    if (userInclude == undefined) {
      choiceUser = strings('pick_member');
    } else if (userInclude && userInclude.length == 0) {
      choiceUser = strings('pick_member');
    } else if (userInclude && userInclude.length == 1) {
      choiceUser = userInclude[0];
    } else if (
      userInclude &&
      userInclude.length > 1 &&
      userInclude != allTeam
    ) {
      choiceUser =
        userInclude[0] + ' and ' + (userInclude.length - 1) + ' more member';
    } else if (userInclude == allTeam) {
      choiceUser = allTeam;
    }
    let currentDateTime = moment().format('DD/MM/YYYY h:mm');
    const dateTimePicker = dateDeadline
      ? this.defineDateTimePicker(
          moment(dateDeadline).format('DD/MM/YYYY h:mm'),
        )
      : this.defineDateTimePicker(currentDateTime);
    return (
      <Block style={Style.view}>
        <Header
          isShowBack
          rightIcon={
            <TouchableOpacity onPress={() => this.handleCreateAccounting()}>
              <Text color={Colors.white} size={13.5}>
                {isUpdate ? strings('update') : strings('create')}
              </Text>
            </TouchableOpacity>
          }
          title={strings('new')}
          navigation={navigation}
        />
        <ScrollView style={Style.view} showsVerticalScrollIndicator={false}>
          <Block column style={Style.container}>
            <Text
              size={13.5}
              style={{
                ...ApplicationStyles.fontMPLUS1pBold,
                marginTop: 10,
                marginBottom: 5,
              }}>
              Title
            </Text>
            <Input
              placeholderTextColor={Colors.placeholder}
              placeholder={strings('enter_title')}
              style={[Style.textArea, {height: width / 5}]}
              textAlignVertical={'top'}
              multiline
              onChangeText={(text) => {
                this.handleChangeText('title', text);
              }}
              value={title}
            />
            <Text
              size={13.5}
              style={{
                ...ApplicationStyles.fontMPLUS1pBold,
                marginTop: 10,
                marginBottom: 5,
              }}>
              Amount
            </Text>
            <Input
              placeholderTextColor={Colors.placeholder}
              placeholder={strings('enter_amount')}
              style={[Style.textArea, {height: 40}]}
              textAlignVertical={'top'}
              multiline
              onChangeText={(text) => this.handleChangeText('amount', text)}
              value={amount}
            />
            <Text
              size={13.5}
              style={{
                ...ApplicationStyles.fontMPLUS1pBold,
                marginTop: 10,
                marginBottom: 5,
              }}>
              Dealine
            </Text>
            <TextSelect
              selectStyles={[Style.textSelect, {width: width / 2.8}]}
              hiddenSelect
              size={12.5}
              color={Colors.white}
              onSelect={() =>
                this.setState({
                  isOpenDateTime: true,
                  dateTimePicker,
                })
              }
              style={{...ApplicationStyles.fontMPLUS1pRegular}}>
              {dateDeadline
                ? moment(dateDeadline).format('DD/MM/YYYY h:mm')
                : moment().format('DD/MM/YYYY h:mm')}
            </TextSelect>
            <Text
              size={13.5}
              style={{
                ...ApplicationStyles.fontMPLUS1pBold,
                marginTop: 10,
                marginBottom: 5,
              }}>
              Member
            </Text>
            <TextSelect
              selectStyles={Style.textSelect}
              hiddenSelect
              size={12.5}
              color={Colors.white}
              onSelect={() => {
                this.bottomSheetPickMember.current.open();
              }}
              style={{...ApplicationStyles.fontMPLUS1pRegular}}>
              {choiceUser}
            </TextSelect>
            <Text
              size={13.5}
              style={{
                ...ApplicationStyles.fontMPLUS1pBold,
                marginTop: 10,
                marginBottom: 5,
              }}>
              Notice
            </Text>
            <Input
              placeholderTextColor={Colors.placeholder}
              placeholder={strings('"enter_notice"')}
              style={[Style.textArea, {height: width / 2}]}
              textAlignVertical={'top'}
              multiline
              onChangeText={(text) => this.handleChangeText('notice', text)}
              value={notice}
            />
          </Block>
        </ScrollView>
        <DateTimePicker
          isOpen={isOpenDateTime}
          mode={strings('datetime')}
          onConfirm={this.handleConfirm}
          onCancel={this.hideDatePicker}
          date={dateTimePicker}
        />
        {/* pick memeber */}
        <BottomSheet
          animated={true}
          ref={this.bottomSheetPickMember}
          style={Style.bottomSheet}>
          {this.renderDialogPickMember()}
        </BottomSheet>
        <ModalNotifcation
          isOpen={isOpen}
          message={messageNotification}
          onAccept={() => {
            this.setState({
              isOpen: false,
              messageNotification: '',
            });
            navigation.goBack();
          }}
        />
      </Block>
    );
  }
}

AccountingCreateNewScreen.defaultProps = {};

AccountingCreateNewScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  teamActions: PropTypes.object,
  profile: PropTypes.object,
  folder: PropTypes.object,
  loadingFolder: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  team: state.team.team,
  profile: state.user.profile,
  folder: state.team.folder,
  loadingFolder: state.team.loadingFolder,
  memberList: state.team.memberList,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountingCreateNewScreen);
