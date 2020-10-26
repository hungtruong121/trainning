/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import { FlatList, TouchableOpacity, Image } from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import UserActions from '../../Stores/User/Actions';
import PostActions from '../../Stores/Post/Actions';
import Style from './NewMessageScreenStyle';
import {ApplicationStyles, Colors} from '../../Theme';
import {
  Header,
  Block,
  Text,
  ImageCircle,
  Button,
  Input,
  UserCheckBox
} from '../../Components';

import { Config } from '../../Config';
import { PostType } from '../../Constants';
import { postService } from '../../Services/PostService';
import { strings } from '../../Locate/I18n';

class NewMessageScreen extends Component {
  constructor(props) {
    super(props);
    this.flatListRef = React.createRef();

    const {navigation} = this.props;

    this.state = {
      messageText: '',
      search: '',
      listTeamMembers: [],
      listUsers: [],
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
  }

  scrollToIndex = (index) => {
    this.flatListRef.current.scrollToIndex({animated: true, index: index, viewPosition: 0.5});
    this.setState({indexSelected: index});
  }

  onSelectedUser = (user) => {

  }

  onSendMessage = () => {

  }

  renderItemUser = ({item, index}) => {
    const {search} = this.state;
    const searchTrim = search.trim();
    if(!item.userFullName.toLowerCase().includes(searchTrim.toLowerCase())) {
      return null;
    }

    return (
      <UserCheckBox
        key={index}
        user={item}
        checked={item.included}
        borderBottom={index < this.props.listTeamMembers.length - 1}
        onSelected={() => this.onSelectedUser(item)}
      />
    );
  };

  renderRightHeader = () => {
    return (
      <TouchableOpacity
        style={{padding: 5}}
        onPress={this.onSendMessage}>
        <Text color={Colors.white}>Send</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const {messageText, search, listTeamMembers} = this.state;
    const {navigation} = this.props;

    return (
      <Block style={Style.view}>
        <Header
          isShowBack
          navigation={navigation}
          title={'New message'}
          rightIcon={this.renderRightHeader()}
        />
        <Block>
          <Block flex={false} margin={[20]} padding={[10]} color={Colors.white} card shadow>
            <Input
              style={{ borderWidth: 0, height: 100, color: Colors.black, paddingVertical: 0 }}
              multiline
              value={messageText}
              autoFocus={true}
              placeholder={'Write your message'}
              placeholderTextColor={Colors.gray5}
              onChangeText={(messageText) => this.setState({ messageText })}
            />
          </Block>
          <Text size={17} style={{marginLeft: 20}}>Send to</Text>
          <Block flex={false} row center marginTop={5} padding={[0, 0, 0, 15]} color={Colors.white} shadow>
            <FontAwesome5 name="search" size={20} color={'#BDBDBD'} />
            <Block>
              <Input
                style={{borderWidth: null, height: 50, marginLeft: 10, color: Colors.black}}
                placeholder={strings('search')}
                value={search}
                onChangeText={(search) => this.setState({search})}
              />
            </Block>
          </Block>
          <Block paddingHorizontal={20}>
            <FlatList
              data={listTeamMembers}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItemUser}
            />
          </Block>
        </Block>
      </Block>
    );
  }
}

NewMessageScreen.defaultProps = {};

NewMessageScreen.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(NewMessageScreen);
