/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import UserActions from '../../Stores/User/Actions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Style from './FolderScreenStyle';
import {Images, ApplicationStyles, Colors} from '../../Theme';
import TeamActions from '../../Stores/Team/Actions';
import {teamService} from '../../Services/TeamService';
import moment from 'moment';
import {formatBytes} from '../../Utils/commonFunction';
import * as RNLocalize from 'react-native-localize';
import DocumentPicker from 'react-native-document-picker';
import {Image, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
const {height} = Dimensions.get('window');
import {Screens} from '../../Utils/screens';
import {
  Block,
  Text,
  Header,
  Input,
  Loading,
  DateTimePicker,
  TextSelect,
  BottomSheet,
  ModalNotifcation,
} from '../../Components';
import TypeFileComponent from './TypeFileComponent';
import {strings} from '../../Locate/I18n';

class FolderDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCode: '',
      itemSelect: {},
      folderDetail: {},
      isOpenDateTime: false,
      isAutoDelete: false,
      isOpen: false,
      msgNotification: '',
      folderName: '',
      isDelete: false,
      dateTimePicker: new Date(),
      keyword: '',
      folderId: null,
      teamId: null,
    };
    this.bottomSheetMenu = React.createRef();
    this.bottomSheetMultipleFeature = React.createRef();
    this.bottomSheetAddNew = React.createRef();
    this.bottomSheetAddFolder = React.createRef();
  }

  static getDerivedStateFromProps(nextProps) {
    const {errorCode, folderDetail, navigation} = nextProps;
    const {folderId, teamId} = navigation.state.params;
    const data = {errorCode, folderDetail, folderId, teamId};
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
    const {teamId, folderId} = this.state;
    teamActions.fetchFolder(folderId, teamId);
  };
  checkTypeFile = (isFile) => {
    this.setState({
      isFile: isFile,
    });
  };
  handleChange = (key, value) => {
    let {itemSelect} = this.state;
    itemSelect[key] = value;
    this.setState({
      itemSelect,
    });
  };
  handleTextChange = (value) => {
    this.setState({
      folderName: value,
    });
  };
  handleModalDeleteFile = (isDelete) => {
    this.setState({
      isDelete: isDelete,
    });
  };

  quickActionFile = (item) => {
    this.checkTypeFile(true);
    this.setState({
      itemSelect: JSON.parse(JSON.stringify(item)),
    });
    this.bottomSheetMenu.current.open();
  };
  quickActionFolder = (item) => {
    this.checkTypeFile(false);
    this.setState({
      itemSelect: JSON.parse(JSON.stringify(item)),
    });
    this.bottomSheetMenu.current.open();
  };
  openPicker = async () => {
    this.bottomSheetAddNew.current.close();
    const {teamActions} = this.props;
    const {teamId, folderId} = this.state;
    // pick multiple file
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      let data = new FormData();
      results.map((item) => {
        const file = {
          uri: item.uri,
          name: item.name,
          type: item.type,
        };
        data.append('files', file);
        data.append('teamId', teamId);
        data.append('folderId', folderId);
      });

      teamService
        .addFile(data)
        .then((response) => {
          if (response.success) {
            teamActions.fetchFolder(folderId, teamId);
          } else {
            const {message} = response;
            this.setState({
              msgNotification: message,
              isOpen: true,
            });
          }
        })
        .catch(() =>
          this.setState({
            msgNotification: strings('upload_file_failed'),
            isOpen: true,
          }),
        );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
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
    this.handleModalDeleteFile(true);
  };

  showDatePicker = () => {
    this.setDatePickerVisibility(true);
  };

  hideDatePicker = () => {
    this.setDatePickerVisibility(false);
  };

  handleConfirm = (date) => {
    let {itemSelect, isFile} = this.state;
    isFile
      ? (itemSelect.fileDeleteDate = date.getTime())
      : (itemSelect.folderDeleteDate = date.getTime());
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

  handleSearch = async (keyword) => {
    const {teamId} = this.state;
    let {folderDetail} = this.state;
    const data = {
      keyword,
      teamId: teamId,
    };
    try {
      teamService.searchFolder(data).then((response) => {
        if (response.success) {
          folderDetail.listTeamFileDTO = response.data.listTeamFileDTO;
          folderDetail.listTeamFolderDTO = response.data.listTeamFolderDTO;
          this.setState({
            folderDetail,
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

  handleRenameFolder = async () => {
    const {teamActions} = this.props;
    const {itemSelect, teamId} = this.state;
    const {folderName, folderId, parentFolderId} = itemSelect;
    const data = {
      folderId: folderId,
      folderName: folderName,
    };

    try {
      teamService.updateFolderName(data).then((response) => {
        if (response.success) {
          this.bottomSheetMultipleFeature.current.close();
          teamActions.fetchFolder(parentFolderId, teamId);
        } else {
          const {message} = response;
          this.setState({
            messageNotification: message,
            isOpen: true,
          });
        }
      });
    } catch (error) {
      this.setState({
        isOpen: true,
        messageNotification: strings('upload_folder_failed'),
      });
    }
  };

  handleAutoDeleteFolder = async () => {
    const timeZone = RNLocalize.getTimeZone();
    const {teamActions} = this.props;
    const {itemSelect, teamId} = this.state;
    const {folderId, folderDeleteDate, parentFolderId} = itemSelect;
    const timeDelete = moment(folderDeleteDate).format('DD/MM/YYYY h:mm:ss');
    try {
      teamService
        .autoDeleteFolder(folderId, timeDelete, timeZone)
        .then((response) => {
          if (response.success) {
            this.bottomSheetMultipleFeature.current.close();
            teamActions.fetchFolder(parentFolderId, teamId);
          } else {
            const {message} = response;
            this.setState({
              messageNotification: message,
              isOpen: true,
            });
          }
        });
    } catch (error) {
      this.setState({
        isOpen: true,
        messageNotification: strings('setting_autodelete_folder_failed'),
      });
    }
  };

  handleDeleteFolder = async () => {
    const {teamActions} = this.props;
    const {itemSelect, teamId} = this.state;
    const {folderId, parentFolderId} = itemSelect;
    try {
      teamService.deleteFolder(folderId).then((response) => {
        if (response.success) {
          this.handleModalDeleteFile(false);
          teamActions.fetchFolder(parentFolderId, teamId);
        } else {
          const {message} = response;
          this.setState({
            messageNotification: message,
            isOpen: true,
          });
        }
      });
    } catch (error) {
      this.setState({
        isOpen: true,
        messageNotification: strings('delete_folder_failed'),
      });
    }
  };

  handleRenameFile = async () => {
    const {teamActions} = this.props;
    const {itemSelect} = this.state;
    const {fileName, fileId, folderId, teamId} = itemSelect;
    const data = {
      fileId: fileId,
      fileName: fileName,
    };
    try {
      teamService.updateFileName(data).then((response) => {
        if (response.success) {
          this.bottomSheetMultipleFeature.current.close();
          teamActions.fetchFolder(folderId, teamId);
          this.setState({
            keyword: '',
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
        msgNotification: strings('rename_file_failed'),
      });
    }
  };

  handleDeleteFile = async () => {
    const {teamActions} = this.props;
    const {itemSelect} = this.state;
    const {fileId, folderId, teamId} = itemSelect;
    try {
      teamService.deleteFile(fileId).then((response) => {
        if (response.success) {
          this.handleModalDeleteFile(false);
          teamActions.fetchFolder(folderId, teamId);
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
        msgNotification: strings('delete_file_failed'),
      });
    }
  };

  handleAutoDeleteFile = async () => {
    const timeZone = RNLocalize.getTimeZone();
    const {teamActions} = this.props;
    const {itemSelect} = this.state;
    const {teamId, fileDeleteDate, fileId, folderId} = itemSelect;
    const timeDelete = moment(fileDeleteDate).format('DD/MM/YYYY h:mm:ss');
    try {
      teamService
        .autoDeleteFile(fileId, timeDelete, timeZone)
        .then((response) => {
          console.log(response);
          if (response.success) {
            this.bottomSheetMultipleFeature.current.close();
            teamActions.fetchFolder(folderId, teamId);
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
        msgNotification: strings('setting_autodelete_file_failed'),
      });
    }
  };
  handleCreateFolder = async () => {
    const {teamActions} = this.props;
    const {folderName, teamId, folderId} = this.state;
    const data = {
      folderName: folderName,
      parentFolderId: folderId,
      teamId: teamId,
    };

    try {
      teamService.createNewFolder(data).then((response) => {
        if (response.success) {
          this.bottomSheetAddFolder.current.close();
          this.bottomSheetAddNew.current.close();
          teamActions.fetchFolder(folderId, teamId);
          this.setState({
            folderName: null,
          });
        } else {
          const {message} = response;
          this.setState({
            messageNotification: message,
            isOpen: true,
          });
        }
      });
    } catch (error) {
      this.setState({
        isOpen: true,
        messageNotification: strings('create_folder_failed'),
      });
    }
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
    const {isAutoDelete, itemSelect, isFile} = this.state;
    const {fileName, fileDeleteDate, folderName, folderDeleteDate} = itemSelect;
    let currentDateTime = moment().format('DD/MM/YYYY h:mm:ss');
    const dateDelete = moment(
      isFile ? fileDeleteDate : folderDeleteDate,
    ).format('DD/MM/YYYY h:mm:ss');
    const dateTimePicker = isFile
      ? fileDeleteDate
        ? this.defineDateTimePicker(dateDelete)
        : this.defineDateTimePicker(currentDateTime)
      : folderDeleteDate
      ? this.defineDateTimePicker(dateDelete)
      : this.defineDateTimePicker(currentDateTime);
    return (
      <Block flex={false}>
        <Block flex={false} column style={{padding: 10, marginBottom: 10}}>
          <Text center size={13.5}>
            {isFile
              ? !isAutoDelete
                ? strings('rename_file')
                : strings('auto_delete')
              : !isAutoDelete
              ? strings('rename_folder')
              : strings('auto_delete')}
          </Text>
          <Text size={12}>
            {!isAutoDelete ? strings('name') : strings('date')}
          </Text>

          {!isAutoDelete ? (
            <Input
              placeholderTextColor={Colors.placeholder}
              placeholder={strings('name')}
              style={Style.inputRename}
              onChangeText={(text) =>
                this.handleChange(
                  isFile ? strings('filename') : strings('foldername'),
                  text,
                )
              }
              value={
                isFile
                  ? fileName
                    ? fileName
                    : ''
                  : folderName
                  ? folderName
                  : ''
              }
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
              {isFile
                ? fileDeleteDate
                  ? dateDelete
                  : currentDateTime
                : folderDeleteDate
                ? dateDelete
                : currentDateTime}
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
                isFile
                  ? !isAutoDelete
                    ? this.handleRenameFile()
                    : this.handleAutoDeleteFile()
                  : !isAutoDelete
                  ? this.handleRenameFolder()
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
  renderListFile = () => {
    const {folderDetail} = this.state;
    const {listTeamFileDTO} = folderDetail;
    let imageIcon = null;
    let listHtml = [];
    if (listTeamFileDTO && listTeamFileDTO.length > 0) {
      listTeamFileDTO.forEach((item, index) => {
        if (
          item.fileType == 'jpg' ||
          item.fileType == 'png' ||
          item.fileType == 'jpeg' ||
          item.fileType == 'gif' ||
          item.fileType == 'tiff'
        ) {
          imageIcon = !item.fileDeleteDate
            ? Images.iconFilePhotoBlack
            : Images.iconFilePhotoDelete;
        } else if (item.fileType == 'mp4') {
          imageIcon = !item.fileDeleteDate
            ? Images.iconFileVideoBlack
            : Images.iconFileVideoDelete;
        } else if (
          item.fileType == 'xlsx' ||
          item.fileType == 'docx' ||
          item.fileType == 'msword' ||
          item.fileType == 'vnd.ms-excel' ||
          item.fileType == 'pdf' ||
          item.fileType ==
            'vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          item.fileType ==
            'vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          imageIcon = !item.fileDeleteDate
            ? Images.iconFileDocBlack
            : Images.iconFileDocDelete;
        } else {
          imageIcon = !item.fileDeleteDate
            ? Images.iconFileOtherBlack
            : Images.iconFileOtherDelete;
        }

        listHtml.push(
          <TypeFileComponent
            key={index}
            fileName={item.fileName ? item.fileName : null}
            createDate={
              item.createdDate
                ? moment(item.createdDate).format('DD/MM/YYYY')
                : moment().format('DD/MM/YYYY')
            }
            deleteDate={
              item.fileDeleteDate
                ? moment(item.fileDeleteDate).format('DD/MM/YYYY')
                : null
            }
            sizeMemory={
              item.fileSize ? formatBytes(item.fileSize) : formatBytes(0)
            }
            image={imageIcon}
            onPress={() => this.quickActionFile(item)}
          />,
        );
      });
    }
    return <Block>{listHtml}</Block>;
  };
  renderListFolder = () => {
    const {folderDetail, teamId} = this.state;
    const {listTeamFolderDTO} = folderDetail;
    const {navigation} = this.props;
    let listHtml = [];
    if (listTeamFolderDTO && listTeamFolderDTO.length > 0) {
      listTeamFolderDTO.forEach((item, index) => {
        listHtml.push(
          <TypeFileComponent
            key={index}
            folder
            fileName={item.folderName ? item.folderName : null}
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
            sizeMemory={
              item.folderSize ? formatBytes(item.folderSize) : formatBytes(0)
            }
            image={
              !item.folderDeleteDate
                ? Images.iconFolderYellow
                : Images.iconFolderGray
            }
            redirect={() =>
              navigation.push(Screens.FOLDER_DETAIL, {
                teamId: teamId,
                folderId: item.folderId,
              })
            }
            onPress={() => this.quickActionFolder(item)}
          />,
        );
      });
    }
    return <Block>{listHtml}</Block>;
  };
  renderAddNew = () => {
    return (
      <Block column>
        <Block flex={false} row margin={[30, 10, 30, 10]}>
          <Text size={14} style={{width: '55%', textAlign: 'right'}}>
            Create
          </Text>
          <TouchableOpacity
            style={{
              ...ApplicationStyles.fontMPLUS1pRegular,
              textAlign: 'right',
              width: '45%',
            }}
            onPress={() => this.bottomSheetAddNew.current.close()}>
            <Text
              size={14}
              style={{
                ...ApplicationStyles.fontMPLUS1pRegular,
                textAlign: 'right',
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </Block>
        <Block
          flex={false}
          row
          space={'between'}
          style={{
            width: '50%',
            alignSelf: 'center',
          }}>
          <Block flex={false} column style={{width: 50, height: 50}}>
            <TouchableOpacity
              onPress={() => this.bottomSheetAddFolder.current.open()}>
              <Image
                source={Images.iconAddFolder}
                style={{width: 50, height: 50}}
              />
              <Text
                size={12}
                center
                style={{...ApplicationStyles.fontMPLUS1pRegular}}>
                Folder
              </Text>
            </TouchableOpacity>
          </Block>
          <Block column flex={false} style={{width: 50, height: 50}}>
            <TouchableOpacity onPress={() => this.openPicker()}>
              <Image
                source={Images.iconUpload}
                style={{width: 50, height: 50}}
              />
              <Text
                center
                size={12}
                style={{...ApplicationStyles.fontMPLUS1pRegular}}>
                Upload
              </Text>
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
    );
  };
  render() {
    const {navigation, loadingFolder} = this.props;
    const {
      folderDetail,
      isOpenDateTime,
      isDelete,
      dateTimePicker,
      keyword,
      isFile,
    } = this.state;
    let pathFolderList = [];
    folderDetail &&
    folderDetail.pathFolder &&
    folderDetail.pathFolder.length > 0
      ? folderDetail.pathFolder.map((item, index) => {
          pathFolderList.push('/', item.folderName);
          if (index == 0) {
            pathFolderList.splice(index, 1);
          }
        })
      : null;

    return (
      <Block style={Style.view}>
        <Header
          isShowBack
          rightIcon={
            <TouchableOpacity
              onPress={() => this.bottomSheetAddNew.current.open()}>
              <AntDesign name={'plus'} size={15} color={Colors.white} />
            </TouchableOpacity>
          }
          title={strings('my_folder')}
          navigation={navigation}
        />
        <Block
          flex={false}
          row
          center
          color={Colors.primary}
          style={{height: 30, width: '100%', justifyContent: 'center'}}>
          <Image
            source={Images.iconFolderYellow}
            style={{height: 15, width: 15, marginRight: 10}}
          />
          <Text center numberOfLines={1} small size={12} color={Colors.white}>
            {pathFolderList.reverse()}
          </Text>
        </Block>
        {loadingFolder ? (
          <Loading size="large" color={Colors.primary} />
        ) : (
          <ScrollView style={Style.view} showsVerticalScrollIndicator={false}>
            <Block style={Style.viewInputSearch}>
              <Input
                placeholderTextColor={Colors.placeholder}
                placeholder={strings('search')}
                style={Style.inputSearch}
                onChangeText={(keyword) => {
                  this.setState({keyword});
                  this.handleSearch(keyword);
                }}
                value={keyword}
              />
            </Block>
            <Block style={Style.container}>
              {this.renderListFile()}
              {this.renderListFolder()}
            </Block>
          </ScrollView>
        )}
        {/* Menu feature */}
        <BottomSheet
          animated={true}
          style={Style.bottomSheetFeature}
          ref={this.bottomSheetMenu}>
          {this.renderMenuFeature()}
        </BottomSheet>
        {/* Rename file, Auto delete */}
        <BottomSheet
          animated={true}
          style={Style.bottomSheetMultipleFeature}
          ref={this.bottomSheetMultipleFeature}>
          {this.renderMultipleFeature()}
        </BottomSheet>
        {/* Add new Folder and Upload */}
        <BottomSheet
          animated={true}
          style={{height: height / 4}}
          ref={this.bottomSheetAddNew}>
          {this.renderAddNew()}
        </BottomSheet>
        {/* Delete file */}
        <ModalNotifcation
          isConfirm
          message={strings('msg_are_you_sure_you_delete_this_file')}
          isOpen={isDelete}
          onAccept={() =>
            isFile ? this.handleDeleteFile() : this.handleDeleteFolder()
          }
          onCancel={() => this.handleModalDeleteFile(false)}
        />
        {/* Add new Folder */}
        <BottomSheet
          animated={true}
          style={Style.bottomSheetMultipleFeature}
          ref={this.bottomSheetAddFolder}>
          {this.renderCreateFolder()}
        </BottomSheet>
        <DateTimePicker
          isOpen={isOpenDateTime}
          mode={strings('datetime')}
          onConfirm={this.handleConfirm}
          onCancel={this.hideDatePicker}
          date={dateTimePicker}
        />
      </Block>
    );
  }
}

FolderDetailScreen.defaultProps = {};

FolderDetailScreen.propTypes = {
  errorCode: PropTypes.string,
  userActions: PropTypes.object,
  teamActions: PropTypes.object,
  folderDetail: PropTypes.object,
  loadingFolder: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  errorCode: state.user.errorCode,
  folderDetail: state.team.folderDetail,
  loadingFolder: state.team.loadingFolder,
});

const mapDispatchToProps = (dispatch) => ({
  userActions: bindActionCreators(UserActions, dispatch),
  teamActions: bindActionCreators(TeamActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FolderDetailScreen);
