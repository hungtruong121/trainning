/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from 'App/Theme';
import {Block, Text, Input, Switch} from '../../../Components';
import UserActions from '../../../Stores/User/Actions';
import PostActions from '../../../Stores/Post/Actions';
import {Screens} from '../../../Utils/screens';
import CreateSurveyText from './CreateSurveyText';
import ResponsiveUtils from '../../../Utils/ResponsiveUtils';
import {strings} from '../../../Locate/I18n';
import { Config } from '../../../Config';

export default class CreateSurveySelection extends Component {
  constructor(props) {
    super(props);
    this.inputAddMoreSelection = React.createRef();
    this.dialogPrivacy = React.createRef();
    this.surveyText = React.createRef();

    const surveyDetail = this.props.surveyDetail;

    this.state = {
      errorCode: '',
      surveyType: null,
      isCollapsed: true,
      hashTag: [],
      text: '',
      listSelections: this.props.listSelections || [],
      selectionInput: '',
      selectionIndex: 0,
      isMultiSelection: surveyDetail ? surveyDetail.isMultiple : false,
      isAddMoreSelection: surveyDetail ? surveyDetail.isExtendsAns : false,
      isSelectionImage: false,
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

  addSelection = () => {
    let {listSelections, selectionInput} = this.state;
    listSelections.push({
      ansContent: selectionInput.trim(),
    });
    this.setState({listSelections, selectionInput: ''});
    this.inputAddMoreSelection.current?.focus();
  };

  removeSelection = (index) => {
    let {listSelections} = this.state;
    listSelections.splice(index, 1);
    this.setState({listSelections});
  };

  onPressImageSelection = (index) => {
    const {navigation} = this.props;
    navigation.navigate(Screens.MEDIA_SELECT, {
      mediaType: 'Photos',
      multiSelect: false,
      onSelectedImage: this.onSelectedImage,
    });
    this.setState({isCollapsed: true, selectionIndex: index});
  };

  onSelectedImage = (media) => {
    let {listSelections, selectionIndex} = this.state;
    listSelections[selectionIndex].image = media.image;
    this.setState({listSelections, isSelectionImage: true});
  };

  getHashTag = () => {
    return this.surveyText.current?.getHashTag();
  };

  getContent = () => {
    return this.surveyText.current?.getContent();
  };

  getListSelections = () => {
    return this.state.listSelections;
  };

  getMultiSelection = () => {
    return this.state.isMultiSelection;
  };

  getEnableAddMoreSelection = () => {
    return this.state.isAddMoreSelection;
  };

  render() {
    const {
      listSelections,
      hashTag,
      selectionInput,
      isMultiSelection,
      isAddMoreSelection,
      containerWidth,
    } = this.state;

    const {content} = this.props;

    let selectionImage = false;
    for (let i = 0; i < listSelections.length; i++) {
      if (listSelections[i].image) {
        selectionImage = true;
        break;
      }
    }

    const imageWidth = ((containerWidth || 0) - 11) / 2;
    const imageHeight = (imageWidth * 3) / 5;

    return (
      <Block>
        <Block flex={false} card border color={Colors.black} padding={[10]}>
          <CreateSurveyText
            ref={this.surveyText}
            hashTag={hashTag}
            content={content}
            onChangeContent={this.props.onChangeContent}
          />
          <Block flex={false} center marginTop={0}>
            <Block
              flex={false}
              center
              width={'70%'}
              paddingVertical={5}
              style={{borderBottomWidth: 1, borderColor: Colors.white}}>
              <Text color={Colors.white}>OPTION</Text>
            </Block>
          </Block>

          <Block flex={false}>
            {!selectionImage && (
              <Block flex={false}>
                {listSelections.map((selection, index) => (
                  <Block
                    flex={false}
                    row
                    center
                    marginTop={20}
                    marginLeft={10}
                    key={index}>
                    <Block
                      flex={false}
                      width={8}
                      height={8}
                      style={{borderRadius: 4}}
                      color={Colors.white}
                    />
                    <Text color={Colors.white} style={{flex: 1, marginLeft: 8}}>
                      {selection.ansContent}
                    </Text>
                    <TouchableOpacity
                      style={{
                        width: 25,
                        height: 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => this.onPressImageSelection(index)}>
                      <MaterialIcons
                        name={'image'}
                        size={15}
                        color={Colors.white}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: 25,
                        height: 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => this.removeSelection(index)}>
                      <MaterialIcons
                        name={'clear'}
                        size={15}
                        color={Colors.white}
                      />
                    </TouchableOpacity>
                  </Block>
                ))}
              </Block>
            )}

            {selectionImage && (
              <Block
                flex={false}
                row
                wrap
                onLayout={(event) =>
                  this.setState({
                    containerWidth: event.nativeEvent.layout.width,
                  })
                }>
                {listSelections.map((selection, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{marginTop: 10, marginLeft: (index % 2 !== 0 ? 10 : 0)}}
                    onPress={() => this.onPressImageSelection(index)}>
                    <Block
                      flex={false}
                      width={imageWidth}
                      height={imageHeight}
                      border
                      card>
                        
                      {selection.image ? (
                        <Block>
                          <Image
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: 5,
                            }}
                            source={{uri: selection.image.uri}}
                          />
                          <Block color={Colors.opacity} absolute style={{top: 0, right: 0, bottom: 0, left: 0}}>
                          </Block>
                        </Block>
                      ) : (
                        <Block
                          color={'#8E8E8E'}
                          middle
                          center
                          card>
                          <MaterialIcons
                            name={'image'}
                            size={47}
                            color={Colors.white}
                          />
                        </Block>
                      )}
                      <Block
                        absolute
                        style={{
                          justifyContent: 'space-between',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                        }}>
                        <Block
                          flex={false}
                          row
                          right>
                          <TouchableOpacity
                            style={{
                              width: 25,
                              height: 25,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onPress={() => this.removeSelection(index)}>
                            <MaterialIcons
                              name={'clear'}
                              size={15}
                              color={Colors.white}
                            />
                          </TouchableOpacity>
                        </Block>
                        <Block flex={false} padding={[2, 7, 2, 7]}>
                          <Text color={Colors.white}>{selection.ansContent}</Text>
                        </Block>
                      </Block>
                    </Block>
                  </TouchableOpacity>
                ))}
              </Block>
            )}
            <Block flex={false} row center marginTop={10}>
              <Icon
                name={'plus'}
                color={Colors.white}
                size={12}
                style={{marginLeft: 10, marginRight: 6}}
              />
              <Block>
                <Input
                  refName={this.inputAddMoreSelection}
                  style={{width: '100%', borderWidth: 0}}
                  placeholder={'Add more selection...'}
                  placeholderTextColor={Colors.gray9}
                  maxLength={30}
                  value={selectionInput}
                  onChangeText={(text) => this.setState({selectionInput: text})}
                />
              </Block>
              {selectionInput && selectionInput.trim() ? (
                <TouchableOpacity
                  style={{padding: 10}}
                  onPress={this.addSelection}>
                  <Icon name={'check'} color={Colors.green} size={20} />
                </TouchableOpacity>
              ) : null}
            </Block>
          </Block>
        </Block>
        <Block
          flex={false}
          height={46}
          row
          card
          center
          border
          color={Colors.black}
          padding={[0, 10, 0, 10]}
          marginTop={15}>
          <Block>
            <Text color={Colors.white}>Allow multiple selection</Text>
          </Block>
          <Switch
            value={isMultiSelection}
            trackColor={{true: Colors.primary}}
            onValueChange={() =>
              this.setState({isMultiSelection: !isMultiSelection})
            }
          />
        </Block>
        <Block
          flex={false}
          height={46}
          row
          card
          border
          center
          color={Colors.black}
          padding={[0, 10, 0, 10]}
          marginTop={15}>
          <Block>
            <Text color={Colors.white}>Allow add more selection</Text>
          </Block>
          <Switch
            value={isAddMoreSelection}
            trackColor={{true: Colors.primary}}
            onValueChange={() =>
              this.setState({isAddMoreSelection: !isAddMoreSelection})
            }
          />
        </Block>
      </Block>
    );
  }
}

CreateSurveySelection.defaultProps = {};

CreateSurveySelection.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
};
