/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import React, {Component} from 'react';
import {FlatList, PermissionsAndroid, Platform} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-picker';
import {Dropdown} from 'react-native-material-dropdown-v2';
import {Colors} from 'App/Theme';
import {Button, Block, Text, Header} from '../../../Components';
import {strings} from '../../../Locate/I18n';
import {Screens} from '../../../Utils/screens';
import {Privacy} from '../../..//Constants';
import Style from './MediaSelectScreenStyle';
import ImageItem from '../ImageItem';

class MediaSelectScreen extends Component {
  constructor(props) {
    super(props);

    const {navigation} = this.props;

    this.mediaType = navigation.getParam('mediaType');
    this.multiSelect = navigation.getParam('multiSelect', true);
    const privacyId = navigation.getParam('privacyId', Privacy.PUBLIC);
    const userInclude = navigation.getParam('userInclude', []);
    const listMediaSelected = navigation.getParam('listMediaSelected', []);

    this.state = {
      privacyId: privacyId,
      userInclude: userInclude,
      listMediaSelected: listMediaSelected,
      listMedia: [],
      mediaType: this.mediaType,
      containerWidth: 0,
    };
  }

  componentDidMount() {
    this.startLoadImages();
  }

  startLoadImages() {
    if (Platform.OS === 'android') {
      this.checkAndroidPermission();
    } else {
      this.getListImage();
    }
  }

  async checkAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      this.getListImage();
      return;
    }

    const status = await PermissionsAndroid.request(permission);
    if (status === 'granted') {
      this.getListImage();
      return;
    }

    this.onClose();
  }

  getListImage() {
    CameraRoll.getPhotos({
      first: 1000000,
      assetType: this.state.mediaType || 'All',
    })
      .then((r) => {
        let listMedia = [];
        if (r.edges) {
          r.edges.forEach((media) => {
            if (Platform.OS == 'ios') {
              const appleId = media.node.image.uri.substring(5, 41);
              const fileNameLength = media.node.image.filename.length;
              const ext = media.node.image.filename.substring(
                fileNameLength - 3,
              );
              media.node.image.uri = `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;
            }

            if (!media.node.image.filename) {
              media.node.image.filename = media.node.image.uri.replace(
                /^.*[\\\/]/,
                '',
              );
            }

            this.state.listMediaSelected.forEach((mediaSelect) => {
              if (media.node.image.uri == mediaSelect.image.uri) {
                media.node.checked = true;
              }
            });

            listMedia.push(media);
          });
          this.setState({listMedia});
        }
      })
      .catch((err) => {
        console.log('Photos error: ', err);
      });
  }

  launchCamera = () => {
    var options = {
      mediaType: this.state.mediaType == 'Videos' ? 'video' : 'photo',
      title: 'Take a photo',
      takePhotoButtonTitle: 'takePhotoButtonTitle',
      chooseFromLibraryButtonTitle: 'chooseFromLibraryButtonTitle',
      cancelButtonTitle: 'cancelButtonTitle',
    };
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const media = {
          group_name: response.group_name,
          image: {
            fileSize: response.fileSize,
            filename: response.fileName,
            height: response.height,
            playableDuration: response.playableDuration,
            uri: response.uri,
            width: response.width,
          },
          location: response.location,
          timestamp: response.timestamp,
          type: response.type
        };
        this.onSelectedMedia(media);
      }
    });
  };

  onClose = () => {
    this.props.onClose();
  };

  onFilter = (text) => {
    this.getListImage(text);
    this.setState({mediaType: text});
  };

  onSelectedMedia = (media) => {
    if (this.multiSelect) {
      const {listMedia} = this.state;
      for (let index = 0; index < listMedia.length; index++) {
        const element = listMedia[index];
        if (element.node.image.uri == media.image.uri) {
          element.node.checked = !element.node.checked;
        }
      }
      this.setState({listMedia});

      this.addMediaToList(media);
      return;
    }

    const {navigation} = this.props;
    if (navigation.state.params && navigation.state.params.onSelectedImage) {
      navigation.state.params.onSelectedImage(media);
    }
    navigation.goBack();
  };

  addMediaToList = (media) => {
    const {listMediaSelected} = this.state;
    for (let i = 0; i < listMediaSelected.length; i++) {
      const element = listMediaSelected[i];
      if (element.image.uri == media.image.uri) {
        listMediaSelected.splice(i, 1);
        this.setState({listMediaSelected});
        return;
      }
    }

    listMediaSelected.push(media);
    this.setState({listMediaSelected});
  };

  onDone = () => {
    const {privacyId, userInclude, listMediaSelected} = this.state;
    const {navigation} = this.props;
    if (navigation.state.params && navigation.state.params.addMoreMedia) {
      navigation.state.params.addMoreMedia(listMediaSelected);
      navigation.goBack();
      return;
    }
    navigation.replace(Screens.PHOTO_ALBUM, {
      listMedia: listMediaSelected,
      privacyId,
      userInclude,
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

  renderCenterHeader = () => {
    const data = [
      {
        value: 'All',
        label: strings('all'),
      },
      {
        value: 'Photos',
        label: strings('photos'),
      },
      {
        value: 'Videos',
        label: strings('videos'),
      },
    ];

    return (
      <Block width={200}>
        <Dropdown
          data={data}
          disabled={this.mediaType}
          value={this.mediaType || data[0].value}
          dropdownOffset={{top: 15, left: 16}}
          dropdownPosition={(20, 0)}
          pickerStyle={{width: 200}}
          onChangeText={this.onFilter}
        />
      </Block>
    );
  };

  renderRightHeader = () => {
    return (
      <Button style={{height: null}} color={null} onPress={this.launchCamera}>
        <Icon name={'camera'} color={Colors.white} size={25} />
      </Button>
    );
  };

  renderImageItem = ({item, index}) => {
    const node = item.node;
    const imageMargin = 5;
    const imageSize = (this.state.containerWidth - imageMargin * 2) / 3;
    return (
      <ImageItem
        key={index}
        style={{
          width: imageSize,
          height: imageSize,
          marginLeft: index % 3 == 0 ? 0 : imageMargin,
          marginTop: index < 3 ? 0 : imageMargin,
        }}
        type={node.type}
        checked={node.checked}
        uri={node.image.uri}
        repeat={true}
        onSelected={this.multiSelect}
        onPress={() => this.onSelectedMedia(node)}
      />
    );
  };

  render() {
    const {listMedia, listMediaSelected} = this.state;
    const {navigation} = this.props;

    return (
      <Block style={Style.view}>
        <Header
          isShowBack
          navigation={navigation}
          centerHeader={this.renderCenterHeader()}
          rightIcon={this.renderRightHeader()}
        />
        <Block
          margin={[8]}
          onLayout={(event) =>
            this.setState({containerWidth: event.nativeEvent.layout.width})
          }>
          <FlatList
            data={listMedia}
            renderItem={this.renderImageItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
          />
        </Block>

        {listMediaSelected.length > 0 && (
          <Block absolute style={Style.containerDone}>
            <Button
              color={Colors.primary}
              style={Style.buttonDone}
              onPress={this.onDone}>
              <Text size={15} color={Colors.white}>
                {strings('done')} ({listMediaSelected.length})
              </Text>
            </Button>
          </Block>
        )}
      </Block>
    );
  }
}

export default MediaSelectScreen;
