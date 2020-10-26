/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import { StatusBar, FlatList, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import UserActions from '../../Stores/User/Actions';
import PostActions from '../../Stores/Post/Actions';
import Style from './ChatDetailScreenStyle';
import {Colors} from '../../Theme';
import {
  Block,
  Text,
  ImageCircle,
  Button,
  Input} from '../../Components';

import { Config } from '../../Config';
import { strings } from '../../Locate/I18n';
import { SafeAreaView } from 'react-navigation';
import database from '@react-native-firebase/database';
import moment from 'moment';


class ChatDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.flatListRef = React.createRef();

    const {navigation} = this.props;
    this.user = navigation.getParam('user');

    this.state = {
      user: this.user,
      messageInput: '',
      listTeamMembers: [],
      listUsers: [],
      listMessages: [],
      listMessageUser: [],
      listMessageMine: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {listTeamMembers} = nextProps;
    if (listTeamMembers != prevState.listTeamMembers) {
      return {listTeamMembers};
    }

    return null;
  }

  componentDidMount() {
    this.fetchMessageFirebase();
  }
  
  fetchMessageFirebase() {
    const me = this.props.user;

    database()
      .ref(`/messages/${this.user.userId}`)
      .on('value', this.processingMessageUser);

    database()
      .ref(`/messages/${me.userId}`)
      .on('value', this.processingMessageMine);
  }

  processingMessageUser = (snapshot) => {
    if(!snapshot) {
      return;
    }

    let {listMessageUser, listMessageMine, listMessages} = this.state;
    const me = this.props.user;
    listMessageUser.length = 0;

    const data = snapshot.val();
    if (data) {
      const keys = Object.keys(data);
      keys.forEach(key => {
        const message = data[key];
        if (message.from == me.userId) {
          listMessageUser.push(message);
        }
      });

      listMessages = listMessageUser.concat(listMessageMine);
      listMessages.sort((a, b) => a.time - b.time);

      this.setState({ listMessages, listMessageUser });
    }
  }

  processingMessageMine = (snapshot) => {
    if(!snapshot) {
      return;
    }
    
    let {listMessageUser, listMessageMine, listMessages} = this.state;
    listMessageMine.length = 0;

    const data = snapshot.val();
    if (data) {
      const keys = Object.keys(data);
      keys.forEach(key => {
        const message = data[key];
        if (message.from == this.user.userId) {
          listMessageMine.push(message);
        }
      });

      listMessages = listMessageMine.concat(listMessageUser);
      listMessages.sort((a, b) => a.time - b.time);

      this.setState({ listMessages, listMessageMine });
    }
  }

  scrollToIndex = () => {
    // this.flatListRef.current.scrollToIndex({animated: true, index: index, viewPosition: 0.5});
    // this.setState({indexSelected: index});
    this.flatListRef.current.scrollToEnd();
  }

  onSelectedUser = () => {

  }

  onChangeMessage = (message) => {
    this.setState({messageInput: message})
  }

  onSendMessage = () => {
    const {messageInput} = this.state;
    const me = this.props.user;

    const messageTrim = messageInput.trim();
    if (!messageTrim) return;

    const timestamp = moment().unix() * 1000;
    database().ref(`messages/${this.user.userId}/${timestamp}`)
      .set({
        from: me.userId,
        avatar: me.profile.userAvatar,
        content: messageTrim,
        time: timestamp,
      })
      .then(() => {
        this.setState({ messageInput: '' });
        this.flatListRef.current?.scrollToEnd();
      }).catch((error) => {
        console.log('error ', error)
      });
  }

  componentWillUnmount() {
    database()
      .ref(`/messages/${this.user.userId}`)
      .off();

    database()
      .ref(`/messages/${this.props.user.userId}`)
      .off();
  }

  renderItemMessage = ({item}) => {
    const me = this.props.user;
    const isMessageMine = item.from == me.userId;
    const styleMessage = isMessageMine ? {flexDirection: 'row-reverse'} : {flexDirection: 'row'};
    const avatar = Config.GET_IMAGE_URL +  item.avatar;
    // console.log('renderItemMessage', item)

    return (
      <Block flex={false} padding={[10]} row style={styleMessage}>
          <Block flex={false} right margin={[0, 5, 0, 5]}>
            {isMessageMine ? (
              <Block flex={false} style={{backgroundColor: Colors.primary, width: 20, height: 20, borderRadius: 10}} center middle>
                <Icon name={'check'} color={Colors.white} size={15}/>
              </Block>
            ) : (
              <ImageCircle
                source={{uri: avatar}}
                size={20}
              />
            )}
          </Block>
          <Block flex={2} row right={isMessageMine}>
            <Block flex={false} color={isMessageMine ? Colors.primary : Colors.white} padding={[5, 15, 5, 15]} card shadow>
              <Text color={isMessageMine ? Colors.white : null} selectable>{item.content}</Text>
            </Block>
          </Block>
          <Block flex={1} />
        </Block>
    );
  };

  renderRightHeader = () => {
    return (
      <Button
        style={{height: null, alignItems: 'center', marginVertical: 0}}
        onPress={this.onSendMessage}>
        <Text color={Colors.white}>Send</Text>
      </Button>
    )
  }

  render() {
    const {user, visibleGIF, listMessages, messageInput} = this.state;
    const {navigation} = this.props;
    // console.log('listMessages', listMessages);
    // const listMessages = listMessageMine.concat(listMessageUser);
    // listMessages.sort((a, b) => a.time - b.time);

    return (
      <Block style={Style.view}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{backgroundColor: Colors.white}} />
        <Block flex={false} row center color={Colors.white} padding={[8, 0, 5, 0]}>
          <Button
            style={{backgroundColor: null, marginLeft: 4}}
            opacity={0.4}
            onPress={() => navigation.goBack()}>
            <AntDesign name={'left'} size={25} />
          </Button>
          <Block row marginLeft={8}>
            <ImageCircle
              source={{uri: Config.GET_IMAGE_URL + user.userAvatar}}
              size={58}
              // onPress={() => this.selectUserProfile(user.userFullName)}
            />
            <Block column margin={[5, 0, 0, 10]}>
              <TouchableOpacity
                // onPress={() => this.selectUserProfile(user)}
              >
                <Text size={16} color={Colors.black} bold>
                  {user.userFullName}
                </Text>
              </TouchableOpacity>
              <Text color={Colors.gray9} style={{marginTop: 5}}>Member of Paracel Soccer and 3 more</Text>
            </Block>
          </Block>
        </Block>

        <Block marginTop={20}>
          <FlatList
            ref={this.flatListRef}
            data={listMessages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItemMessage}
          />
        </Block>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Block
            flex={false}
            color={Colors.white}
            card
            style={{borderTopWidth: 1, borderColor: Colors.gray8}}>
            
            <Block flex={false} padding={[0, 0, 0, 0]}>
              <Block flex={false} row center>
                <Button
                  flex={false}
                  style={{height: null, marginLeft: 10}}
                  opacity={0.4} center
                  onPress={() => this.setState({ visibleGallery: true })}>
                  <Block width={30} height={30} flex={false} center middle>
                    <FontAwesome5
                      name={'camera'}
                      size={25}
                      color={Colors.gray5}
                    />
                  </Block>
                </Button>
                <Button
                  flex={false}
                  style={[
                    Style.buttonGIF,
                    visibleGIF && { borderColor: Colors.primary },
                  ]}
                  opacity={0.4}
                  disabled={true}
                  onPress={() => {
                    this.setState({ visibleGIF: !this.state.visibleGIF });
                  }}>
                  <Block flex={false} width={25} height={25} center middle style={{borderRadius: 5, borderWidth: 1, borderColor: Colors.gray5}}>
                    <Text size={10} color={Colors.gray5}>
                      GIF
                    </Text>
                  </Block>
                </Button>
                <Block
                  row
                  center
                  color={Colors.white}
                  margin={[10]}
                  style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: Colors.gray8,
                  }}>
                  <Block>
                    <Input
                      style={{borderWidth: 0, height: 28, paddingVertical: 0, marginLeft: 10, color: Colors.black}}
                      placeholder={strings('write_your_comment')}
                      placeholderTextColor={Colors.gray5}
                      multiline
                      value={messageInput}
                      onChangeText={this.onChangeMessage}
                    />
                  </Block>
                  <Button
                    style={{ height: 15, paddingVertical: 0 }}
                    onPress={this.onSendMessage}>
                    <Icon
                      name={'chevron-right'}
                      size={16}
                      color={Colors.gray5}
                      style={{ paddingHorizontal: 10 }}
                    />
                  </Button>
                </Block>
              </Block>
            </Block>
          </Block>
        </KeyboardAvoidingView>
        <SafeAreaView />
      </Block>
    );
  }
}

ChatDetailScreen.defaultProps = {};

ChatDetailScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  profile: PropTypes.object,
  listTeamInfo: PropTypes.array,
  userId: PropTypes.string,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  profile: state.user.profile,
  listTeamMembers: state.team.listTeamMembers,
  listTeamInfo: state.user.listTeamInfo,
  userId: state.user.userId,
  user: state.user,
  post: state.post,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  postActions: bindActionCreators(PostActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatDetailScreen);
