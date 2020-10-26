/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/FontAwesome5';
import {Colors} from 'App/Theme';
import {
  Button,
  Block,
  Text,
  Input,
  Header,
  DialogPrivacy,
  ButtonPrivacy,
} from '../../../Components';
import UserActions from '../../../Stores/User/Actions';
import TeamActions from '../../../Stores/Team/Actions';
import PostActions from '../../../Stores/Post/Actions';
import {strings} from '../../../Locate/I18n';
import {postService} from '../../../Services/PostService';
import {Privacy} from '../../..//Constants';
import {Screens} from '../../../Utils/screens';
import Style from './CreateAlbumScreenStyle';
import {Divider} from 'react-native-paper';

class CreateAlbumScreen extends Component {
  constructor(props) {
    super(props);

    this.dialogPrivacy = React.createRef();

    this.state = {
      privacyId: Privacy.PUBLIC,
      userInclude: [],
      albumName: '',
      albumDescription: '',
      isPosting: false,
    };
  }

  componentDidMount() {}

  onSelectedPrivacy = (privacyId, userInclude) => {
    this.setState({privacyId, userInclude});
  };

  onCreateAlbum = async () => {
    const {
      privacyId,
      userInclude,
      albumName,
      albumDescription,
      isPosting,
    } = this.state;
    const {navigation, profile} = this.props;

    if (isPosting) {
      return;
    }

    const data = {
      teamId: profile.activeTeam,
      postContent: albumName,
      postDescription: albumDescription,
      privacyId: privacyId,
      userInclude: userInclude,
    };

    this.setState({isPosting: true});
    postService.fetchCreateAlbum(data).then((response) => {
      if (response.success) {
        navigation.navigate(Screens.PHOTO_ALBUM);
        const {postId, postContent} = response.data;
        const album = {postId, postContent};
        if (navigation.state.params && navigation.state.params.onSelectAlbum) {
          navigation.state.params.onSelectAlbum(album);
        }

        return;
      }
      this.setState({isPosting: false});
    });
  };

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
    const disabled = !this.state.albumName;
    return (
      <Button
        style={{height: null}}
        color={null}
        status={disabled}
        onPress={this.onCreateAlbum}>
        <Text bold size={13.5} color={disabled ? Colors.gray2 : Colors.white}>
          {strings('save')}
        </Text>
      </Button>
    );
  };

  render() {
    const {privacyId, userInclude} = this.state;
    const {listTeamMembers} = this.props;

    return (
      <Block style={Style.view}>
        <Header
          leftIcon={this.renderLeftHeader()}
          title={strings('create_album')}
          rightIcon={this.renderRightHeader()}
        />
        <Block flex={false} padding={[16]} color={Colors.white}>
          <Input
            style={Style.inputAlbumName}
            value={this.state.albumName}
            placeholder={strings('album_name')}
            onChangeText={(text) => this.setState({albumName: text})}
          />
          <Divider />
          <Input
            style={Style.inputDescription}
            value={this.state.albumDescription}
            multiline={true}
            placeholder={strings('description')}
            onChangeText={(text) => this.setState({albumDescription: text})}
          />
        </Block>

        <Button
          style={Style.buttonPrivacy}
          color={Colors.white}
          activeOpacity={0.3}
          onPress={() =>
            this.dialogPrivacy.current?.open(privacyId, userInclude)
          }>
          <Block flex={false} row style={Style.containerPrivacy} center>
            <ButtonPrivacy
              style={{marginTop: 5, color: Colors.black}}
              disabled={true}
              privacyId={privacyId}
              userInclude={userInclude}
            />
            <Icon name={'chevron-right'} size={20} />
          </Block>
        </Button>

        <DialogPrivacy
          ref={this.dialogPrivacy}
          privacyId={privacyId}
          teamUsers={listTeamMembers}
          userInclude={userInclude}
          onSelected={this.onSelectedPrivacy}
        />
      </Block>
    );
  }
}

CreateAlbumScreen.defaultProps = {};

CreateAlbumScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
};

const mapStateToProps = (state) => ({
  profile: state.user.profile,
  team: state.team.team,
  listTeamMembers: state.team.listTeamMembers,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
  postActions: bindActionCreators(PostActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateAlbumScreen);
