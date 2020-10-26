/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ScrollView} from 'react-native';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {Text} from '../../Components';

import {Colors} from '../../Theme';
import ResponsiveUtils from '../../Utils/ResponsiveUtils';

export default class TagUser extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();

    this.state = {
      users: [],
      listUsers: [],
      text: '',
      editable: true,
      heightContainer: 40,
      isFocus: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {users} = nextProps;
    if (users != prevState.users) {
      return {users};
    }

    return null;
  }

  isElementInArray(element, array) {
    for (let i = 0; i < array.length; i++) {
      if (element.userId && element.userId == array[i].userId) {
        return true;
      }
    }

    return false;
  }

  setTags(tags) {
    let {users} = this.state;
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      if (this.isElementInArray(tag, users)) {
        continue;
      }
      users.push(tag);
    }
    this.setState({users});
  }

  getTags() {
    return this.state.users;
  }

  onChangeText = (text) => {
    this.setState({text, listUsers: []});
  };

  addTag = (user) => {
    let {users} = this.state;
    if (!this.isElementInArray(user, users)) {
      users.push(user);
      this.setState({users});
    }
  };

  onSelectSuggestion = (user) => {
    this.addTag({
      userId: user.userId,
      userFullName: user.userFullName,
    });
    this.setState({text: ''});
    this.input.current?.focus();

    this.props.onTag();
  };

  removeTag = (index) => {
    const {users} = this.state;
    if (users.length > 0) {
      if (index >= 0 && index < users.length) {
        users.splice(index, 1);
        this.setState({users});
      } else {
        const lastUser = users.pop();
        this.setState({users, text: '@' + lastUser.userFullName});
      }
    }
  };

  clearContent() {
    this.setState({users: [], text: ''});
  }

  render() {
    const {users, text, heightContainer} = this.state;
    const {
      style,
      placeholder,
      styleContainer,
      styleInput,
      styleTag,
      editable,
      placeholderTextColor,
      listUsers,
    } = this.props;

    const fontSize = style.fontSize || 15;
    const tagColor = style.tagColor || Colors.tagname;

    let search = text.trim();
    if (text.charAt(0) == '@') {
      search = text.substr(1, text.length);
    }

    const renderTags = users.map((user, index) => (
      <View style={[styles.tag, styleTag]} key={index}>
        <TouchableOpacity onPress={() => this.removeTag(index)}>
          <View
            style={[
              styles.tag,
              styleTag,
              index == users.length - 1 && {marginRight: 10},
            ]}>
            <Text color={tagColor} size={fontSize}>
              {'@' + user.userFullName}
            </Text>
          </View>
        </TouchableOpacity>
        {index < users.length - 1 && (
          <Text color={tagColor} size={fontSize}>
            {', '}
          </Text>
        )}
      </View>
    ));

    const renderSuggestion = listUsers.map((user, index) => {
      if (user.userFullName.toUpperCase().includes(search.toUpperCase())) {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => this.onSelectSuggestion(user)}>
            <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
              <Text color={Colors.white} size={fontSize}>
                {user.userFullName}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }
    });

    return (
      <View style={Platform.OS == 'ios' && {zIndex: 100}}>
        <View style={[styles.container, styleContainer]}>
          {renderTags}
          <TextInput
            ref={this.input}
            style={[styles.input, {fontSize}, styleInput]}
            placeholder={placeholder}
            value={text}
            editable={editable}
            returnKeyType={'done'}
            placeholderTextColor={placeholderTextColor}
            onFocus={() => this.setState({isFocus: true})}
            onBlur={() => this.setState({isFocus: false})}
            onChangeText={this.onChangeText}
            onKeyPress={({nativeEvent}) => {
              if (text == '' && nativeEvent.key === 'Backspace') {
                this.removeTag();
              }
            }}
          />
        </View>
        {text != '' && this.state.isFocus && (
          <View
            style={[styles.containerSuggestion, {top: -heightContainer}]}
            onLayout={(event) =>
              this.setState({heightContainer: event.nativeEvent.layout.height})
            }>
            <ScrollView keyboardShouldPersistTaps="always">
              {renderSuggestion}
            </ScrollView>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 6,
  },
  tag: {
    flexDirection: 'row',
    borderRadius: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minWidth: 30,
    paddingVertical: 5,
    fontFamily: 'MPLUS1p-Medium',
  },
  containerSuggestion: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'gray',
    borderRadius: 10,
    zIndex: 110,
    elevation: 5,
    maxHeight: ResponsiveUtils.height(130),
  },
});
