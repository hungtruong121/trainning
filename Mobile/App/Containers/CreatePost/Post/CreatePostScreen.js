/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-did-mount-set-state */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {Platform, KeyboardAvoidingView, ImageBackground} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {
  Button,
  Block,
  Text,
  Header,
  ImageCircle,
  DialogPrivacy,
  ModalNotifcation,
  ButtonPrivacy,
} from '../../../Components';
import UserActions from '../../../Stores/User/Actions';
import TeamActions from '../../../Stores/Team/Actions';
import {Colors} from 'App/Theme';
import PostActions from '../../../Stores/Post/Actions';
import {savePrivacy} from '../../../Utils/storage.helper';
import {strings} from '../../../Locate/I18n';
import Style from './CreatePostScreenStyle';
import {Privacy, PostType} from '../../..//Constants';
import TagInput from '../TagInput';
import TagUser from '../TagUser';
import {Config} from '../../../Config';

import {RichEditor, RichToolbar} from '../RichEditor';
import {postService} from '../../../Services/PostService';
import {fileService} from '../../../Services/FileService';
import ResponsiveUtils from '../../../Utils/ResponsiveUtils';
import {Screens} from '../../../Utils/screens';

class CreatePostScreen extends Component {
  constructor(props) {
    super(props);
    this.tagInput = React.createRef();
    this.tagUser = React.createRef();
    this.richText = React.createRef();
    this.dialogPrivacy = React.createRef();

    const {navigation} = this.props;

    this.privacyId = navigation.getParam('privacyId', Privacy.PUBLIC);
    this.userInclude = navigation.getParam('userInclude', []);
    this.postDetail = navigation.getParam('postDetail');
    if (this.postDetail) {
      this.contentStyle = this.getContentStyle(
        this.postDetail.postContent,
        this.postDetail.backgroundImage || this.postDetail.backgroundDefault,
      );
      this.textColorEditor =
        this.postDetail.backgroundImage || this.postDetail.backgroundDefault
          ? Colors.white
          : Colors.black;
    }

    this.state = {
      errorCode: '',
      enabledPost: false,
      privacyId: this.privacyId,
      userInclude: this.userInclude,
      html: '',
      bgColorInput: undefined,
      backgroundImage: null,
      backgroundDefault: null,
      textColorEditor: this.textColorEditor || Colors.black,
      contentStyle: this.contentStyle || {fontSize: 15, textAlign: 'left'},
      tagFontSize: 15,
      tagColor: Colors.tagname,
      allTags: [],
      hashTag: [],
      userTag: [],
      selectedItems: {
        bold: false,
        underline: false,
        italic: false,
      },
      isPosting: false,
      visibleDialogGallery: false,
      visibleNotice: false,
    };

    this.getHashTags();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {profile, team, teamActions} = nextProps;
    if (profile != prevState.profile || team != prevState.team) {
      if (profile) {
        teamActions.fetchTeamMembers(profile.activeTeam, '');
      }
      return {profile, team};
    }

    return null;
  }

  componentDidMount() {
    if (this.postDetail) {
      this.setState({
        enabledPost: this.postDetail.postContent ? true : false,
        privacyId: this.postDetail.privacyId,
        html: this.postDetail.postContent,
        userInclude: this.postDetail.userInclude || [],
        backgroundImage: this.postDetail.backgroundImage,
        backgroundDefault: this.postDetail.backgroundDefault,
        hashTag: this.postDetail.hashTag || [],
        userTag: this.postDetail.userTag || [],
      });
    }
  }

  onEditorInitialized = () => {
    this.richText.current?.setContentStyle(this.state.contentStyle);
    this.richText.current?.registerToolbar(items => {
      const selectedItems = {
        bold: false,
        underline: false,
        italic: false,
      };
      items.map(item => (selectedItems[item] = true));
      this.setState({selectedItems});
    });
  };

  onMessageEditor = async () => {
    await this.convertTextFromClipboard();
  };

  convertTextFromClipboard = async () => {
    const clipboardContent = await Clipboard.getString();
    const textConvert = this.convertHtmlToPlainText(clipboardContent);
    await Clipboard.setString(textConvert);
  };

  getContentHtml = async () => {
    let html = await this.richText.current?.getContentHtml();
    return html;
  };

  setBold = () => {
    const {selectedItems} = this.state;
    this.setState({
      selectedItems: {...selectedItems, bold: !selectedItems.bold},
    });
    this.richText.current._sendAction('bold', 'result');
  };

  setUnderLine = () => {
    const {selectedItems} = this.state;
    this.richText.current._sendAction('underline', 'result');
    this.setState({
      selectedItems: {...selectedItems, underline: !selectedItems.underline},
    });
  };

  setItalic = () => {
    const {selectedItems} = this.state;
    this.setState({
      selectedItems: {...selectedItems, italic: !selectedItems.italic},
    });
    this.richText.current._sendAction('italic', 'result');
  };

  onChangePrivacy = (privacyId, userInclude) => {
    this.setState({privacyId, userInclude});
    savePrivacy(privacyId);
  };

  onTagUsers = listUsers => {
    this.tagUser.current?.setTags(listUsers);
  };

  onTagUser = () => {
    const userTag = this.tagUser.current?.getTags();
    this.setState({userTag});
  };

  onChangeEditor = html => {
    const {backgroundImage, backgroundDefault} = this.state;
    if (html == '<br>') {
      html = '';
      this.richText.current?.setContentHTML(html);
    }

    const enabledPost = Boolean(html && html.length > 0);
    this.setState({html, enabledPost});
    this.handleFontSize(html, backgroundImage || backgroundDefault);
  };

  onChangeImageBG = image => {
    const {html} = this.state;
    const plainText = this.convertHtmlToPlainText(html);

    this.handleFontSize(html, image);
    if (image && plainText.length <= 215) {
      if (image.uri) {
        this.setState({
          backgroundImage: image,
          backgroundDefault: null,
        });
      } else {
        this.setState({
          backgroundImage: null,
          backgroundDefault: image,
        });
      }

      this.setState({
        textColorEditor: Colors.white,
        tagColor: Colors.white,
      });
      return;
    }

    this.removeImageBackground();
  };

  removeImageBackground = () => {
    this.setState({
      backgroundImage: null,
      backgroundDefault: null,
      textColorEditor: Colors.black,
      tagColor: Colors.tagname,
    });
  };

  handleFontSize = (html, backgroundImage) => {
    const contentStyle = this.getContentStyle(html, backgroundImage);
    this.richText.current?.setContentStyle(contentStyle);
    this.setState({contentStyle});
  };

  getContentStyle = (html, backgroundImage) => {
    let fontSize = 15,
      textAlign = 'left';
    if (backgroundImage) {
      const plainText = this.convertHtmlToPlainText(html);
      if (plainText.length > 215) {
        this.removeImageBackground();
      } else if (plainText.length > 125) {
        fontSize = 20;
        textAlign = 'center';
      } else {
        fontSize = 25;
        textAlign = 'center';
      }
    }

    return {fontSize, textAlign};
  };

  convertHtmlToPlainText(html) {
    html = html.replace(/<style([\s\S]*?)<\/style>/gi, '');
    html = html.replace(/<script([\s\S]*?)<\/script>/gi, '');
    html = html.replace(/<\/div>/gi, '\n');
    html = html.replace(/<\/li>/gi, '\n');
    html = html.replace(/<li>/gi, '  *  ');
    html = html.replace(/<\/ul>/gi, '\n');
    html = html.replace(/<\/p>/gi, '\n');
    html = html.replace(/<br\s*[\/]?>/gi, '\n');
    html = html.replace(/<[^>]+>/gi, '');
    html = html.replace('&nbsp;', '');
    return html;
  }

  getHashTags = () => {
    const {profile} = this.props;
    const teamId = profile.activeTeam;
    const keyword = '';

    postService.getHashTags(teamId, keyword).then(response => {
      const allTags = response.data;
      if (allTags) {
        this.setState({allTags});
      }
    });
  };

  createPost = async () => {
    const {
      privacyId,
      bgColorInput,
      backgroundImage,
      backgroundDefault,
      contentStyle,
      userInclude,
      hashTag,
      html,
      userTag,
    } = this.state;
    const {navigation, profile, userActions} = this.props;

    const teamId = profile.activeTeam;
    let backgroundImageId;

    if (backgroundImage) {
      if (!isNaN(backgroundImage)) {
        backgroundImageId = backgroundImage;
      } else {
        const response = await fileService.uploadImage(backgroundImage);
        if (response.success) {
          backgroundImageId = response.data[0].uploadId;
        }
      }
    }

    const data = {
      postId: this.postDetail && this.postDetail.postId,
      teamId: teamId,
      postType: PostType.POST_NORMAL,
      postContent: html,
      privacyId: privacyId,
      backgroundColor: bgColorInput,
      backgroundImage: backgroundImageId,
      backgroundDefault: backgroundDefault,
      postContentFontSize: contentStyle.fontSize,
      hashTag: hashTag,
      userInclude: userInclude,
      userTag: userTag,
    };

    this.setState({isPosting: true});
    postService.createPost(data).then(response => {
      this.setState({isPosting: false});
      if (response.success) {
        savePrivacy(privacyId);
        userActions.fetchPersonalRelatedPost(profile.userId);
        navigation.goBack();
        navigation.navigate(Screens.NOW);
      } else {
        this.setState({visibleNotice: true});
      }
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
    const disabled = !this.state.enabledPost || this.state.isPosting;
    return (
      <Button
        style={{height: null}}
        color={null}
        status={disabled}
        onPress={this.createPost}>
        <Text bold size={13.5} color={disabled ? Colors.gray2 : Colors.white}>
          {strings('post')}
        </Text>
      </Button>
    );
  };

  render() {
    const {
      privacyId,
      allTags,
      tagFontSize,
      tagColor,
      hashTag,
      html,
      userTag,
      contentStyle,
      textColorEditor,
      backgroundImage,
      userInclude,
      backgroundDefault,
      visibleNotice,
    } = this.state;
    const {profile, team, listTeamMembers} = this.props;

    let bgPostContent = null;
    if (backgroundDefault) {
      bgPostContent = backgroundDefault;
    } else if (backgroundImage) {
      if (!isNaN(backgroundImage)) {
        bgPostContent = {uri: Config.GET_IMAGE_URL + backgroundImage};
      } else if (backgroundImage.uri) {
        bgPostContent = {uri: backgroundImage.uri};
      }
    }

    return (
      <Block style={Style.view}>
        <Header
          leftIcon={this.renderLeftHeader()}
          title={team.teamName}
          rightIcon={this.renderRightHeader()}
        />
        <Block margin={[16]}>
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
                privacyId={privacyId}
                userInclude={userInclude}
                onPress={() =>
                  this.dialogPrivacy.current?.open(privacyId, userInclude)
                }
              />
            </Block>
          </Block>

          <ImageBackground
            style={{
              resizeMode: 'cover',
              justifyContent: 'center',
              marginTop: 20,
            }}
            source={bgPostContent}>
            <Block
              flex={false}
              color={bgPostContent ? Colors.opacity : null}
              height={ResponsiveUtils.height(250)}>
              <TagInput
                style={{fontSize: tagFontSize}}
                ref={this.tagInput}
                placeholder={`#${strings('hashtag')}`}
                allTags={allTags}
                hashTag={hashTag}
                placeholderTextColor={Colors.gray5}
                styleInput={{color: textColorEditor}}
              />
              <RichEditor
                style={{backgroundColor: null}}
                editorStyle={{
                  backgroundColor: null,
                  color: textColorEditor,
                  contentCSSText: `font-size: ${contentStyle.fontSize}px;`,
                }}
                ref={this.richText}
                placeholder={strings('what_are_you_thinking')}
                initialContentHTML={html}
                scrollEnabled={true}
                onChange={this.onChangeEditor}
                onMessage={this.onMessageEditor}
                editorInitializedCallback={() => this.onEditorInitialized()}
              />
              <TagUser
                style={{fontSize: tagFontSize, tagColor: tagColor}}
                ref={this.tagUser}
                placeholder={`@${strings('tagname')}`}
                listUsers={listTeamMembers}
                users={userTag}
                placeholderTextColor={Colors.gray5}
                styleInput={{color: textColorEditor}}
                onTag={this.onTagUser}
              />
            </Block>
          </ImageBackground>
        </Block>

        <DialogPrivacy
          ref={this.dialogPrivacy}
          privacyId={privacyId}
          teamUsers={listTeamMembers}
          userInclude={userInclude}
          onSelected={this.onChangePrivacy}
        />

        <ModalNotifcation
          isOpen={visibleNotice}
          message={strings('create_post_failed')}
          onAccept={() => this.setState({visibleNotice: false})}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <RichToolbar
            margin={[0, 16, 8, 16]}
            selectedItems={this.state.selectedItems}
            teamUsers={listTeamMembers}
            onBold={this.setBold}
            onUnderline={this.setUnderLine}
            onItalic={this.setItalic}
            onChangeImageBG={this.onChangeImageBG}
            onTagUsers={this.onTagUsers}
          />
        </KeyboardAvoidingView>
      </Block>
    );
  }
}

CreatePostScreen.defaultProps = {};

CreatePostScreen.propTypes = {
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
  postActions: bindActionCreators(PostActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreatePostScreen);
