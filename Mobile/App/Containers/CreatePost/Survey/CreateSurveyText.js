/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {Colors} from 'App/Theme';
import {Button, Block, Text, Input} from '../../../Components';
import UserActions from '../../../Stores/User/Actions';
import PostActions from '../../../Stores/Post/Actions';
import {strings} from '../../../Locate/I18n';
import {StyleSheet} from 'react-native';
import TagInput from '../TagInput';

export default class CreateSurveyText extends React.Component {
  constructor(props) {
    super(props);
    this.scrollView = React.createRef();
    this.dialogPrivacy = React.createRef();

    this.state = {
      errorCode: '',
      hashTag: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {hashTag} = nextProps;
    if (hashTag != prevState.hashTag) {
      return {hashTag};
    }

    return null;
  }

  componentDidMount() {}

  onSelectedPrivacy = (privacyId, userInclude) => {
    this.setState({privacyId, userInclude});
  };

  onPressBackground = () => {};

  onAddLocation = () => {};

  onSetTimeClosing = () => {};

  onChangeContent = (content) => {
    if(this.props.onChangeContent){
      this.props.onChangeContent(content);
    }
  };

  removeTag = (index) => {
    const hashTag = this.state.hashTag;
    if (hashTag.length > 0) {
      if (index >= 0 && index < hashTag.length) {
        hashTag.splice(index, 1);
        this.setState({hashTag});
      } else {
        const text = hashTag.pop();
        this.setState({hashTag, text});
      }
    }
  };

  getHashTag() {
    return this.state.hashTag;
  };

  render() {
    const {hashTag} = this.state;
    const {inputStyle, content, ...props} = this.props;

    return (
      <Block card border {...props}>
        <TagInput
          ref={this.tagInput}
          styleContainer={{padding: 0}}
          styleInput={{color: Colors.white, paddingVertical: 0}}
          placeholder={`#${strings('hashtag')}`}
          placeholderTextColor={Colors.gray5}
          allTags={[]}
          hashTag={hashTag}
        />
        <Input
          style={[styles.input, inputStyle]}
          multiline
          value={content}
          autoFocus={true}
          maxLength={300}
          placeholder={strings('write_something')}
          placeholderTextColor={Colors.gray5}
          onChangeText={this.onChangeContent}
        />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderWidth: 0,
    height: null,
    borderRadius: 0,
    marginTop: 5,
  },
});

CreateSurveyText.defaultProps = {};

CreateSurveyText.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  onChangeContent: PropTypes.func,
};

// const mapStateToProps = (state) => ({
//   profile: state.user.profile,
//   team: state.team.team,
//   listTeamMembers: state.team.listTeamMembers,
//   postDetail: state.post.postDetail,
//   privacyId: state.post.privacyId,
// });

// const mapDispatchToProps = (dispatch) => ({
//   userActions: bindActionCreators(UserActions, dispatch),
//   postActions: bindActionCreators(PostActions, dispatch),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(SurveyText);
