/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View, FlatList} from 'react-native';

import {Text, SearchView, UserCheckBox} from '../../Components';
import {Colors} from 'App/Theme';
import ResponsiveUtils from '../../Utils/ResponsiveUtils';

import BottomSheet from '../../Components/BottomSheet';
import {strings} from '../../Locate/I18n';

class DialogTagUser extends Component {
  constructor(props) {
    super(props);

    this.bottomSheet = React.createRef();
    this.state = {
      search: '',
      listUsers: props.listUsers,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {listUsers} = nextProps;
    if (listUsers != prevState.listUsers) {
      return {listUsers};
    }
    return null;
  }

  open = () => {
    this.bottomSheet.current?.open();
  };

  close = () => {
    this.bottomSheet.current?.close();
  };

  onConfirm = () => {
    const {listUsers} = this.state;
    let listUserSelected = [];
    for (let i = 0; i < listUsers.length; i++) {
      if (listUsers[i].selected) {
        listUserSelected.push({
          userId: listUsers[i].userId,
          userFullName: listUsers[i].userFullName,
        });
      }
    }
    // for(let i = 0; i < tags.length; i++) {
    //   const tag = tags[i];
    //   for(let j = 0; j < users.length; j++) {
    //     if(tags[i].userId != users[j].userId) {
    //       users.push(tag);
    //     }
    //   }
    // }

    this.props.onSelected(listUserSelected);
    this.close();
  };

  onSelected = user => {
    const {listUsers} = this.state;
    for (let i = 0; i < listUsers.length; i++) {
      if (listUsers[i].userId == user.userId) {
        listUsers[i].selected = !listUsers[i].selected;
        break;
      }
    }

    this.setState({listUsers});
  };

  setTeamUsers = listUsers => {
    this.setState({listUsers});
  };

  renderItem = ({item, index}) => {
    const {search} = this.state;
    const searchTrim = search.trim().toLowerCase();
    if (
      item.userFullName &&
      item.userFullName.toLowerCase().includes(searchTrim)
    ) {
      return (
        <UserCheckBox
          user={item}
          checked={item.selected}
          borderBottom={index < this.state.listUsers.length - 1}
          onSelected={this.onSelected}
        />
      );
    }
  };

  render() {
    return (
      <BottomSheet
        style={styles.container}
        ref={this.bottomSheet}
        animated={false}>
        <View style={{flex: 1, padding: 20}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity style={{paddingVertical: 5}} onPress={this.close}>
              <Text size={15}>{strings('cancel')}</Text>
            </TouchableOpacity>
            <Text size={17} bold>
              {strings('tags')}
            </Text>
            <TouchableOpacity
              style={{paddingVertical: 5}}
              onPress={this.onConfirm}>
              <Text size={15} bold>
                {strings('ok')}
              </Text>
            </TouchableOpacity>
          </View>
          <Text bold style={{marginTop: 16}}>
            {strings('me')} {strings('and')}
          </Text>
          <SearchView
            style={{marginTop: 10, height: null, paddingVertical: 0}}
            placeholder={strings('search')}
            onChangeText={text => this.setState({search: text})}
          />

          <View style={{flex: 1, marginTop: 20}}>
            <FlatList
              data={this.state.listUsers}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </BottomSheet>
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

export default DialogTagUser;
