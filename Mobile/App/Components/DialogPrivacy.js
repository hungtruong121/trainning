/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View, FlatList} from 'react-native';

import {Text, SearchView, UserCheckBox, Block} from '.';
import {Colors} from 'App/Theme';
import ResponsiveUtils from '../Utils/ResponsiveUtils';
import {Privacy} from '../Constants';

import BottomSheet from './BottomSheet';
import PrivacyItem from '../Containers/CreatePost/PrivacyItem';
import {strings} from '../Locate/I18n';

class DialogPrivacy extends Component {
  constructor(props) {
    super(props);

    this.bottomSheet = React.createRef();

    this.state = {
      privacyId: this.props.privacyId,
      visiblePrivacy: true,
      visibleIncludeUser: false,
      teamUsers: [],
      userInclude: [],
      search: '',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {teamUsers} = nextProps;
    if (teamUsers != prevState.teamUsers) {
      return {teamUsers};
    }

    return null;
  }

  open = (privacyId, userInclude = []) => {
    this.bottomSheet.current?.open();
    this.setState({privacyId, userInclude});
  };

  showSelectPrivacy = (visible) => {
    this.setState({
      visiblePrivacy: visible,
      visibleIncludeUser: !visible,
    });
  };

  onSelectedPrivacy = (privacyId) => {
    this.setState({privacyId});
    if (privacyId == Privacy.INCLUDE) {
      this.showSelectPrivacy(false);
      const teamUsers = this.updateStateIncludeForUser();
      this.setState({teamUsers});
    }
  };

  updateStateIncludeForUser = () => {
    const {teamUsers, userInclude} = this.state;
    for (let i = 0; i < teamUsers.length; i++) {
      for (let j = 0; j < userInclude.length; j++) {
        if (userInclude[j].userId == teamUsers[i].userId) {
          teamUsers[i].included = true;
          break;
        }
        teamUsers[i].included = false;
      }
    }

    return teamUsers;
  };

  onSelectedUser = (user) => {
    const {teamUsers} = this.state;

    for (let i = 0; i < teamUsers.length; i++) {
      if (teamUsers[i].userId == user.userId) {
        teamUsers[i].included = !teamUsers[i].included;
        break;
      }
    }
    this.setState({teamUsers});
  };

  onConfirmPrivacy = () => {
    let {privacyId, userInclude} = this.state;
    this.closeDialog();
    if (privacyId != Privacy.INCLUDE) {
      userInclude = [];
    }
    this.props.onSelected(privacyId, userInclude);
  };

  onConfirmUsers = () => {
    const {privacyId, teamUsers} = this.state;
    let userInclude = [];
    for (let i = 0; i < teamUsers.length; i++) {
      if (teamUsers[i].included) {
        userInclude.push({
          userId: teamUsers[i].userId,
          userFullName: teamUsers[i].userFullName,
        });
      }
      teamUsers[i].included = false;
    }

    this.setState({userInclude});
    this.closeIncludeUser();
    this.props.onSelected(privacyId, userInclude);
    this.closeDialog();
  };

  closeDialog = () => {
    this.bottomSheet.current?.close();
  };

  closeIncludeUser = () => {
    this.showSelectPrivacy(!this.state.visiblePrivacy);
  };

  renderItem = ({item, index}) => {
    const {search} = this.state;
    const searchTrim = search.trim().toLowerCase();
    if (
      item &&
      item.userFullName &&
      item.userFullName.toLowerCase().includes(searchTrim)
    ) {
      return (
        <UserCheckBox
          key={index}
          user={item}
          checked={item.included}
          borderBottom={index < this.state.teamUsers.length - 1}
          onSelected={() => this.onSelectedUser(item)}
        />
      );
    }
  };

  render() {
    const {
      privacyId,
      userInclude,
      visiblePrivacy,
      visibleIncludeUser,
    } = this.state;
    const {teamUsers} = this.props;

    let includes = strings('me');
    if (userInclude.length > 0) {
      includes += userInclude.map((user, index) => {
        const preFix = index == 0 ? ` ${strings('and')} ` : ' ';
        return preFix + user.userFullName;
      });
    }

    return (
      <>
        <BottomSheet
          style={styles.container}
          ref={this.bottomSheet}
          animated={true}>
          {visiblePrivacy && (
            <Block padding={[20]}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  style={{paddingVertical: 5}}
                  onPress={this.closeDialog}>
                  <Text size={13.5}>{strings('cancel')}</Text>
                </TouchableOpacity>
                <Text size={14} bold>
                  {strings('privacy')}
                </Text>
                <TouchableOpacity
                  style={{paddingVertical: 5}}
                  onPress={this.onConfirmPrivacy}>
                  <Text size={13.5} bold>
                    {strings('ok')}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text bold size={13} style={{marginTop: 16}}>
                {strings('who_can_see_your_post')}
              </Text>
              <Block marginTop={8}>
                <PrivacyItem
                  title={strings('public')}
                  content={strings('my_team_followers')}
                  privacyId={Privacy.PUBLIC}
                  checked={privacyId == Privacy.PUBLIC}
                  borderBottom
                  onSelected={this.onSelectedPrivacy}
                />
                <PrivacyItem
                  title={strings('your_team')}
                  content={strings('internal_team')}
                  privacyId={Privacy.INTERNAL}
                  checked={privacyId == Privacy.INTERNAL}
                  borderBottom
                  onSelected={this.onSelectedPrivacy}
                />
                <PrivacyItem
                  title={strings('includes')}
                  content={includes}
                  privacyId={Privacy.INCLUDE}
                  checked={privacyId == Privacy.INCLUDE}
                  borderBottom
                  onSelected={this.onSelectedPrivacy}
                />
                <PrivacyItem
                  title={strings('only_me')}
                  content={strings('only_me')}
                  privacyId={Privacy.PRIVATE}
                  checked={privacyId == Privacy.PRIVATE}
                  onSelected={this.onSelectedPrivacy}
                />
              </Block>
            </Block>
          )}

          {visibleIncludeUser && teamUsers && (
            <Block padding={[20]}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  style={{paddingVertical: 5}}
                  onPress={this.closeIncludeUser}>
                  <Text size={13.5}>{strings('cancel')}</Text>
                </TouchableOpacity>
                <Text size={14} bold>
                  {strings('includes')}
                </Text>
                <TouchableOpacity
                  style={{paddingVertical: 5}}
                  onPress={this.onConfirmUsers}>
                  <Text size={13.5} bold>
                    {strings('ok')}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text bold style={{marginTop: 16}} size={12}>
                {strings('me')} {strings('and')}
              </Text>
              <SearchView
                style={{marginTop: 10}}
                placeholder={strings('search')}
                onChangeText={(text) => this.setState({search: text})}
              />

              {Array.isArray(teamUsers) && (
                <Block marginTop={20}>
                  <FlatList
                    data={teamUsers}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </Block>
              )}
            </Block>
          )}
        </BottomSheet>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: ResponsiveUtils.normalize(765),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  border: {
    borderWidth: 1,
    borderColor: Colors.gray1,
    borderRadius: 5,
  },
  text: {
    marginLeft: 8,
  },
});

export default DialogPrivacy;
