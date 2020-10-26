/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Geolocation from '@react-native-community/geolocation';
import {Colors} from 'App/Theme';
import {
  Button,
  Block,
  Text,
  Input,
  Header,
  ImageCircle,
  DialogPrivacy,
  ButtonPrivacy,
  ModalNotifcation,
} from '../../../Components';
import UserActions from '../../../Stores/User/Actions';
import TeamActions from '../../../Stores/Team/Actions';
import {strings} from '../../../Locate/I18n';
import {postService} from '../../../Services/PostService';
import {Privacy, PostType} from '../../..//Constants';
import {Config} from '../../../Config';
import ResponsiveUtils from '../../../Utils/ResponsiveUtils';
import {Screens} from '../../../Utils/screens';
import Style from './PhotoAlbumScreenStyle';
import ImageItem from '../ImageItem';
import {getFileType} from '../../../Utils/commonFunction';
import TagInput from '../TagInput';

class PhotoAlbumScreen extends Component {
  constructor(props) {
    super(props);
    this.dialogPrivacy = React.createRef();

    const {navigation} = this.props;
    this.postDetail = navigation.getParam('postDetail', {postChild: []});
    this.privacyId = navigation.getParam('privacyId', Privacy.PUBLIC);
    this.userInclude = navigation.getParam('userInclude', []);
    this.listMedia = navigation.getParam('listMedia', []);

    this.state = {
      errorCode: '',
      enabledPost: false,
      postDetail: this.postDetail,
      privacyId: this.privacyId,
      userInclude: this.userInclude,
      hashTag: [],
      album: null,
      listMedia: this.listMedia,
      description: this.postDetail.postContent || '',
      location: this.postDetail.location || '',
      visibleDialogGallery: false,
      containerWidth: 0,
      isPosting: false,
      visibleNotice: false,
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

  onSelectedPrivacy = (privacyId, userInclude) => {
    this.setState({privacyId, userInclude});
  };

  addMoreMedia = () => {
    this.props.navigation.navigate(Screens.MEDIA_SELECT, {
      listMediaSelected: this.state.listMedia,
      addMoreMedia: this._onAddMoreMedia,
    });
  };

  _onAddMoreMedia = (listMedia) => {
    this.setState({listMedia});
    if(this.postDetail && this.postDetail.postId) {
      this.updatePostPhoto(listMedia);
    }
  };

  onPressAlbum = () => {
    this.props.navigation.navigate(Screens.SELECT_ALBUM, {
      onSelectAlbum: this._onSelectAlbum,
    });
  };

  _onSelectAlbum = (album) => {
    this.setState({album});
  };

  onPressMedia = (index) => {
    const {listMedia} = this.state;
    const data = {
      postChild: this.postDetail && this.postDetail.postChild,
      listMedia,
      mediaIndex: index,
      onChangeMedia: this._onChangeMedia,
    };
    this.props.navigation.navigate(Screens.PREVIEW_ALBUM, data);
  };

  _onChangeMedia = (listMedia) => {
    this.setState({listMedia});
  };

  onDeleteMedia = (index) => {
    const {listMedia} = this.state;
    const {profile} = this.props;
    const mediaDelete = listMedia[index];

    if (!isNaN(index)) {
      listMedia.splice(index, 1);
    }

    if(mediaDelete.image) {
      postService.deletePhoto({
        teamId: profile.activeTeam,
        postId: mediaDelete.image.postId,
      });
    }

    this.setState({listMedia});
  };

  onTagUsers = (userTag) => {
    this.setState({userTag});
  };

  getCurrentLocation = () => {
    // Geolocation.getCurrentPosition(info => console.log(info));
  };

  createPostPhoto = async () => {
    const {
      privacyId,
      userInclude,
      postDetail,
      album,
      listMedia,
      description,
      location,
      isPosting,
    } = this.state;
    const {navigation, profile} = this.props;
    const teamId = profile.activeTeam;

    if (isPosting) {
      return;
    }

    const formData = new FormData();
    let postChild = [];
    listMedia.forEach((media) => {
      if(!media.image.uri.includes('http')) {
        const file = {
          uri: media.image.uri,
          name: media.image.filename,
          type: getFileType(media.image),
        };
        formData.append('files', file);
      }
      postChild.push({
        postContent: '',
        postDescription: media.description || '',
        privacyId: privacyId,
        locale: location,
        userTag: media.userTag || [],
      });
    });

    const albumId = album && album.postId;
    const infoString = {
      hashTag: [],
      postId: postDetail.postId || albumId,
      locale: location,
      location: location,
      postContent: description,
      postDescription: '',
      postType: albumId ? null : PostType.POST_PHOTO,
      privacyId: privacyId,
      teamId: teamId,
      userInclude: userInclude,
      userTag: [],
      postChild: postChild,
    };
    formData.append('infoString', JSON.stringify(infoString));

    this.setState({isPosting: true});
    if (postDetail.postId) {
      postService.updatePhotoAlbum(infoString).then((response) => {
        if (response.success) {
          navigation.goBack();
          navigation.navigate(Screens.NOW);
        } else {
          this.setState({visibleNotice: true});
        }
        this.setState({isPosting: false});
      });
      return;
    }

    postService.postPhotoAlbum(formData).then((response) => {
      if (response.success) {
        navigation.goBack();
        navigation.navigate(Screens.NOW);
      } else {
        this.setState({visibleNotice: true});
      }
      this.setState({isPosting: false});
    });
  };

  updatePostPhoto(listMedia) {
    const {
      privacyId,
      userInclude,
      hashTag,
      postDetail,
      album,
      description,
      location,
      isPosting,
    } = this.state;
    const {profile} = this.props;
    const teamId = profile.activeTeam;

    if (isPosting) {
      return;
    }

    const formData = new FormData();
    let postChild = [];
    listMedia.forEach((media) => {
      if(!media.image.uri.includes('http')) {
        const file = {
          uri: media.image.uri,
          name: media.image.filename,
          type: getFileType(media.image),
        };
        formData.append('files', file);
        postChild.push({
          postContent: '',
          postDescription: media.description || '',
          privacyId: privacyId,
          locale: location,
          userTag: media.userTag || [],
        });
      }
    });

    const albumId = album && album.postId;
    const infoString = {
      hashTag: hashTag,
      postId: postDetail.postId || albumId,
      locale: location,
      location: location,
      postContent: description,
      postDescription: '',
      postType: albumId ? null : PostType.POST_PHOTO,
      privacyId: privacyId,
      teamId: teamId,
      userInclude: userInclude,
      userTag: [],
      postChild: postChild,
    };
    formData.append('infoString', JSON.stringify(infoString));

    this.setState({isPosting: true});
    postService.postPhotoAlbum(formData).then((response) => {
      this.setState({isPosting: false});
      if (!response.success) {
        this.setState({visibleNotice: true});
      }
    });
  }

  renderLeftHeader = () => {
    return (
      <Button
        style={{height: null}}
        color={null}
        onPress={() => this.props.navigation.goBack()}>
        <Text size={13.5} color={Colors.white}>
          {strings('cancel')}
        </Text>
      </Button>
    );
  };

  renderRightHeader = () => {
    const disabled = !(this.state.listMedia.length > 0) || this.state.isPosting;
    return (
      <Button
        style={{height: null}}
        color={null}
        status={disabled}
        onPress={this.createPostPhoto}>
        <Text bold size={13.5} color={disabled ? Colors.gray2 : Colors.white}>
          {strings('post')}
        </Text>
      </Button>
    );
  };

  render() {
    const {
      privacyId,
      userInclude,
      hashTag,
      album,
      listMedia,
      description,
      location,
      containerWidth,
      visibleNotice,
    } = this.state;
    const {profile, listTeamMembers} = this.props;

    const imageMargin = 5;
    const imageSize = (containerWidth - imageMargin * 2) / 3;

    return (
      <Block style={Style.view}>
        <Header
          leftIcon={this.renderLeftHeader()}
          title={strings('photos_albums')}
          rightIcon={this.renderRightHeader()}
        />
        <Block flex={false} margin={[16]}>
          <Block flex={false} row center>
            <ImageCircle
              source={{uri: Config.GET_IMAGE_URL + profile.userAvatar}}
              style={{marginTop: 0}}
              size={58}
            />
            <Block column margin={[0, 0, 0, 8]}>
              <Text style={{marginLeft: 0}} size={16} color={Colors.black} bold>
                {profile.userFullName}
              </Text>
              <ButtonPrivacy
                style={{borderWidth: 1}}
                margin={[5, 0, 0, 0]}
                privacyId={privacyId}
                userInclude={userInclude}
                onPress={() =>
                  this.dialogPrivacy.current?.open(privacyId, userInclude)
                }
              />
            </Block>
          </Block>
        </Block>
        <ScrollView>
          <Block flex={false} color={Colors.white} padding={[15]}>
            <Block
              flex={false}
              row
              card
              border
              style={{justifyContent: 'flex-end'}}>
              <Button
                style={{marginVertical: 0, height: null}}
                onPress={this.onPressAlbum}>
                <Block
                  flex={false}
                  card
                  border
                  row
                  style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    alignItems: 'center',
                  }}
                  padding={[0, 8, 0, 8]}
                  center>
                  {album ? (
                    <MaterialIcons
                      name={'photo-album'}
                      size={15}
                      style={{transform: [{rotate: '150deg'}]}}
                    />
                  ) : (
                    <Icon name={'plus'} size={14} />
                  )}
                  <Text style={{marginLeft: 10}}>
                    {album ? album.postContent : strings('album')}
                  </Text>
                  <Icon
                    name={'sort-down'}
                    style={{marginLeft: 10, marginBottom: 8}}
                    size={20}
                  />
                </Block>
              </Button>
            </Block>

            <Block flex={false}>
              <TagInput
                ref={this.tagInput}
                styleContainer={{paddingTop: 10, paddingHorizontal: 0}}
                styleInput={{paddingVertical: 0}}
                placeholder={`#${strings('hashtag')}`}
                placeholderTextColor={Colors.gray5}
                allTags={[]}
                hashTag={hashTag}
              />
              <Input
                style={{
                  paddingTop: 5,
                  marginBottom: 15,
                  color: Colors.black,
                  height: null,
                  borderWidth: null,
                }}
                value={description}
                placeholder={strings('write_something')}
                onChangeText={(text) => {
                  this.setState({description: text});
                }}
              />
            </Block>

            <Block
              flex={false}
              center
              onLayout={(event) =>
                this.setState({containerWidth: event.nativeEvent.layout.width})
              }>
              {listMedia.length > 0 && (
                <ImageItem
                  style={{
                    width: containerWidth,
                    height: ResponsiveUtils.height(204),
                  }}
                  uri={listMedia[0].image.uri}
                  type={listMedia[0].type}
                  repeat={false}
                  onDeleted={() => this.onDeleteMedia(0)}
                  onPress={() => this.onPressMedia(0)}
                />
              )}
            </Block>
            {listMedia.length > 1 && (
              <Block
                flex={false}
                row
                height={imageSize}
                marginTop={imageMargin}>
                {listMedia.map((item, index) => {
                  if (index > 0 && index < 4) {
                    return (
                      <Block
                        flex={1}
                        row
                        margin={[0, 0, 0, index > 1 ? imageMargin : 0]}
                        key={index}>
                        <ImageItem
                          key={index}
                          style={{width: '100%', height: imageSize}}
                          uri={item.image.uri}
                          type={item.type}
                          repeat={false}
                          onDeleted={() => this.onDeleteMedia(index)}
                          onPress={() => this.onPressMedia(index)}
                        />
                      </Block>
                    );
                  } else if (index == 4) {
                    return (
                      <Button
                        key={index}
                        style={{marginVertical: 0, height: null}}
                        onPress={() => this.onPressMedia(3)}>
                        <Block
                          absolute
                          color={'#00000084'}
                          style={{
                            width: imageSize,
                            height: imageSize,
                            top: 0,
                            right: 0,
                            justifyContent: 'center',
                          }}
                          center>
                          <Text color={Colors.white} size={24}>
                            +{listMedia.length - 4}
                          </Text>
                        </Block>
                      </Button>
                    );
                  }
                })}
              </Block>
            )}

            <Button
              style={{height: 40, alignItems: 'center', marginTop: 20}}
              color={Colors.gray15}
              onPress={this.addMoreMedia}>
              <Icon name={'plus'} color={Colors.gray9} />
            </Button>

            <Block
              flex={false}
              row
              card
              border
              style={{justifyContent: 'flex-end', marginTop: 0}}>
              <Input
                style={{
                  height: null,
                  paddingVertical: 10,
                  color: Colors.black,
                  borderWidth: null,
                }}
                value={location}
                placeholder={strings('add_location')}
                onChangeText={(text) => this.setState({location: text})}
              />
            </Block>
            <Block
              flex={false}
              row
              card
              border
              style={{justifyContent: 'flex-end', marginTop: 10}}>
              <Button
                style={{marginVertical: 0, height: null}}
                onPress={this.getCurrentLocation}>
                <Block
                  flex={false}
                  card
                  border
                  row
                  style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    alignItems: 'center',
                  }}
                  padding={[5, 8, 5, 8]}
                  center>
                  <Icon name={'map-marker-alt'} size={14} />
                  <Text style={{marginLeft: 10}}>{strings('location')}</Text>
                </Block>
              </Button>
            </Block>
          </Block>
        </ScrollView>

        <DialogPrivacy
          ref={this.dialogPrivacy}
          privacyId={privacyId}
          teamUsers={listTeamMembers}
          userInclude={userInclude}
          onSelected={this.onSelectedPrivacy}
        />

        <ModalNotifcation
          isOpen={visibleNotice}
          message={'Create Post failed!'}
          onAccept={() => this.setState({visibleNotice: false})}
        />
      </Block>
    );
  }
}

PhotoAlbumScreen.defaultProps = {};

PhotoAlbumScreen.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(PhotoAlbumScreen);
