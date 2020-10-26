/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Divider} from 'react-native-paper';
import Swiper from 'react-native-swiper';
import {Colors} from 'App/Theme';
import {Button, Block, Text, Input, Header, Media} from '../../../Components';
import UserActions from '../../../Stores/User/Actions';
import TeamActions from '../../../Stores/Team/Actions';
import {strings} from '../../../Locate/I18n';
import {postService} from '../../../Services/PostService';
import Style from './PreviewAlbumScreenStyle';
import DialogTagUser from '../DialogTagUser';

class PreviewAlbumScreen extends Component {
  constructor(props) {
    super(props);

    this.dialogTagUser = React.createRef();

    const {navigation} = this.props;

    const listMedia = navigation.getParam('listMedia', []);
    const mediaIndex = navigation.getParam('mediaIndex', 0);
    this.postChild = navigation.getParam('postChild', []);
    this.isEditable = navigation.getParam('isEditable', true);

    this.state = {
      listMedia: listMedia,
      mediaIndex: mediaIndex,
      userTag: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {profile, team} = nextProps;
    if (profile != prevState.profile || team != prevState.team) {
      return {profile, team};
    }

    return null;
  }

  componentDidMount() {}

  onChangeDescriptions = (description) => {
    const {listMedia, mediaIndex} = this.state;
    const {navigation} = this.props;
    listMedia[mediaIndex].description = description;
    this.setState({listMedia});

    const postChild = this.postChild[mediaIndex];
    if(postChild.postId) {
      postChild.postDescription = description;

      if (navigation.state.params && navigation.state.params.onChangeMedia) {
        navigation.state.params.onChangeMedia(listMedia);
      }
    }
  };

  onTagUsers = (userTag) => {
    const {listMedia, mediaIndex} = this.state;
    const {navigation} = this.props;
    listMedia[mediaIndex].userTag = userTag;
    this.setState({listMedia});
    
    // Edit post
    const postChild = this.postChild[mediaIndex];
    if(postChild.postId) {
      postChild.userTag = userTag;
      postService.updatePhotoAlbum(postChild);

      if (navigation.state.params && navigation.state.params.onChangeMedia) {
        navigation.state.params.onChangeMedia(listMedia);
      }
    }
  };

  onDeleteMedia = () => {
    let {listMedia, mediaIndex} = this.state;
    const {navigation, profile} = this.props;
    const mediaDelete = listMedia[mediaIndex];

    listMedia.splice(mediaIndex, 1);
    if (mediaIndex > listMedia.length - 1 && listMedia.length > 0) {
      mediaIndex = listMedia.length - 1;
    }
    this.setState({listMedia, mediaIndex});

    if(mediaDelete.image && mediaDelete.image.uri.includes('http')) {
      postService.deletePhoto({
        teamId: profile.activeTeam,
        postId: mediaDelete.image.postId,
      });

      if (navigation.state.params && navigation.state.params.onChangeMedia) {
        navigation.state.params.onChangeMedia(listMedia);
      }
    }
  };

  onDeleteUserTag = (userId) => {
    const {listMedia, mediaIndex} = this.state;
    const userTag = listMedia[mediaIndex].userTag;
    for (let index = 0; index < userTag.length; index++) {
      const user = userTag[index];
      if (user.userId == userId) {
        userTag.splice(index, 1);
        break;
      }
    }
    this.setState({listMedia});

    // Edit post
    const postChild = this.postChild[mediaIndex];
    if(postChild.postId) {
      postChild.userTag = userTag;
      postService.updatePhotoAlbum(postChild);

      if (navigation.state.params && navigation.state.params.onChangeMedia) {
        navigation.state.params.onChangeMedia(listMedia);
      }
    }
  };

  onBlurDescription = () => {
    const {mediaIndex} = this.state;
    const postChild = this.postChild[mediaIndex];
    postService.updatePhotoAlbum(postChild);
  }

  onDone = () => {
    const {navigation} = this.props;
    if (navigation.state.params && navigation.state.params.onChangeMedia) {
      navigation.state.params.onChangeMedia(this.state.listMedia);
    }
    navigation.goBack();
  };

  renderRightHeader = () => {
    return (
      <Button style={{height: null}} color={null} onPress={this.onDone}>
        <Text bold size={13.5} color={Colors.white}>
          {strings('done')}
        </Text>
      </Button>
    );
  };

  renderHeaderImageViewer = () => {
    return (
      <Block
        flex={false}
        row
        style={{justifyContent: 'space-between', height: 50}}
        center>
        <Button
          style={{marginVertical: 0, height: null, paddingHorizontal: 8}}
          onPress={this.onDeleteMedia}>
          <Ionicons name={'md-close'} color={'white'} size={32} />
        </Button>
        <Button
          style={{marginVertical: 0, height: null, paddingHorizontal: 10}}
          onPress={() => this.dialogTagUser.current?.open()}>
          <Icon name={'tags'} color={'white'} size={19} />
        </Button>
      </Block>
    );
  };

  renderIndicator = () => {
    return (
      <Block
        flex={false}
        row
        style={{justifyContent: 'center', paddingVertical: 10}}>
        {this.state.listMedia.map((item, index) => (
          <Block
            key={index}
            flex={false}
            style={Style.dot}
            color={
              this.state.mediaIndex == index ? Colors.white : Colors.gray18
            }
          />
        ))}
      </Block>
    );
  };

  render() {
    const {listMedia, mediaIndex} = this.state;
    const {navigation, listTeamMembers} = this.props;
    let description = '';
    let userTag = [];
    if (listMedia[mediaIndex]) {
      description = listMedia[mediaIndex].description || '';
      userTag = listMedia[mediaIndex].userTag || [];
    }

    return (
      <Block style={Style.view}>
        <Header
          isShowBack
          navigation={navigation}
          title={strings('preview')}
          rightIcon={this.renderRightHeader()}
        />
        <Block color={Colors.white}>
          {this.isEditable || description ? (
            <Input
              style={Style.inputDescription}
              value={description}
              placeholder={strings('description')}
              onChangeText={this.onChangeDescriptions}
              onBlur={this.onBlurDescription}
              editable={this.isEditable}
            />
          ) : null}
          <Divider marginTop={0} />
          <Block color={Colors.black}>
            {this.isEditable ? this.renderHeaderImageViewer() : null}
            <Swiper
              loop={false}
              dot={null}
              index={mediaIndex}
              dotColor={Colors.transparent}
              activeDotColor={Colors.transparent}
              onIndexChanged={(index) => this.setState({mediaIndex: index})}>
              {listMedia.map((media, index) => {
                return (
                  <Block key={index}>
                    <Media
                      style={{width: '100%', height: '100%'}}
                      type={media.type}
                      source={{uri: media.image.uri}}
                      resizeMode={'contain'}
                      // repeat={false}
                      controls={true}
                    />
                  </Block>
                );
              })}
            </Swiper>
            <Block flex={false} color={Colors.black}>
              <Block
                flex={false}
                marginHorizontal={10}
                row
                center
                style={{flexWrap: 'wrap'}}>
                {userTag.length > 0 && (
                  <Text color={Colors.white}>{strings('with')} </Text>
                )}
                {userTag.map((user, index) => {
                  return (
                    <Block flex={false} row key={index}>
                      <TouchableOpacity
                        disabled={!this.isEditable}
                        onPress={() => this.onDeleteUserTag(user.userId)}>
                        <Text
                          style={{
                            textDecorationLine: 'underline',
                            paddingVertical: 3,
                          }}
                          color={Colors.white}
                          size={15}>
                          {user.userFullName}
                        </Text>
                      </TouchableOpacity>
                      {index < userTag.length - 1 && (
                        <Text
                          style={{paddingVertical: 3}}
                          color={Colors.white}
                          size={15}>
                          {', '}
                        </Text>
                      )}
                    </Block>
                  );
                })}
              </Block>
            </Block>
            {this.renderIndicator()}
          </Block>
        </Block>

        <DialogTagUser
          ref={this.dialogTagUser}
          listUsers={listTeamMembers}
          onSelected={this.onTagUsers}
        />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

PreviewAlbumScreen.defaultProps = {};

PreviewAlbumScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
};

const mapStateToProps = (state) => ({
  profile: state.user.profile,
  team: state.team.team,
  listTeamMembers: state.team.listTeamMembers,
  postDetail: state.post.postDetail,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PreviewAlbumScreen);
