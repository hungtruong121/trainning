/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {Image, TouchableOpacity, ScrollView} from 'react-native';
import {Block, Text, Header, CheckBox, BottomSheet} from '../../Components';
import UserActions from '../../Stores/User/Actions';
import {strings, switchLanguage} from '../../Locate/I18n';
import Style from './GeneralScreenStyle';
import {Images} from '../../Theme';
import {Constants} from '../../Utils/constants';

class GeneralScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCode: '',
      language: '',
      languageSelect: '',
      isEditing: false,
    };
    this.bottomSheet = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {errorCode, language} = nextProps;
    const {isEditing} = prevState;
    const data = {errorCode, language};
    if (!isEditing) {
      data.languageSelect = language;
    }

    return data;
  }

  componentDidMount = async () => {};

  renderItemLanguage = (language) => (
    <TouchableOpacity
      style={{marginVertical: 15}}
      onPress={() =>
        this.setState({
          isEditing: true,
          languageSelect: language,
        })
      }>
      <Block flex={false} row>
        <CheckBox checked={this.state.languageSelect === language} />
        <Text size={13} style={Style.textLanguage}>
          {strings(`${language}`)}
        </Text>
      </Block>
    </TouchableOpacity>
  );

  handleChangeLanguage = () => {
    this.bottomSheet.current.close();
    const {languageSelect} = this.state;
    const {userId, userActions} = this.props;
    switchLanguage(userId, languageSelect, this);
    userActions.updateLanguage(languageSelect);
  };

  render() {
    const {navigation} = this.props;
    const {language} = this.state;
    return (
      <Block style={Style.view}>
        <Header title={strings('general')} isShowBack navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={Style.itemSetting}
            onPress={() => this.bottomSheet.current.open()}>
            <Block row space="between">
              <Text style={[Style.text, {textTransform: 'uppercase'}]}>
                {strings('language')}
              </Text>
              <Text style={Style.text}>{strings(`${language}`)}</Text>
            </Block>
          </TouchableOpacity>
          <TouchableOpacity style={Style.itemSetting} onPress={() => {}}>
            <Block row space="between" center>
              <Text style={[Style.text, {textTransform: 'uppercase'}]}>
                {strings('themes')}
              </Text>
              <Image source={Images.iconThemDefault} style={Style.iconTheme} />
            </Block>
          </TouchableOpacity>
        </ScrollView>
        <BottomSheet
          animated={true}
          ref={this.bottomSheet}
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
          onClose={() => {
            this.setState({
              isEditing: false,
            });
          }}>
          <Block style={{padding: 20}}>
            <Block center flex={false} row space="between">
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isEditing: false,
                  });
                  this.bottomSheet.current.close();
                }}>
                <Text size={13.5}>{strings('cancel')}</Text>
              </TouchableOpacity>
              <Text size={14} bold>
                {strings('change_language')}
              </Text>
              <TouchableOpacity onPress={() => this.handleChangeLanguage()}>
                <Text size={13.5}>{strings('done')}</Text>
              </TouchableOpacity>
            </Block>
            {this.renderItemLanguage(Constants.EN)}
            {this.renderItemLanguage(Constants.JP)}
            {this.renderItemLanguage(Constants.VI)}
          </Block>
        </BottomSheet>
      </Block>
    );
  }
}

GeneralScreen.defaultProps = {};

GeneralScreen.propTypes = {
  userActions: PropTypes.object,
  userId: PropTypes.string,
  language: PropTypes.string,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  userId: state.user.userId,
  language: state.user.language,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(GeneralScreen);
