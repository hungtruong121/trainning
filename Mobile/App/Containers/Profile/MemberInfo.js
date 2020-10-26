import React, {Component} from 'react';
import {Config} from '../../Config/index';
import {Sizes, Images, ApplicationStyles, Colors} from '../../Theme';
import {timeConverter} from '../../Utils/commonFunction';
import {Image, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Block, Text} from '../../Components';
import moment from 'moment';
export default class MemberInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChangeTab: false,
      selectIndex: 0,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const {listTeamInfo} = nextProps;
    const data = {listTeamInfo};
    return data;
  }
  handleNext = () => {
    const {listTeamInfo} = this.props;
    const {selectIndex} = this.state;
    if (selectIndex === listTeamInfo.length - 1) {
      return this.setState(() => ({
        selectIndex: 0,
      }));
    }
    this.setState((prevState) => ({
      selectIndex: prevState.selectIndex + 1,
    }));
  };

  handlePre = () => {
    const {selectIndex, listTeamInfo} = this.state;
    if (selectIndex === 0) {
      return this.setState(() => ({
        selectIndex: listTeamInfo.length - 1,
      }));
    }
    this.setState((prevState) => ({
      selectIndex: prevState.selectIndex - 1,
    }));
  };

  handleChangeTab = (isChangeTab) => {
    this.setState({
      isChangeTab: isChangeTab,
    });
  };

  renderUserAchievement = (userInfo) => {
    let listHtml = [];
    if (userInfo.userAchievements && userInfo.userAchievements.length > 0) {
      const arrAchievements = userInfo.userAchievements;
      arrAchievements.forEach((element, index) => {
        listHtml.push(
          <Block
            key={index}
            margin={[0, 0, 5, 0]}
            row
            space={'between'}
            style={{width: '100%'}}>
            <Block column>
              <Text size={12.5} color={Colors.red}>
                {element.userAchievementName}
              </Text>
              <Text size={12.5} color={Colors.black}>
                {element.userAchievementTime}
              </Text>
            </Block>
            <Text size={12.5} color={Colors.black}>
              {element.userAchievementSport}
            </Text>
          </Block>,
        );
      });
    }
    return (
      <Block
        column
        margin={[10, 0, 0, 0]}
        style={{
          borderBottomColor: Colors.gray8,
          borderBottomWidth: 1,
        }}>
        {listHtml}
      </Block>
    );
  };

  renderListPeriodMatches = (listPeriodMatches) => {
    let listHtml = [];
    if (listPeriodMatches.length > 0) {
      listPeriodMatches.forEach((item, index) => {
        listHtml.push(
          <Block row space={'between'} key={index}>
            <Text style={[Style.infoBodyTeamValue, {width: 55}]}>
              {item.period}
            </Text>
            <Text style={[Style.infoBodyTeamValue, {width: 80}]}>
              {item.matches}
            </Text>
            <Text style={Style.infoBodyTeamValue}>{item.win}</Text>
            <Text style={Style.infoBodyTeamValue}>{item.draw}</Text>
            <Text style={Style.infoBodyTeamValue}>{item.lose}</Text>
          </Block>,
        );
      });
    }
    return (
      <Block margin={[21, 0, 0, 0]} column style={Style.personInfoBody}>
        <Block flex={false} row space={'between'}>
          <Text style={[Style.infoTitle, {width: 55, fontSize: 11.5}]}>
            PERIOD
          </Text>
          <Text style={[Style.infoTitle, {width: 80, fontSize: 11.5}]}>
            MATCHES
          </Text>
          <Text style={[Style.infoTitle, {fontSize: 11.5}]}>WIN</Text>
          <Text style={[Style.infoTitle, {fontSize: 11.5}]}>DRAW</Text>
          <Text style={[Style.infoTitle, {fontSize: 11.5}]}>LOSE</Text>
        </Block>
        {listHtml}
      </Block>
    );
  };

  renderInfoByTeam = (listTeamInfo) => {
    let showImage = true;
    const {selectIndex} = this.state;
    if (listTeamInfo.length > 0) {
      const {
        memberSince,
        teamMemberRole,
        position,
        teamAchievements,
        listPeriodMatches,
        sportName,
        teamAvatar,
        teamName,
      } = listTeamInfo[selectIndex];
      const imageUrl = `${Config.GET_IMAGE_URL}${
        teamAvatar ? teamAvatar : null
      }`;
      if (!imageUrl) {
        showImage = false;
      }
      const strMemberRole = teamMemberRole.split('_');
      const role = strMemberRole[1];
      const memberSinces = timeConverter(
        memberSince ? memberSince : '',
        'DD/MM/YYYY',
      );

      return (
        <Block>
          <Block
            row
            center
            margin={[20, 0, 0, 0]}
            color={Colors.red}
            style={Style.headerSlideTeam}>
            <Block center flex={false} style={{width: '10%', height: 40}}>
              <TouchableOpacity
                onPress={() => this.handlePre()}
                style={Style.touchClick}>
                <Image
                  source={Images.iconBack}
                  style={{height: 10, width: 10}}
                />
              </TouchableOpacity>
            </Block>
            <Block flex={false} center midle style={{width: '80%'}}>
              <Block center row flex={false}>
                {showImage ? (
                  <Image
                    source={{uri: imageUrl}}
                    style={{
                      height: 25,
                      width: 25,
                      borderRadius: 25,
                      marginRight: 10,
                    }}
                  />
                ) : null}
                <Text
                  size={12.5}
                  bold
                  color={Colors.white}
                  style={{marginRight: 10}}>
                  {teamName}
                </Text>
              </Block>
            </Block>
            <Block center flex={false} style={{width: '10%', height: 40}}>
              <TouchableOpacity
                onPress={() => this.handleNext()}
                style={Style.touchClick}>
                <Image
                  source={Images.iconNext}
                  style={{height: 10, width: 10}}
                />
              </TouchableOpacity>
            </Block>
          </Block>
          <Block style={Style.personInfoByTeam}>
            <Block column>
              <Text style={Style.textTeamEvents}>SPORT</Text>
              <Text style={Style.textTeamValue}>
                {sportName ? sportName : 'N/A'}
              </Text>
            </Block>
            <Block column margin={[18, 0, 0, 0]}>
              <Text style={Style.textTeamEvents}>MEMBER SINCE</Text>
              <Text style={Style.textTeamValue}>
                {memberSinces ? memberSinces : 'N/A'}
              </Text>
            </Block>
            <Block column margin={[18, 0, 0, 0]}>
              <Text style={Style.textTeamEvents}>ROLE</Text>
              <Text style={Style.textTeamValue}>{role ? role : 'N/A'}</Text>
            </Block>
            <Block column margin={[24, 0, 0, 0]}>
              <Text style={Style.textTeamEvents}>POSITION</Text>
              <Text style={Style.textTeamValue}>
                {position ? position : 'N/A'}
              </Text>
            </Block>
            {this.renderListPeriodMatches(
              listPeriodMatches ? listPeriodMatches : 'N/A',
            )}
            <Block column margin={[25, 0, 0, 0]}>
              <Text style={Style.textTeamEvents}>TEAM ACHIEVEMENTS</Text>
              <Text style={Style.textTeamValue}>
                {teamAchievements ? teamAchievements : 'N/A'}
              </Text>
            </Block>
          </Block>
        </Block>
      );
    }
  };

  render() {
    const {userInfo, listTeamInfo} = this.props;
    const {
      userFullName,
      userShortIntroduction,
      userAge,
      userBirthDay,
      userAddress,
      userWeight,
      userHeight,
      userPreferredHand,
      userPreferredFoot,
      userAvatar,
    } = userInfo;

    const imageUrl = `${Config.GET_IMAGE_URL}${
      userAvatar ? userAvatar : Images.memberOne
    }`;
    return (
      <Block margin={[20, 0, 0, 0]} style={Style.view}>
        <Block row>
          <Image
            source={userAvatar ? {uri: imageUrl} : Images.avatar}
            style={{
              width: 112,
              height: 112,
              borderRadius: 150,
            }}
          />
          <Block column margin={[0, 0, 0, 20]}>
            <Text
              color={Colors.black}
              size={15}
              style={{...ApplicationStyles.fontMPLUS1pBold}}>
              {userFullName ? userFullName : ''}
            </Text>
            <Text
              color={Colors.gray10}
              size={12.5}
              style={{...ApplicationStyles.fontMPLUS1pRegular}}>
              {userAddress ? userAddress : ''}
            </Text>
            <Text
              color={Colors.gray9}
              size={13.5}
              style={{
                marginTop: 10,
              }}>
              {userShortIntroduction ? `"${userShortIntroduction}"` : ''}
            </Text>
          </Block>
        </Block>
        <Text
          size={15}
          color={Colors.black}
          style={{
            ...ApplicationStyles.fontMPLUS1pBold,
            marginTop: 35,
          }}>
          PERSONAL INFO
        </Text>
        <Block style={Style.personInfoParent}>
          <Block row space={'between'} style={Style.personInfoBody}>
            <Block flex={false} colum space={'between'}>
              <Text style={Style.infoBodyTitle}>HEIGHT</Text>
              <Text style={Style.infoBodyValue}>
                {userHeight ? userHeight : 'N/A'}
              </Text>
              <Text style={Style.infoBodyUnit}>CM</Text>
            </Block>
            <Block flex={false} colum space={'between'}>
              <Text style={Style.infoBodyTitle}>WEIGHT</Text>
              <Text style={Style.infoBodyValue}>
                {userWeight ? userWeight : 'N/A'}
              </Text>
              <Text style={Style.infoBodyUnit}>KG</Text>
            </Block>
            <Block flex={false} colum space={'between'}>
              <Text style={Style.infoBodyTitle}>AGE</Text>
              <Text style={Style.infoBodyValue}>
                {userAge ? userAge : 'N/A'}
              </Text>
              <Text style={Style.infoBodyUnit}>
                {userBirthDay ? userBirthDay : moment().format('DD/MM/YYYY')}
              </Text>
            </Block>
            <Block flex={false} clolum space={'between'}>
              <Text style={Style.infoBodyTitle}>PREFERRED HAND</Text>
              <Block column>
                <Block row style={Style.iconHandContent}>
                  <Image
                    source={
                      userPreferredHand == 'left' || userPreferredHand == 'both'
                        ? Images.iconBlackLeftHand
                        : Images.iconGrayLeftHand
                    }
                    style={Style.iconHand}
                  />
                  <Image
                    source={Images.iconSeparator}
                    style={{height: 15, width: 1, margin: 2}}
                  />
                  <Image
                    source={
                      userPreferredHand == 'right' ||
                      userPreferredHand == 'both'
                        ? Images.iconBlackRightHand
                        : Images.iconGrayRightHand
                    }
                    style={Style.iconHand}
                  />
                </Block>
                <Block row style={Style.iconFootContent}>
                  <Image
                    source={
                      userPreferredFoot == 'left' || userPreferredFoot == 'both'
                        ? Images.iconBlackLeftFoot
                        : Images.iconGrayLeftFoot
                    }
                    style={Style.iconFoot}
                  />
                  <Image
                    source={Images.iconSeparator}
                    style={{height: 25, width: 1, margin: 2}}
                  />
                  <Image
                    source={
                      userPreferredFoot == 'right' ||
                      userPreferredFoot == 'both'
                        ? Images.iconBlackRightFoot
                        : Images.iconGrayRightFoot
                    }
                    style={Style.iconFoot}
                  />
                </Block>
              </Block>
              <Text style={Style.infoBodyTitle}>PREFERRED FOOT</Text>
            </Block>
          </Block>
          <Block column margin={[15, 0, 0, 0]}>
            <Text style={Style.textPersonEvents}>CARRER ACHIEVEMENTS</Text>
          </Block>
          {this.renderUserAchievement(userInfo)}
        </Block>
        <Text
          size={15}
          color={Colors.black}
          style={{
            ...ApplicationStyles.fontMPLUS1pBold,
            marginTop: 45,
          }}>
          PERSONAL INFO BY TEAM
        </Text>
        <Block flex={false}>{this.renderInfoByTeam(listTeamInfo)}</Block>
      </Block>
    );
  }
}

MemberInfo.defaultProps = {
  userInfo: {},
  listTeamInfo: [],
};
MemberInfo.propTypes = {
  userInfo: PropTypes.object,
  listTeamInfo: PropTypes.array,
};

const Style = StyleSheet.create({
  view: {
    ...ApplicationStyles.backgroundView,
  },
  personInfoParent: {
    backgroundColor: Colors.white,
    width: '100%',
    height: '100%',
    padding: 14,
    borderRadius: 5,
    marginTop: 18,
  },
  personInfoBody: {
    backgroundColor: Colors.gray11,
    width: '100%',
    borderRadius: 5,
    padding: 10,
  },
  infoBodyTitle: {
    color: Colors.gray12,
    fontSize: 11.5,
    ...ApplicationStyles.fontMPLUS1pBold,
    textAlign: 'center',
  },
  infoTitle: {
    color: Colors.gray12,
    fontSize: 12,
    ...ApplicationStyles.fontMPLUS1pBold,
    textAlign: 'center',
    width: 50,
  },
  infoBodyValue: {
    color: Colors.black,
    fontSize: 15,
    ...ApplicationStyles.fontMPLUS1pBold,
    textAlign: 'center',
  },
  infoBodyUnit: {
    color: Colors.gray12,
    fontSize: 12.5,
    textAlign: 'center',
  },
  textPersonEvents: {
    fontSize: 12.5,
    color: Colors.black,
    ...ApplicationStyles.fontMPLUS1pBold,
  },
  textPersonValue: {
    marginTop: 5,
    fontSize: 14,
    color: Colors.red1,
    ...ApplicationStyles.fontMPLUS1pBold,
  },
  textTeamEvents: {
    fontSize: 12.5,
    color: Colors.black,
    ...ApplicationStyles.fontMPLUS1pBold,
  },
  textTeamValue: {
    marginTop: 8,
    fontSize: 13.5,
    color: Colors.red1,
    ...ApplicationStyles.fontMPLUS1pBold,
  },
  infoBodyTeamValue: {
    color: Colors.black,
    fontSize: 13,
    ...ApplicationStyles.fontMPLUS1pMedium,
    marginTop: 15,
    width: 50,
    textAlign: 'center',
  },
  tabs: {
    marginVertical: Sizes.base / 2,
    paddingHorizontal: Sizes.base,
  },
  tab: {
    marginRight: Sizes.base,
    paddingBottom: Sizes.base / 2,
  },
  active: {
    borderBottomColor: Colors.red,
    borderBottomWidth: 3,
  },
  personInfoByTeam: {
    backgroundColor: Colors.white,
    width: '100%',
    height: '100%',
    padding: 14,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  iconHandContent: {
    marginTop: -2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  iconHand: {
    height: 15,
    width: 20,
    resizeMode: 'contain',
  },
  iconFootContent: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  iconFoot: {
    height: 25,
    width: 20,
    resizeMode: 'contain',
  },
  headerSlideTeam: {
    height: 40,
    width: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  touchClick: {
    height: 40,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
