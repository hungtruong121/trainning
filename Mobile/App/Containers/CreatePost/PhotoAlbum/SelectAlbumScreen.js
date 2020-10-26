/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Colors} from 'App/Theme';
import {Button, Block, Text, Header, ButtonPrivacy} from '../../../Components';
import UserActions from '../../../Stores/User/Actions';
import TeamActions from '../../../Stores/Team/Actions';
import {strings} from '../../../Locate/I18n';
import {postService} from '../../../Services/PostService';
import {Config} from '../../../Config';
import {Screens} from '../../../Utils/screens';
import Style from './SelectAlbumScreenStyle';
import {FlatList} from 'react-native-gesture-handler';
import {Divider} from 'react-native-paper';

class SelectAlbumScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listAlbums: [],
    };
  }

  componentDidMount() {
    this.getListAlbum();
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      this.getListAlbum();
    });
  }

  getListAlbum = () => {
    const {profile} = this.props;
    postService.fetchListAlbum(profile.activeTeam).then(response => {
      if (response.success) {
        this.setState({listAlbums: response.data || []});
      }
    });
  };

  createAlbum = () => {
    const {navigation} = this.props;
    navigation.navigate(Screens.CREATE_ALBUM, {
      onSelectAlbum: this.onSelectAlbum,
    });
  };

  onSelectAlbum = album => {
    const {navigation} = this.props;
    if (navigation.state.params && navigation.state.params.onSelectAlbum) {
      navigation.state.params.onSelectAlbum(album);
    }
    navigation.goBack();
  };

  componentWillUnmount() {
    if (this.focusListener) {
      this.focusListener.remove();
    }
  }

  renderLeftHeader = () => {
    return (
      <Button
        style={{height: null}}
        color={null}
        onPress={() => this.onSelectAlbum()}>
        <Icon name={'times'} color={Colors.white} size={17} />
      </Button>
    );
  };

  renderRightHeader = () => {
    return (
      <Button style={{height: null}} color={null} onPress={this.createAlbum}>
        <Icon name={'plus'} color={Colors.white} size={17} />
      </Button>
    );
  };

  renderItemAlbum = ({item, index}) => {
    const {team} = this.props;
    return (
      <TouchableOpacity onPress={() => this.onSelectAlbum(item)}>
        <Block flex={false} row center marginTop={10}>
          <Image
            source={{
              uri:
                Config.GET_IMAGE_URL +
                (item.createdByAvatar || team.teamAvatar),
            }}
            style={{width: 90, height: 90}}
          />
          <Block column margin={[0, 0, 0, 15]} height={105}>
            <Text style={{marginTop: 2}} size={14} color={Colors.black}>
              {item.postContent}
            </Text>
            <Text style={{marginTop: 8}} size={13} color={Colors.gray9}>
              {`${item.numberOfPhotos} ${strings(
                'photos',
              ).toLocaleLowerCase()} - ${item.numberOfVideos} ${strings(
                'videos',
              ).toLocaleLowerCase()}`}
            </Text>
            <ButtonPrivacy
              disabled
              style={{marginTop: 10}}
              privacyId={item.privacyId}
              userInclude={item.userInclude}
            />
            <Divider marginTop={0} />
          </Block>
        </Block>
      </TouchableOpacity>
    );
  };

  render() {
    const {listAlbums} = this.state;

    return (
      <Block style={Style.view}>
        <Header
          leftIcon={this.renderLeftHeader()}
          title={strings('select_album')}
          rightIcon={this.renderRightHeader()}
        />
        <Block margin={[0, 15, 15, 15]}>
          <FlatList
            data={listAlbums}
            renderItem={this.renderItemAlbum}
            keyExtractor={(item, index) => index.toString()}
          />
        </Block>
      </Block>
    );
  }
}

SelectAlbumScreen.defaultProps = {};

SelectAlbumScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
};

const mapStateToProps = state => ({
  profile: state.user.profile,
  team: state.team.team,
  listTeamMembers: state.team.listTeamMembers,
  postDetail: state.post.postDetail,
});

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectAlbumScreen);
