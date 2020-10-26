/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import UserActions from '../../Stores/User/Actions';
import PostActions from '../../Stores/Post/Actions';
import Style from './ChatScreenStyle';
import {Colors} from '../../Theme';
import {
  Header,
  Block,
  Text,
  ImageCircle,
  Input,
} from '../../Components';

import { Config } from '../../Config';
import { strings } from '../../Locate/I18n';
import { Screens } from '../../Utils/screens';
import database from '@react-native-firebase/database';
import moment from 'moment';

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.flatListRef = React.createRef();


    this.state = {
      search: '',
      messageHistory: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {post} = nextProps;
    if (post.postDetail != prevState.postDetail) {
      return {postDetail: post.postDetail};
    }

    return null;
  }
  
  componentDidMount() {
    database()
      .ref('/messages')
      .on('value', this.processMessage);
  }

  processMessage = (snapshot) => {
    if(!snapshot) {
      return;
    }
    const {messageHistory} = this.state;
    const {listTeamMembers, user} = this.props;
    messageHistory.length = 0;
    const data = snapshot.val();
    if (data) {
      const userIds = Object.keys(data);
      
      userIds.forEach(userId => {
        const recieverInfo = listTeamMembers.find(member => (member.userId == userId && member.userId != user.userId));
        if(recieverInfo) {
          const messages = Object.keys(data[userId]);
          let lastMessage = {time: 0};
          messages.forEach(message => {
            if(data[userId][message].from == user.userId) {
              lastMessage = data[userId][message];
            }
          });
          let maxTimestamp = lastMessage.time;

          if(data[user.userId]) {
            const timestamps2 = Object.keys(data[user.userId]);
            for (let i = 0; i < timestamps2.length; i++) {
              const timestamp = timestamps2[i];
              if (data[user.userId][timestamp].from == userId && maxTimestamp < parseInt(data[user.userId][timestamp].time)) {
                lastMessage = data[user.userId][timestamp];
              }
            }
          }

          console.log(lastMessage)
          if(lastMessage.time) {
            messageHistory.push({
              user: recieverInfo,
              message: lastMessage,
            });
          }
        }
      });

      messageHistory.sort((message1, message2) => message1.message.time < message2.message.time);

      this.setState({ messageHistory });
    }
  }

  scrollToIndex = (index) => {
    this.flatListRef.current.scrollToIndex({animated: true, index: index, viewPosition: 0.5});
    this.setState({indexSelected: index});
  }

  onChatDetail = (user) => {
    this.props.navigation.navigate(Screens.CHAT_DETAIL, {user})
  }

  componentWillUnmount() {
    database()
      .ref('/messages')
      .off();
  }

  renderItemChatHistory = ({item}) => {
    return (
      <TouchableOpacity onPress={() => this.onChatDetail(item.user)}>
        <Block flex={false} padding={[10, 10, 10, 0]} marginLeft={20} row style={{borderBottomWidth: 1, borderColor: Colors.gray8}}>
          <ImageCircle
            source={{uri: Config.GET_IMAGE_URL + item.user.userAvatar}}
            size={55}
          />
          <Block padding={[0, 10, 0, 10]}>
            <Block row>
              <Block>
                <Text color={Colors.black} size={17}>{item.user.userFullName}</Text>
              </Block>
              <Text color={Colors.gray9}>{moment(item.message.time).format('YYYY-MM-DD HH:mm A')}</Text>
            </Block>
            <Block row marinTop={6}>
              <Block>
                <Text color={Colors.gray9} numberOfLines={1}>{item.message.content}</Text>
              </Block>
              <MaterialIcons name={'notifications'} size={20} color={Colors.gray9}/>
            </Block>
          </Block>
          
        </Block>
      </TouchableOpacity>
    );
  };

  renderItemUser = ({item, index}) => {
    if(item.userId == this.props.user.userId) {
      return null;
    }

    const {search} = this.state;
    const searchTrim = search.trim();
    if(!item.userFullName.toLowerCase().includes(searchTrim.toLowerCase())) {
      return null;
    }
    
    return (
      <TouchableOpacity key={index} onPress={() => this.onChatDetail(item)}>
        <Block shadow flex={false} row height={65} width={65} style={{borderRadius: 33}} color={Colors.white} center middle margin={[10, 0, 10, 10]}>
          <ImageCircle
            source={{uri: Config.GET_IMAGE_URL + item.userAvatar}}
            size={55}
          />
        </Block>
      </TouchableOpacity>
    );
  };

  renderRightHeader = () => {
    return (
      <TouchableOpacity
        style={{alignItems: 'center'}}
        onPress={() => this.props.navigation.navigate(Screens.NEW_MESSAGE)}>
        <MaterialIcons name={'add'} size={30} color={Colors.white} />
      </TouchableOpacity>
    )
  }

  render() {
    const {search, messageHistory} = this.state;
    const {navigation, listTeamMembers} = this.props;

    return (
      <Block style={Style.view}>
        <Header
          isShowBack
          navigation={navigation}
          title={'Chat'}
          rightIcon={this.renderRightHeader()}
        />
        <Block flex={false} row center padding={[0, 15, 0, 15]} color={Colors.white} shadow>
          <FontAwesome5 name="search" size={20} color={'#BDBDBD'} />
          <Block>
            <Input
              style={{borderWidth: null, height: 50, marginLeft: 15, color: Colors.black}}
              placeholder={strings('search')}
              value={search}
              onChangeText={(search) => this.setState({search})}
            />
          </Block>
        </Block>
        <Block flex={false} middle style={{borderBottomWidth: 1, borderColor: Colors.gray8}}>
          <FlatList
            data={listTeamMembers}
            ref={this.flatListRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItemUser}
          />
        </Block>
        <Block>
          <FlatList
            data={messageHistory}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItemChatHistory}
          />
        </Block>
      </Block>
    );
  }
}

ChatScreen.defaultProps = {};

ChatScreen.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
