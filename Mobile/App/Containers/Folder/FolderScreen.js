/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import UserActions from '../../Stores/User/Actions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Style from './FolderScreenStyle';
import {Screens} from '../../Utils/screens';
import {Images, ApplicationStyles, Colors} from '../../Theme';
import {formatBytes} from '../../Utils/commonFunction';
import TeamActions from '../../Stores/Team/Actions';
import {strings} from '../../Locate/I18n';
import {teamService} from '../../Services/TeamService';
import moment from 'moment';
import * as RNLocalize from 'react-native-localize';
import {
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Button,
  Block,
  Text,
  Header,
  Input,
  TextSelect,
  Loading,
  DateTimePicker,
  ModalNotifcation,
  BottomSheet,
  Progress,
} from '../../Components';
import DefaultFileComponent from '../Folder/DefaultFileComponent';
import TypeFolderComponent from '../Folder/TypeFolderComponent';
class FolderScreen extends Component {
  constructor(props) {
    super(props);
    this.imagePicker = React.createRef();
    this.state = {
      folder: {},
      teamId: null,
      profile: {},
      visibleGallery: false,
      itemSelect: {},
      errorCode: '',
      folderName: '',
      msgNotification: '',
      isOpen: false,
      isDelete: false,
      isAutoDelete: false,
      isOpenDateTime: false,
      isCreateFolder: false,
      dateTimePicker: new Date(),
      keyword: '',
      isEditing: false,
      imageFile: undefined,
    };
    this.bottomSheetMenu = React.createRef();
    this.bottomSheetMultipleFeature = React.createRef();
    this.bottomSheetAddFolder = React.createRef();
  }

  static getDerivedStateFromProps(nextProps) {
    const {errorCode, profile, folder, navigation} = nextProps;
    const {teamId} = navigation.state.params;
    const data = {
      errorCode,
      profile,
      teamId,
      folder,
    };

    return data;
  }

  componentDidMount = async () => {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      // The screen is focused
      // Call any action
      this.fetchData();
    });
  };

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener && this.focusListener.remove();
  }

  fetchData = () => {
    const {teamActions} = this.props;
    const {teamId} = this.state;
    teamActions.fetchFolder('', teamId);
  };

  handleTextChange = (value) => {
    this.setState({
      folderName: value,
    });
  };

  handleChange = (key, value) => {
    let {itemSelect} = this.state;
    itemSelect[key] = value;
    this.setState({
      itemSelect,
    });
  };

  handleCreateFolder = async () => {
    const {teamActions} = this.props;
    const {folderName, teamId} = this.state;
    const data = {
      folderName: folderName,
      parentFolderId: null,
      teamId: teamId,
    };

    try {
      teamService.createNewFolder(data).then((response) => {
        if (response.success) {
          this.bottomSheetAddFolder.current.close();
          teamActions.fetchFolder('', teamId);
          this.setState({
            folderName: null,
          });
        } else {
          const {message} = response;
          this.setState({
            msgNotification: message,
            isOpen: true,
          });
        }
      });
    } catch (error) {
      this.setState({
        isOpen: true,
        msgNotification: strings('create_folder_failed'),
      });
    }
  };

  handleRename = async () => {
    const {teamActions} = this.props;
    const {itemSelect, teamId} = this.state;
    const {folderName, folderId} = itemSelect;
    const data = {
      folderId: folderId,
      folderName: folderName,
    };

    try {
      teamService.updateFolderName(data).then((response) => {
        if (response.success) {
          this.bottomSheetMultipleFeature.current.close();
          teamActions.fetchFolder('', teamId);
        } else {
          const {message} = response;
          this.setState({
            msgNotification: message,
            isOpen: true,
          });
        }
      });
    } catch (error) {
      this.setState({
        isOpen: true,
        msgNotification: strings('update_folder_failed'),
      });
    }
  };

  handleDeleteFolder = async () => {
    const {teamActions} = this.props;
    const {itemSelect, teamId} = this.state;
    const {folderId} = itemSelect;
    try {
      teamService.deleteFolder(folderId).then((response) => {
        if (response.success) {
          this.handleModalDeleteFolder(false);
          teamActions.fetchFolder('', teamId);
        } else {
          const {message} = response;
          this.setState({
            msgNotification: message,
            isOpen: true,
          });
        }
      });
    } catch (error) {
      this.setState({
        isOpen: true,
        msgNotification: strings('delete_folder_failed'),
      });
    }
  };

  handleAutoDeleteFolder = async () => {
    const timeZone = RNLocalize.getTimeZone();
    const {teamActions} = this.props;
    const {itemSelect, teamId} = this.state;
    const {folderId, folderDeleteDate} = itemSelect;
    const timeDelete = moment(folderDeleteDate).format('DD/MM/YYYY h:mm:ss');
    try {
      teamService
        .autoDeleteFolder(folderId, timeDelete, timeZone)
        .then((response) => {
          if (response.success) {
            this.bottomSheetMultipleFeature.current.close();
            teamActions.fetchFolder('', teamId);
          } else {
            const {message} = response;
            this.setState({
              msgNotification: message,
              isOpen: true,
            });
          }
        });
    } catch (error) {
      this.setState({
        isOpen: true,
        msgNotification: strings('setting_autodelete_folder_failed'),
      });
    }
  };

  handleSearch = async (keyword) => {
    const {teamId} = this.state;
    let {folder} = this.state;
    const data = {
      keyword,
      teamId: teamId,
    };
    try {
      teamService.searchFolder(data).then((response) => {
        if (response.success) {
          folder.listTeamFolderDTO = response.data.listTeamFolderDTO;
          this.setState({
            folder,
          });
        } else {
          const {message} = response;
          this.setState({
            msgNotification: message,
            isOpen: true,
          });
        }
      });
    } catch (error) {
      this.setState({
        isOpen: true,
        msgNotification: strings('search_folder_failed'),
      });
    }
  };

  onSelectImage = (image) => {
    console.log(image);
    this.setState({imageFile: image});
  };

  showDatePicker = () => {
    this.setDatePickerVisibility(true);
  };

  hideDatePicker = () => {
    this.setDatePickerVisibility(false);
  };

  handleConfirm = (date) => {
    let {itemSelect} = this.state;
    itemSelect.folderDeleteDate = date.getTime();
    this.setState({
      itemSelect,
    });
    this.hideDatePicker();
  };

  setDatePickerVisibility = (isOpenDateTime) => {
    this.setState({
      isOpenDateTime,
    });
  };

  handleModalDeleteFolder = (isDelete) => {
    this.setState({
      isDelete: isDelete,
    });
  };

  defineDateTimePicker = (dateDelete) => {
    const split = dateDelete.split(' ');
    const dateArray = split[0].split('/');
    const timeArray = split[1].split(':');
    return new Date(
      dateArray[2],
      dateArray[1] - 1,
      dateArray[0],
      timeArray[0],
      timeArray[1],
      timeArray[2],
    );
  };

  resetItemSelect = () => {
    this.setState({
      itemSelect: {},
    });
  };

  quickAction = (item) => {
    this.setState({
      itemSelect: JSON.parse(JSON.stringify(item)),
    });
    this.bottomSheetMenu.current.open();
  };

  showRenamePopup = () => {
    this.setState({
      isAutoDelete: false,
    });
    this.bottomSheetMenu.current.close();
    this.bottomSheetMultipleFeature.current.open();
  };

  showAutoDeletePopup = () => {
    this.setState({
      isAutoDelete: true,
    });

    this.bottomSheetMenu.current.close();
    this.bottomSheetMultipleFeature.current.open();
  };

  showDeletePopup = () => {
    this.bottomSheetMenu.current.close();
    this.handleModalDeleteFolder(true);
  };

  cancelMenuFeature = () => {
    this.resetItemSelect();
    this.bottomSheetMenu.current.close();
  };

  renderMenuFeature = () => {
    return (
      <Block center>
        <TouchableOpacity
          style={Style.menuFeature}
          onPress={() => this.showRenamePopup()}>
          <Text size={12}>Rename</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={Style.menuFeature}
          onPress={() => this.showAutoDeletePopup()}>
          <Text size={12}>Auto Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={Style.menuFeature}
          onPress={() => this.showDeletePopup()}>
          <Text size={12}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={Style.menuFeature}
          onPress={() => this.cancelMenuFeature()}>
          <Text size={12} color={Colors.primary}>
            Cancel
          </Text>
        </TouchableOpacity>
      </Block>
    );
  };

  renderMultipleFeature = () => {
    const {isAutoDelete, itemSelect} = this.state;
    const {folderName, folderDeleteDate} = itemSelect;
    let currentDateTime = moment().format('DD/MM/YYYY h:mm:ss');
    const dateDelete = moment(folderDeleteDate).format('DD/MM/YYYY h:mm:ss');
    const dateTimePicker = folderDeleteDate
      ? this.defineDateTimePicker(dateDelete)
      : this.defineDateTimePicker(currentDateTime);
    return (
      <Block flex={false}>
        <Block flex={false} column style={{padding: 10, marginBottom: 10}}>
          <Text center size={13.5}>
            {!isAutoDelete ? strings('rename_folder') : strings('auto_delete')}
          </Text>
          <Text size={12}>
            {!isAutoDelete ? strings('name') : strings('date')}
          </Text>

          {!isAutoDelete ? (
            <Input
              placeholderTextColor={Colors.placeholder}
              placeholder={'name'}
              style={Style.inputRename}
              onChangeText={(text) => this.handleChange('folderName', text)}
              value={folderName ? folderName : ''}
            />
          ) : (
            <TextSelect
              selectStyles={Style.textSelect}
              size={13.5}
              onSelect={() =>
                this.setState({
                  isOpenDateTime: true,
                  dateTimePicker,
                })
              }
              style={{...ApplicationStyles.fontMPLUS1pRegular}}>
              {folderDeleteDate ? dateDelete : currentDateTime}
            </TextSelect>
          )}
        </Block>
        <Block flex={false} row style={Style.footer}>
          <Block
            style={{
              borderRightWidth: 1,
              borderRightColor: Colors.gray2,
            }}
            middle>
            <TouchableOpacity
              onPress={() =>
                !isAutoDelete
                  ? this.handleRename()
                  : this.handleAutoDeleteFolder()
              }>
              <Text bold center>
                {'Save'}
              </Text>
            </TouchableOpacity>
          </Block>
          <Block middle>
            <TouchableOpacity
              onPress={() => this.bottomSheetMultipleFeature.current.close()}>
              <Text bold center color={Colors.gray9}>
                {'Cancel'}
              </Text>
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
    );
  };

  renderCreateFolder = () => {
    const {folderName} = this.state;
    return (
      <Block flex={false}>
        <Block flex={false} column style={{padding: 10, marginBottom: 10}}>
          <Text center size={13.5}>
            New folder
          </Text>
          <Text size={12}>Name</Text>
          <Input
            placeholderTextColor={Colors.placeholder}
            placeholder={strings('name')}
            style={Style.inputRename}
            onChangeText={(text) => this.handleTextChange(text)}
            value={folderName}
          />
        </Block>
        <Block flex={false} row style={Style.footer}>
          <Block
            style={{
              borderRightWidth: 1,
              borderRightColor: Colors.gray2,
            }}
            middle>
            <TouchableOpacity onPress={() => this.handleCreateFolder()}>
              <Text bold center>
                {'Save'}
              </Text>
            </TouchableOpacity>
          </Block>
          <Block middle>
            <TouchableOpacity
              onPress={() => this.bottomSheetAddFolder.current.close()}>
              <Text bold center color={Colors.gray9}>
                {'Cancel'}
              </Text>
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
    );
  };

  renderListFolder = () => {
    const {navigation, teamActions} = this.props;
    const {folder} = this.state;
    const {listTeamFolderDTO} = folder;
    let listHtml = [];
    if (listTeamFolderDTO && listTeamFolderDTO.length > 0) {
      listTeamFolderDTO.forEach((item, index) => {
        listHtml.push(
          <TypeFolderComponent
            key={index}
            isGenerate
            createName={item.createdByName ? item.createdByName : null}
            folderName={item.folderName ? item.folderName : null}
            sizeMemory={
              item.folderSize ? formatBytes(item.folderSize) : formatBytes(0)
            }
            navigation={navigation}
            backgroundImage={
              item.folderDeleteDate
                ? Images.iconFolderGray
                : Images.iconFolderYellow
            }
            createDate={
              item.createdDate
                ? moment(item.createdDate).format('DD/MM/YYYY')
                : moment().format('DD/MM/YYYY')
            }
            deleteDate={
              item.folderDeleteDate
                ? moment(item.folderDeleteDate).format('DD/MM/YYYY')
                : null
            }
            redirect={() => {
              teamActions.fetchFolder(item.folderId, item.teamId);
              navigation.navigate(Screens.FOLDER_DETAIL, {
                folderId: item.folderId,
                teamId: item.teamId,
              });
            }}
            onPress={() => this.quickAction(item)}
          />,
        );
      });
    }
    return (
      <Block
        row
        space={'between'}
        style={{
          width: '100%',
          flexWrap: 'wrap',
          marginTop: -20,
        }}>
        {listHtml}
      </Block>
    );
  };

  render() {
    const {navigation, loadingFolder} = this.props;
    const {
      isDelete,
      isOpenDateTime,
      folder,
      isOpen,
      msgNotification,
      dateTimePicker,
      keyword,
      teamId,
    } = this.state;
    const {doc, media, others, photos, storage, storageCapacity} = folder;

    // let converGbToBytes = storageCapacity * 1000000000;
    const bytesUse = storage / 1000000000;

    return (
      <Block style={Style.view}>
        <Header
          isShowBack
          rightIcon={
            <TouchableOpacity
              onPress={() => this.bottomSheetAddFolder.current.open()}
              style={{padding: 10}}>
              <AntDesign name={'plus'} size={15} color={Colors.white} />
            </TouchableOpacity>
          }
          title="Folder"
          navigation={navigation}
        />
        <Block flex={false} style={Style.viewInputSearch}>
          <Input
            placeholderTextColor={Colors.placeholder}
            placeholder="Search"
            style={Style.inputSearch}
            onChangeText={(keyword) => {
              this.setState({keyword});
              this.handleSearch(keyword);
            }}
            value={keyword}
          />
        </Block>

        <Block flex={false} style={Style.viewStorage} column>
          <Text size={13.5} style={{...ApplicationStyles.fontMPLUS1pBold}}>
            STORAGE
          </Text>

          <Block center row>
            <Progress progress={bytesUse} type="bar" />
            <Button
              error
              style={Style.btnUpgrade}
              onPress={() =>
                navigation.navigate(Screens.UPGRADE_TEAM, {teamId})
              }>
              <Text
                center
                color={Colors.white}
                style={{
                  fontSize: 12,
                }}>
                Upgrade
              </Text>
            </Button>
          </Block>
          <Block row center>
            <Text size={11} color={Colors.red}>
              {storage ? formatBytes(storage) : '0 GB'}
            </Text>
            <Text> / </Text>
            <Text size={11}>{storageCapacity ? storageCapacity : '0'} GB</Text>
          </Block>
        </Block>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : null}
          style={{flex: 1}}>
          <ScrollView style={Style.view} showsVerticalScrollIndicator={false}>
            <Block style={Style.container}>
              <Block
                space={'between'}
                row
                margin={[24, 0, 0, 0]}
                style={{width: '100%', flexWrap: 'wrap'}}>
                <DefaultFileComponent
                  color={Colors.white}
                  title={'Videos'}
                  numberItem={
                    media && media.totalFiles
                      ? `${media.totalFiles} items`
                      : '0 items'
                  }
                  sizeMemory={
                    media && media.totalSize
                      ? formatBytes(media.totalSize)
                      : formatBytes(0)
                  }
                  icon={Images.iconFileVideo}
                />
                <DefaultFileComponent
                  color={Colors.white}
                  title={'Photos'}
                  numberItem={
                    photos && photos.totalFiles
                      ? `${photos.totalFiles} items`
                      : '0 items'
                  }
                  sizeMemory={
                    photos && photos.totalSize
                      ? formatBytes(photos.totalSize)
                      : formatBytes(0)
                  }
                  icon={Images.iconFilePhoto}
                />
                <DefaultFileComponent
                  color={Colors.white}
                  title={'Doc'}
                  numberItem={
                    doc && doc.totalFiles
                      ? `${doc.totalFiles} items`
                      : '0 items'
                  }
                  sizeMemory={
                    doc && doc.totalSize
                      ? formatBytes(doc.totalSize)
                      : formatBytes(0)
                  }
                  icon={Images.iconFileDoc}
                />
                <DefaultFileComponent
                  color={Colors.white}
                  title={'Other'}
                  numberItem={
                    others && others.totalFiles
                      ? `${others.totalFiles} items`
                      : '0 items'
                  }
                  sizeMemory={
                    others && others.totalSize
                      ? formatBytes(others.totalSize)
                      : formatBytes(0)
                  }
                  icon={Images.iconFileOther}
                />
              </Block>

              <Block row margin={[24, 0, 0, 0]} style={{width: '100%'}}>
                <TypeFolderComponent
                  style={{marginRight: '5%'}}
                  isDefault
                  folderName={'POST'}
                  sizeMemory={'1.6 GB'}
                  backgroundImage={Images.iconFolderYellow}
                  navigation={navigation}
                  icon={Images.iconFolderPost}
                />
                <TypeFolderComponent
                  isDefault
                  folderName={'MATCH'}
                  sizeMemory={'1.6 GB'}
                  backgroundImage={Images.iconFolderYellow}
                  navigation={navigation}
                  icon={Images.iconFolderMatch}
                />
              </Block>
              {loadingFolder ? (
                <Loading size="large" color={Colors.primary} />
              ) : (
                this.renderListFolder()
              )}
            </Block>
          </ScrollView>
        </KeyboardAvoidingView>
        {/* Menu feature */}
        <BottomSheet
          animated={true}
          style={Style.bottomSheetFeature}
          ref={this.bottomSheetMenu}>
          {this.renderMenuFeature()}
        </BottomSheet>
        {/* Rename Folder, Auto delete */}
        <BottomSheet
          animated={true}
          style={Style.bottomSheetMultipleFeature}
          ref={this.bottomSheetMultipleFeature}>
          {this.renderMultipleFeature()}
        </BottomSheet>
        {/* Add new Folder */}
        <BottomSheet
          animated={true}
          style={Style.bottomSheetMultipleFeature}
          ref={this.bottomSheetAddFolder}>
          {this.renderCreateFolder()}
        </BottomSheet>
        {/* Delete folder */}
        <ModalNotifcation
          isConfirm
          message={'Are you sure you delete this folder'}
          isOpen={isDelete}
          onAccept={() => this.handleDeleteFolder()}
          onCancel={() => this.handleModalDeleteFolder(false)}
        />
        {/* message notification call API */}
        <ModalNotifcation
          isOpen={isOpen}
          message={msgNotification}
          onAccept={() => {
            this.setState({
              isOpen: false,
              msgNotification: '',
            });
          }}
        />
        <DateTimePicker
          isOpen={isOpenDateTime}
          mode="datetime"
          onConfirm={this.handleConfirm}
          onCancel={this.hideDatePicker}
          date={dateTimePicker}
        />
      </Block>
    );
  }
}

FolderScreen.defaultProps = {};

FolderScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  teamActions: PropTypes.object,
  profile: PropTypes.object,
  folder: PropTypes.object,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  team: state.team.team,
  profile: state.user.profile,
  folder: state.team.folder,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FolderScreen);
